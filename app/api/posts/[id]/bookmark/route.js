import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

// POST /api/posts/[id]/bookmark — toggle bookmark
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id: postId } = await params;

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email.toLowerCase())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Check if already bookmarked
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      // Remove bookmark
      await supabase.from('bookmarks').delete().eq('id', existing.id);
      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await supabase.from('bookmarks').insert({ post_id: postId, user_id: user.id });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark toggle error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
