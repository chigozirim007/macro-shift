import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

// PUT /api/users/profile — update current user's profile
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { first_name, last_name, bio, location, avatar_url } = body;

    // Get user ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email.toLowerCase())
      .maybeSingle();

    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    // Update profile
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        first_name: first_name !== undefined ? first_name : undefined,
        last_name: last_name !== undefined ? last_name : undefined,
        bio: bio !== undefined ? bio : undefined,
        location: location !== undefined ? location : undefined,
        avatar_url: avatar_url !== undefined ? avatar_url : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select('first_name, last_name, bio, location, avatar_url')
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('PUT /api/users/profile error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
