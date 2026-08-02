import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { z } from 'zod';

const DiagnosticSchema = z.object({
  goal: z.string(),
  skill_level: z.string(),
  hours_per_week: z.number().min(1).max(100),
  github_url: z.string().url().optional().or(z.literal('')),
  university: z.string().optional(),
  graduation_year: z.number().optional()
});

export async function POST(request: Request) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    const body = await request.json();
    
    // Validate input
    const validatedData = DiagnosticSchema.parse(body);

    // Insert assessment
    const { data: assessment, error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        ...validatedData,
        status: 'processing',
        ai_output: null
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger async job (Edge Function)
    // We don't await this so the route returns immediately
    supabase.functions.invoke('diagnostic-processor', {
      body: { assessment_id: assessment.id }
    }).catch(err => console.error('Failed to invoke diagnostic processor:', err));

    return NextResponse.json({ 
      assessment_id: assessment.id, 
      status: 'processing' 
    });

  } catch (error: any) {
    console.error('Diagnostic Submit Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
