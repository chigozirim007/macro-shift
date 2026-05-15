import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/users/[id]/stats — get follower and following counts
export async function GET(request, { params }) {
  try {
    const { id: userId } = await params;

    // Get counts in parallel
    const [followersRes, followingRes] = await Promise.all([
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId),
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId)
    ]);

    const { count: followersCount, error: fError } = followersRes;
    const { count: followingCount, error: followingError } = followingRes;

    if (fError || followingError) {
      console.error('Stats fetch error:', fError || followingError);
      return NextResponse.json({ error: 'Failed to fetch stats.' }, { status: 500 });
    }

    return NextResponse.json({
      followers: followersCount || 0,
      following: followingCount || 0
    });
  } catch (error) {
    console.error('GET /api/users/[id]/stats error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
