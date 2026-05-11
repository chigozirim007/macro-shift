import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id: targetUserId } = await params;

    // Get current user ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email.toLowerCase())
      .maybeSingle();

    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    if (user.id === targetUserId) {
        return NextResponse.json({ error: 'Cannot follow yourself.' }, { status: 400 });
    }

    // Check if follow exists
    const { data: existing } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (existing) {
      // Unfollow
      await supabase.from('follows').delete().eq('id', existing.id);
      return NextResponse.json({ followed: false });
    } else {
      // Follow
      await supabase.from('follows').insert({ follower_id: user.id, following_id: targetUserId });
      return NextResponse.json({ followed: true });
    }
  } catch (error) {
    console.error('POST /api/users/[id]/follow error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
