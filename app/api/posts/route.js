import { NextResponse } from 'next/server';
import { supabase, ensureUser } from '@/lib/supabase';
import { auth } from '@/auth';

// GET /api/posts — fetch all posts with author + like/bookmark counts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const interests = searchParams.get('interests')?.split(',');
    const userId = searchParams.get('user_id');
    const bookmarkedBy = searchParams.get('bookmarked_by');
    const repostedBy = searchParams.get('reposted_by');
    const searchTerm = searchParams.get('query');

    // Get current user's ID if logged in
    const session = await auth();
    let currentUserId = null;
    if (session) {
      const user = await ensureUser(session);
      if (user) currentUserId = user.id;
    }

    let engagementPostIds = null;
    if (bookmarkedBy || repostedBy) {
      const table = bookmarkedBy ? 'bookmarks' : 'reposts';
      const engagementUserId = bookmarkedBy || repostedBy;
      const { data: engagementRows, error: engagementError } = await supabase
        .from(table)
        .select('post_id')
        .eq('user_id', engagementUserId);

      if (engagementError) {
        console.error('Engagement posts fetch error:', engagementError);
        return NextResponse.json({ error: 'Failed to fetch engagement posts.' }, { status: 500 });
      }

      engagementPostIds = [...new Set((engagementRows || []).map(row => row.post_id).filter(Boolean))];
      if (engagementPostIds.length === 0) {
        return NextResponse.json({ posts: [] }, {
          headers: {
            'Cache-Control': 'no-store'
          },
        });
      }
    }

    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        category,
        post_post_references,
        created_at,
        users:user_id (
          id,
          email,
          role,
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
      .order('created_at', { ascending: false })
      .limit(20); // prevent full-table scans — paginate if needed

    if (category && category !== 'All') {
      query = query.ilike('category', `%${category}%`);
    } else if (interests && interests.length > 0) {
      // Filter by interests (case-insensitive mapped to the categories)
      const mappedInterests = interests.map(i => {
        if (i === 'ai') return 'AI & Machine Learning';
        if (i === 'cloud') return 'Cloud & Infrastructure';
        if (i === 'dev') return 'Software Development';
        if (i === 'hardware') return 'Emerging Hardware';
        if (i === 'trends') return 'Global Trends';
        return i;
      });
      query = query.in('category', mappedInterests);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (engagementPostIds) {
      query = query.in('id', engagementPostIds);
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Posts fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
    }

    // If user is logged in, fetch their engagement data
    let userLikes = [], userBookmarks = [], userReposts = [];
    if (currentUserId && posts.length > 0) {
      const postIds = posts.map(p => p.id);
      
      const [
        { data: likes },
        { data: bookmarks },
        { data: reposts }
      ] = await Promise.all([
        supabase.from('likes').select('post_id').eq('user_id', currentUserId).in('post_id', postIds),
        supabase.from('bookmarks').select('post_id').eq('user_id', currentUserId).in('post_id', postIds),
        supabase.from('reposts').select('post_id').eq('user_id', currentUserId).in('post_id', postIds),
      ]);
      
      userLikes = likes || [];
      userBookmarks = bookmarks || [];
      userReposts = reposts || [];
    }

    // Normalize the aggregated counts and add user engagement status
    const normalized = posts.map(p => ({
      ...p,
      likes_count: p.likes?.[0]?.count ?? 0,
      bookmarks_count: p.bookmarks?.[0]?.count ?? 0,
      reposts_count: p.reposts?.[0]?.count ?? 0,
      comments_count: p.comments?.[0]?.count ?? 0,
      views_count: p.views_count ?? 0,
      liked: userLikes.some(l => l.post_id === p.id),
      bookmarked: userBookmarks.some(b => b.post_id === p.id),
      reposted: userReposts.some(r => r.post_id === p.id),
      likes: undefined,
      bookmarks: undefined,
      reposts: undefined,
      comments: undefined,
    }));

    // Responses include per-user engagement data; disable caching to ensure
    // clients always receive the latest DB state after interactions.
    return NextResponse.json({ posts: normalized }, {
      headers: {
        'Cache-Control': 'no-store'
      },
    });
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
    const { title, content, category, post_post_references, image_url } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category are required.' }, { status: 400 });
    }

    // Get user ID from DB, auto-creating if needed
    const user = await ensureUser(session);

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
        post_post_references: post_post_references || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Post insert error:', error);
      return NextResponse.json({ error: error.message || 'Failed to create post.' }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
