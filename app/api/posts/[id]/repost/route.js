import { NextResponse } from 'next/server';
import { supabase, ensureUser } from '@/lib/supabase';
import { auth } from '@/auth';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id: postId } = await params;

    const user = await ensureUser(session);

    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    // Check if repost exists
    const { data: existing, error: existingError } = await supabase
      .from('reposts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingError) {
      console.error('Repost lookup error:', existingError);
      return NextResponse.json({ error: 'Failed to check repost status.' }, { status: 500 });
    }

    if (existing) {
      // Un-repost
      const { error: deleteError } = await supabase.from('reposts').delete().eq('id', existing.id);
      if (deleteError) {
        console.error('Repost delete error:', deleteError);
        return NextResponse.json({ error: 'Failed to remove repost.' }, { status: 500 });
      }
      const { count, error: countError } = await supabase.from('reposts').select('id', { head: true, count: 'exact' }).eq('post_id', postId);
      if (countError) {
        console.error('Repost count error:', countError);
        return NextResponse.json({ error: 'Failed to refresh repost count.' }, { status: 500 });
      }
      return NextResponse.json({ reposted: false, reposts_count: count || 0 });
    } else {
      // Repost
      const { error: insertError } = await supabase.from('reposts').insert({ post_id: postId, user_id: user.id });
      if (insertError) {
        console.error('Repost insert error:', insertError);
        return NextResponse.json({ error: 'Failed to repost.' }, { status: 500 });
      }
      const { count, error: countError } = await supabase.from('reposts').select('id', { head: true, count: 'exact' }).eq('post_id', postId);
      if (countError) {
        console.error('Repost count error:', countError);
        return NextResponse.json({ error: 'Failed to refresh repost count.' }, { status: 500 });
      }
      return NextResponse.json({ reposted: true, reposts_count: count || 0 });
    }
  } catch (error) {
    console.error('POST /api/posts/[id]/repost error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
