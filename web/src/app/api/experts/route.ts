import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { supabase } = await getAuthenticatedUser();
    const { searchParams } = new URL(request.url);
    
    let query = supabase.from('experts').select('id, full_name, expertise, hourly_rate, avatar_url, min_rating, is_verified').eq('is_active', true);

    const expertise = searchParams.get('expertise');
    if (expertise) query = query.ilike('expertise', `%${expertise}%`);

    const { data: experts, error } = await query;
    if (error) throw error;

    return NextResponse.json(experts);
  } catch (error: any) {
    console.error('Experts GET Error:', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
