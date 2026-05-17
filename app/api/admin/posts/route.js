import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function GET() {
  try {
    const session = await auth();
    
    const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'nwokedichigozirim747@gmail.com';
    
    // SECURITY GATE: Only admins can access this data
    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Level 5 Clearance Required" }, { status: 403 });
    }

    const { data: posts, error } = await supabase
      .from("posts")
      .select("id, title, content, category, likes_count, comments_count, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Admin post fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
