import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { supabase } = await getAuthenticatedUser();
    const { id } = params;

    const { data: expert, error } = await supabase
      .from('experts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
      throw error;
    }

    return NextResponse.json(expert);
  } catch (error: any) {
    console.error('Expert ID GET Error:', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
