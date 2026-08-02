import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    const { id } = params;

    const { data: session, error } = await supabase
      .from('expert_sessions')
      .select('*, expert:experts(full_name, avatar_url, expertise)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      throw error;
    }

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Session ID GET Error:', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
