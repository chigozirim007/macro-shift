import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

// GET /api/posts — fetch all posts with author + like/bookmark counts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const userId = searchParams.get('user_id');

    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        category,
        post_references,
        created_at,
        users:user_id (
          id,
          first_name,
          last_name,
          username,
          avatar_url,
          is_verified
        ),
        likes(count),
        bookmarks(count),
        reposts(count),
        comments(count),
        views_count
      `)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Posts fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
    }

    // Normalize the aggregated counts
    const normalized = posts.map(p => ({
      ...p,
      likes_count: p.likes?.[0]?.count ?? 0,
      bookmarks_count: p.bookmarks?.[0]?.count ?? 0,
      reposts_count: p.reposts?.[0]?.count ?? 0,
      comments_count: p.comments?.[0]?.count ?? 0,
      views_count: p.views_count ?? 0,
      likes: undefined,
      bookmarks: undefined,
      reposts: undefined,
      comments: undefined,
    }));

    return NextResponse.json({ posts: normalized });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST /api/posts — create a new post (requires auth)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, references: post_references, image_url } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category are required.' }, { status: 400 });
    }

    // Get user ID from DB
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email.toLowerCase())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title,
        content,
        category,
        post_references: post_references || [],
        image_url: image_url || null, // if you choose to support media upload
      })
      .select()
      .single();

    if (error) {
      console.error('Post insert error:', error);
      return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
