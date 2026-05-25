import { NextResponse } from 'next/server';
import { supabase, ensureUser } from '@/lib/supabase';
import { auth } from '@/auth';

// POST /api/posts/[id]/like — toggle like
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id: postId } = await params;

    const user = await ensureUser(session);

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Check if already liked
    const { data: existing, error: existingError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingError) {
      console.error('Like lookup error:', existingError);
      return NextResponse.json({ error: 'Failed to check like status.' }, { status: 500 });
    }

    if (existing) {
      // Unlike
      const { error: deleteError } = await supabase.from('likes').delete().eq('id', existing.id);
      if (deleteError) {
        console.error('Unlike delete error:', deleteError);
        return NextResponse.json({ error: 'Failed to unlike post.' }, { status: 500 });
      }
      // Return updated count
      const { count, error: countError } = await supabase.from('likes').select('id', { head: true, count: 'exact' }).eq('post_id', postId);
      if (countError) {
        console.error('Like count error:', countError);
        return NextResponse.json({ error: 'Failed to refresh like count.' }, { status: 500 });
      }
      return NextResponse.json({ liked: false, likes_count: count || 0 });
    } else {
      // Like
      const { error: insertError } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      if (insertError) {
        console.error('Like insert error:', insertError);
        return NextResponse.json({ error: 'Failed to like post.' }, { status: 500 });
      }
      const { count, error: countError } = await supabase.from('likes').select('id', { head: true, count: 'exact' }).eq('post_id', postId);
      if (countError) {
        console.error('Like count error:', countError);
        return NextResponse.json({ error: 'Failed to refresh like count.' }, { status: 500 });
      }
      return NextResponse.json({ liked: true, likes_count: count || 0 });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
