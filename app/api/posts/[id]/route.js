import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

// GET /api/posts/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        id, title, content, category, post_post_references, created_at, updated_at, views_count,
        users:user_id ( id, email, role, first_name, last_name, username, avatar_url, is_verified ),
        likes(count),
        bookmarks(count),
        reposts(count),
        comments(
          id, content, created_at,
          users:user_id (id, email, role, first_name, last_name, username, avatar_url, is_verified)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    // Increment view count (fire-and-forget — don't block the response)
    supabase
      .from('posts')
      .update({ views_count: (post.views_count || 0) + 1 })
      .eq('id', id)
      .then(() => {});

    return NextResponse.json({
      post: {
        ...post,
        likes_count: post.likes?.[0]?.count ?? 0,
        bookmarks_count: post.bookmarks?.[0]?.count ?? 0,
        reposts_count: post.reposts?.[0]?.count ?? 0,
        likes: undefined,
        bookmarks: undefined,
        reposts: undefined,
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PUT /api/posts/[id] — update (author only)
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, category, references: post_post_references } = body;

    // Verify ownership
    const { data: post } = await supabase
      .from('posts')
      .select('user_id, users:user_id(email)')
      .eq('id', id)
      .single();

    const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'nwokedichigozirim747@gmail.com';
    
    if (!post || (post.users?.email !== session.user.email.toLowerCase() && !isAdmin)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const { data: updated, error } = await supabase
      .from('posts')
      .update({ title, content, category, post_post_references: post_post_references || [], updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update post.' }, { status: 500 });
    }

    return NextResponse.json({ post: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] — author only
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id } = await params;

    const { data: post } = await supabase
      .from('posts')
      .select('user_id, users:user_id(email)')
      .eq('id', id)
      .single();

    const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'nwokedichigozirim747@gmail.com';
    
    if (!post || (post.users?.email !== session.user.email.toLowerCase() && !isAdmin)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    await supabase.from('posts').delete().eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
