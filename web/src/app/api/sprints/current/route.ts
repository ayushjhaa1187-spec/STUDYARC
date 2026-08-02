import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Fetch active sprint
  const { data: sprint, error: sprintError } = await supabase
    .from('sprints')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (sprintError || !sprint) {
    return NextResponse.json({ error: 'No active sprint found' }, { status: 404 });
  }

  // 2. Fetch daily tasks for this sprint
  const { data: daily_tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('day, title, description')
    .eq('sprint_id', sprint.id)
    .order('day', { ascending: true });

  // 3. Fetch progress logs
  const { data: progress, error: progressError } = await supabase
    .from('daily_progress')
    .select('id, day, is_completed, completed_at')
    .eq('sprint_id', sprint.id)
    .eq('user_id', user.id)
    .order('day', { ascending: true });

  if (tasksError || progressError) {
    return NextResponse.json({ error: 'Failed to fetch sprint data' }, { status: 500 });
  }

  return NextResponse.json({
    sprint,
    daily_tasks,
    progress
  });
}
