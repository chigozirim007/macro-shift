import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

// PUT /api/users/profile — update current user's profile
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { first_name, last_name, bio, location, avatar_url, current_password, new_password } = body;

    // Get user details including password hash
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, password_hash')
      .eq('email', session.user.email.toLowerCase())
      .maybeSingle();

    if (userError || !user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const updateData = {
      first_name: first_name !== undefined ? first_name : undefined,
      last_name: last_name !== undefined ? last_name : undefined,
      bio: bio !== undefined ? bio : undefined,
      location: location !== undefined ? location : undefined,
      avatar_url: avatar_url !== undefined ? avatar_url : undefined,
      updated_at: new Date().toISOString()
    };

    // Handle password change if requested
    if (new_password) {
      if (!current_password) {
        return NextResponse.json({ error: 'Current password is required to set a new one.' }, { status: 400 });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(current_password, user.password_hash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect current password.' }, { status: 400 });
      }

      // Hash new password
      updateData.password_hash = await bcrypt.hash(new_password, 10);
    }

    // Update profile
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
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
