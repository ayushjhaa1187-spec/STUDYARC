import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { z } from 'zod';

const FeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    const body = await request.json();
    const { rating, comment } = FeedbackSchema.parse(body);
    const { id } = params;

    // Update session
    const { data: session, error: updateError } = await supabase
      .from('expert_sessions')
      .update({ rating, feedback: comment })
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') return NextResponse.json({ error: 'Session not found or not completed' }, { status: 404 });
      throw updateError;
    }

    // Optional: Trigger edge function to recalculate expert average rating

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    console.error('Session Feedback Error:', error);
    if (error.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
