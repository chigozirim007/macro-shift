import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch categories and counts from real posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('category');

    if (error) throw error;

    // Aggregate trending categories
    const counts = posts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    const trending = Object.entries(counts)
      .map(([label, count]) => ({
        label,
        count: `${(count * 1.2).toFixed(1)}K Zaps` // Aesthetic multiplier for cinematic feel
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Default trending if no posts exist
    const finalTrending = trending.length > 0 ? trending : [
      { label: 'Strategic Shifts', count: '0.1K Zaps' },
      { label: 'Identity Nodes', count: '0.1K Zaps' }
    ];

    return NextResponse.json({ trending: finalTrending });
  } catch (error) {
    console.error('Trending fetch error:', error);
    return NextResponse.json({ trending: [] }, { status: 500 });
  }
}
