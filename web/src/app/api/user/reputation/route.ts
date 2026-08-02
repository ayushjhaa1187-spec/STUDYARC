import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    
    // Assuming reputation_points is on the profile or a separate table.
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('reputation_points')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
         return NextResponse.json({ reputation_points: 0, badges: [] });
      }
      throw error;
    }

    // In a real implementation, you'd also fetch badges from a 'user_badges' table
    return NextResponse.json({
      reputation_points: profile.reputation_points || 0,
      badges: [] // Placeholder for badges
    });
  } catch (error: any) {
    console.error('Reputation GET Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
