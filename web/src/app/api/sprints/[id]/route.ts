import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    const { id } = params;

    // Fetch the sprint
    const { data: sprint, error } = await supabase
      .from('sprints')
      .select('*, daily_progress(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({
      sprint: {
        id: sprint.id,
        name: sprint.name,
        status: sprint.status,
        total_days: sprint.total_days,
        current_day: sprint.current_day,
        streak: sprint.streak,
        started_at: sprint.started_at,
        last_activity_at: sprint.last_activity_at,
        completed_at: sprint.completed_at
      },
      daily_tasks: sprint.daily_tasks, // Assuming tasks are JSONB array in 'sprints.daily_tasks'
      progress: sprint.daily_progress
    });

  } catch (error: any) {
    console.error('Sprint ID GET Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
