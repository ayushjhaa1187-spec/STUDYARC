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
      .select('status, ai_output, updated_at')
      .eq('id', assessment_id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      throw error;
    }

    let status = assessment.status;
    
    // Check for timeout (5 minutes)
    if (status === 'processing') {
      const updatedAt = new Date(assessment.updated_at).getTime();
      const now = Date.now();
      if (now - updatedAt > 5 * 60 * 1000) {
        status = 'failed';
        // Optionally update the DB here
      }
    }

    return NextResponse.json({ status });

  } catch (error: any) {
    console.error('Diagnostic Status Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
