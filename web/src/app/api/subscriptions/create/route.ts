import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { user, supabase } = await getAuthenticatedUser();

    // Check if user already has an active subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSub) {
      return NextResponse.json({ error: 'User already has an active subscription' }, { status: 400 });
    }

    // TODO: Initialize Razorpay and create subscription
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const subscription = await razorpay.subscriptions.create({ plan_id: process.env.RAZORPAY_PLAN_ID, customer_notify: 1, total_count: 12 });
    
    // Mock Razorpay subscription creation
    const mockSubscriptionId = `sub_${crypto.randomBytes(8).toString('hex')}`;

    return NextResponse.json({
      subscription_id: mockSubscriptionId,
      status: 'created'
    });

  } catch (error: any) {
    console.error('Subscription Create Error:', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
