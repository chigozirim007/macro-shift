import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  'AI & Machine Learning',
  'Cloud & Infrastructure',
  'Software Development',
  'Emerging Hardware',
  'Trends',
];

export async function GET() {
  try {
    // Use head:true — zero rows transferred, just counts per category in parallel
    const results = await Promise.all(
      CATEGORIES.map(async (cat) => {
        const { count, error } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('category', cat);
        if (error) return { label: cat, rawCount: 0 };
        return { label: cat, rawCount: count || 0 };
      })
    );

    const trending = results
      .filter((r) => r.rawCount > 0)
      .sort((a, b) => b.rawCount - a.rawCount) // sort by actual number, not string
      .slice(0, 5)
      .map(({ label, rawCount }) => ({
        label,
        count: `${(rawCount * 1.2).toFixed(1)}K Zaps`,
      }));

    const finalTrending = trending.length > 0 ? trending : [
      { label: 'Strategic Shifts', count: '0.1K Zaps' },
      { label: 'Identity Nodes', count: '0.1K Zaps' },
    ];

    return NextResponse.json({ trending: finalTrending }, {
      headers: {
        // Cache for 60s on CDN/browser, serve stale for up to 5min while revalidating
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Trending fetch error:', error);
    return NextResponse.json({ trending: [] }, { status: 500 });
  }
}
