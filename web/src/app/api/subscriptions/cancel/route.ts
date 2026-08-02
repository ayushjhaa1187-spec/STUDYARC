import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { user, supabase } = await getAuthenticatedUser();

    // Fetch active subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('id, razorpay_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (fetchError || !subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // TODO: Cancel in Razorpay
    // const razorpay = new Razorpay({ ... });
    // await razorpay.subscriptions.cancel(subscription.razorpay_subscription_id);

    // Update in DB
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscription.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'Subscription cancelled' });

  } catch (error: any) {
    console.error('Subscription Cancel Error:', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
