import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    const { searchParams } = new URL(request.url);
    const assessment_id = searchParams.get('assessment_id');

    if (!assessment_id) {
      return NextResponse.json({ error: 'Missing assessment_id' }, { status: 400 });
    }

    const { data: assessment, error } = await supabase
      .from('assessments')
      .select('status, ai_output')
      .eq('id', assessment_id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      throw error;
    }

    if (assessment.status !== 'completed' || !assessment.ai_output) {
      return NextResponse.json({ error: 'Result not ready or failed' }, { status: 404 });
    }

    return NextResponse.json(assessment.ai_output);

  } catch (error: any) {
    console.error('Diagnostic Result Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
