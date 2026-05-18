import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Comment content cannot be empty.' }, { status: 400 });
    }

    // Get the user ID from the session email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email.toLowerCase())
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Insert comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: id,
        user_id: user.id,
        content: content.trim(),
      })
      .select(`
        id, content, created_at,
        users:user_id (id, email, role, first_name, last_name, username, avatar_url, is_verified)
      `)
      .single();

    if (error) {
      console.error('Comment insertion error:', error);
      return NextResponse.json({ error: 'Failed to post comment.' }, { status: 500 });
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Comment route error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
