import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id: postId } = await params;

    // Get user ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email.toLowerCase())
      .maybeSingle();

    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    // Check if repost exists
    const { data: existing } = await supabase
      .from('reposts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      // Un-repost
      await supabase.from('reposts').delete().eq('id', existing.id);
      return NextResponse.json({ reposted: false });
    } else {
      // Repost
      await supabase.from('reposts').insert({ post_id: postId, user_id: user.id });
      return NextResponse.json({ reposted: true });
    }
  } catch (error) {
    console.error('POST /api/posts/[id]/repost error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
