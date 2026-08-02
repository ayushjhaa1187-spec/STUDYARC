import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { z } from 'zod';
import crypto from 'crypto';

const SessionSchema = z.object({
  expert_id: z.string().uuid(),
  session_type: z.string(),
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().min(15).max(120)
});

export async function POST(request: Request) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    const body = await request.json();
    const validatedData = SessionSchema.parse(body);

    // Fetch expert to calculate amount
    const { data: expert, error: expertError } = await supabase
      .from('experts')
      .select('hourly_rate')
      .eq('id', validatedData.expert_id)
      .single();

    if (expertError || !expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    const amountPaise = Math.round((expert.hourly_rate * validatedData.duration_minutes) / 60) * 100;

    // Create session in DB as pending
    const { data: session, error: sessionError } = await supabase
      .from('expert_sessions')
      .insert({
        user_id: user.id,
        expert_id: validatedData.expert_id,
        session_type: validatedData.session_type,
        scheduled_at: validatedData.scheduled_at,
        duration_minutes: validatedData.duration_minutes,
        amount: amountPaise,
        status: 'pending'
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // TODO: Create actual Razorpay order
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await razorpay.orders.create({ amount: amountPaise, currency: 'INR', receipt: session.id });
    
    // For now, return a mock order ID
    const mockOrderId = `order_mock_${crypto.randomBytes(8).toString('hex')}`;

    return NextResponse.json({
      session_id: session.id,
      payment_order_id: mockOrderId, // Replace with order.id
      amount: amountPaise
    });

  } catch (error: any) {
    console.error('Session Create Error:', error);
    if (error.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
