import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { user, supabase } = await getAuthenticatedUser();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('status, end_date, plan_type')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ status: 'none', end_date: null });
      }
      throw error;
    }

    return NextResponse.json({
      status: subscription.status,
      end_date: subscription.end_date,
      plan_type: subscription.plan_type
    });

  } catch (error: any) {
    console.error('Subscription Plan GET Error:', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
