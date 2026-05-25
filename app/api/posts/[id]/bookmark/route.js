import { NextResponse } from 'next/server';
import { supabase, ensureUser } from '@/lib/supabase';
import { auth } from '@/auth';

// POST /api/posts/[id]/bookmark — toggle bookmark
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

    // Check if already bookmarked
    const { data: existing, error: existingError } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingError) {
      console.error('Bookmark lookup error:', existingError);
      return NextResponse.json({ error: 'Failed to check bookmark status.' }, { status: 500 });
    }

    if (existing) {
      // Remove bookmark
      const { error: deleteError } = await supabase.from('bookmarks').delete().eq('id', existing.id);
      if (deleteError) {
        console.error('Bookmark delete error:', deleteError);
        return NextResponse.json({ error: 'Failed to remove bookmark.' }, { status: 500 });
      }
      const { count, error: countError } = await supabase.from('bookmarks').select('id', { head: true, count: 'exact' }).eq('post_id', postId);
      if (countError) {
        console.error('Bookmark count error:', countError);
        return NextResponse.json({ error: 'Failed to refresh bookmark count.' }, { status: 500 });
      }
      return NextResponse.json({ bookmarked: false, bookmarks_count: count || 0 });
    } else {
      // Add bookmark
      const { error: insertError } = await supabase.from('bookmarks').insert({ post_id: postId, user_id: user.id });
      if (insertError) {
        console.error('Bookmark insert error:', insertError);
        return NextResponse.json({ error: 'Failed to bookmark post.' }, { status: 500 });
      }
      const { count, error: countError } = await supabase.from('bookmarks').select('id', { head: true, count: 'exact' }).eq('post_id', postId);
      if (countError) {
        console.error('Bookmark count error:', countError);
        return NextResponse.json({ error: 'Failed to refresh bookmark count.' }, { status: 500 });
      }
      return NextResponse.json({ bookmarked: true, bookmarks_count: count || 0 });
    }
  } catch (error) {
    console.error('Bookmark toggle error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
