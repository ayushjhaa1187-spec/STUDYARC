import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { day } = body;

    if (typeof day !== 'number') {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
    }

    // Fetch active sprint
    const { data: sprint, error: sprintError } = await supabase
      .from('sprints')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (sprintError || !sprint) {
      return NextResponse.json({ error: 'No active sprint found' }, { status: 404 });
    }

    if (day > sprint.total_days) {
      return NextResponse.json({ error: 'Day exceeds total sprint days' }, { status: 400 });
    }

    // Check if already completed
    const { data: existingProgress } = await supabase
      .from('daily_progress')
      .select('id')
      .eq('sprint_id', sprint.id)
      .eq('day', day)
      .single();

    if (existingProgress) {
      return NextResponse.json({ error: 'Day already completed' }, { status: 400 });
    }

    // 1. Insert daily progress
    const { error: insertError } = await supabase
      .from('daily_progress')
      .insert({
        user_id: user.id,
        sprint_id: sprint.id,
        day,
        is_completed: true,
        completed_at: new Date().toISOString()
      });

    if (insertError) throw insertError;

    // 2. Calculate streak logic
    let newStreak = sprint.streak || 0;
    const now = new Date();
    
    if (sprint.last_activity_at) {
      const lastActivity = new Date(sprint.last_activity_at);
      const isYesterday = (now.getTime() - lastActivity.getTime()) <= 48 * 60 * 60 * 1000 && now.getDate() !== lastActivity.getDate();
      const isToday = now.getDate() === lastActivity.getDate() && now.getMonth() === lastActivity.getMonth() && now.getFullYear() === lastActivity.getFullYear();

      if (isYesterday) {
        newStreak += 1;
      } else if (!isToday) {
        newStreak = 1;
      }
    } else {
      newStreak = 1; // First activity
    }

    // 3. Update sprints table
    const newDay = Math.min(day + 1, sprint.total_days);
    const status = day >= sprint.total_days ? 'completed' : 'active';

    const { error: updateSprintError } = await supabase
      .from('sprints')
      .update({
        current_day: newDay,
        last_activity_at: now.toISOString(),
        streak: newStreak,
        status,
        ...(status === 'completed' ? { completed_at: now.toISOString() } : {})
      })
      .eq('id', sprint.id);

    if (updateSprintError) throw updateSprintError;

    // 4. Log activity
    await supabase.from('user_activities').insert({
      user_id: user.id,
      event_type: 'task_completed',
      metadata: { sprint_id: sprint.id, day }
    });

    return NextResponse.json({
      success: true,
      new_day: newDay,
      streak: newStreak,
      sprint_completed: status === 'completed'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
