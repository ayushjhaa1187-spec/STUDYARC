import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Profile GET Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    
    // Validate request body
    const body = await request.json();
    
    // In a real app, use Zod for validation here
    const updateData = {
      full_name: body.full_name,
      university: body.university,
      graduation_year: body.graduation_year,
      avatar_url: body.avatar_url,
      updated_at: new Date().toISOString()
    };

    // Filter out undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(cleanUpdateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Profile PUT Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
