import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email?.toLowerCase();

    // Fetch user stats from real posts
    const { count: postsCount, error: postsError } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (postsError) throw postsError;

    // Determine clearance level based on role/email
    const isAdmin = session.user.role === 'admin' || userEmail === 'nwokedichigozirim747@gmail.com';
    
    // Dynamic level calculation (Mocked for now but based on real post count)
    const level = isAdmin ? 'Apex-5' : `Apex-${Math.min(Math.floor((postsCount || 0) / 5) + 1, 4)}`;

    return NextResponse.json({
      stats: {
        posts: postsCount || 0,
        followers: Math.floor((postsCount || 0) * 12.5), // Projected reach based on signals
        level: level,
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ stats: { posts: 0, followers: 0, level: 'Apex-1' } }, { status: 500 });
  }
}
