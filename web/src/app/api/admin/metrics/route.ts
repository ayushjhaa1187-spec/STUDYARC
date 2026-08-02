import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { supabase } = await getAuthenticatedUser();

    // Fetch aggregate counts concurrently
    const [usersCount, activeSprintsCount, revenueData] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('sprints').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('expert_sessions').select('amount').eq('status', 'completed')
    ]);

    const totalRevenuePaise = (revenueData.data || []).reduce((acc: number, val: any) => acc + (val.amount || 0), 0);

    return NextResponse.json({
      total_users: usersCount.count || 0,
      active_sprints: activeSprintsCount.count || 0,
      total_revenue_inr: totalRevenuePaise / 100
    });
  } catch (error: any) {
    console.error('Admin Metrics GET Error:', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
