import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function POST(request, { params }) {
  try {
    const session = await auth();
    const { userId } = params;
    const { is_verified } = await request.json();
    
    const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'nwokedichigozirim747@gmail.com';
    
    // SECURITY GATE: Only admins can perform this action
    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Level 5 Clearance Required" }, { status: 403 });
    }

    const { error } = await supabase
      .from("users")
      .update({ is_verified })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true, is_verified });
  } catch (error) {
    console.error("Verification update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
