import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { z } from 'zod';

const StatusSchema = z.object({
  sprint_id: z.string().uuid(),
  status: z.enum(['paused', 'active', 'abandoned'])
});

export async function PATCH(request: Request) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    const body = await request.json();
    const { sprint_id, status } = StatusSchema.parse(body);

    const { data: sprint, error: fetchError } = await supabase
      .from('sprints')
      .select('id, status')
      .eq('id', sprint_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    if (sprint.status === 'completed') {
       return NextResponse.json({ error: 'Cannot change status of a completed sprint' }, { status: 400 });
    }

    const { data: updatedSprint, error: updateError } = await supabase
      .from('sprints')
      .update({ status })
      .eq('id', sprint_id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, sprint: updatedSprint });

  } catch (error: any) {
    console.error('Sprint Status PATCH Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
