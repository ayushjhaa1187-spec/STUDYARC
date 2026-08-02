import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { assessment, sprint } = body;

    // Insert assessment
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        goal: assessment.goal,
        skill_level: assessment.skill_level,
        hours_per_week: assessment.hours_per_week,
        github_url: assessment.github_url || null,
        ai_output: sprint
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('Assessment insert error:', assessmentError);
      return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
    }

    // Insert sprint
    const { data: sprintData, error: sprintError } = await supabase
      .from('sprints')
      .insert({
        user_id: user.id,
        assessment_id: assessmentData.id,
        name: sprint.name,
        status: 'active',
        daily_tasks: sprint.daily_tasks,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (sprintError) {
      console.error('Sprint insert error:', sprintError);
      return NextResponse.json({ error: 'Failed to create sprint' }, { status: 500 });
    }

    return NextResponse.json({ success: true, sprint: sprintData });
  } catch (error) {
    console.error('Start Sprint API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
