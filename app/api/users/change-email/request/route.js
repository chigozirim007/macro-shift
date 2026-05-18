import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    console.log(">>> [ADMIN] Email Migration Initiated...");
    const session = await auth();
    console.log(">>> [ADMIN] Auth Clearance Check:", session ? "PASS" : "FAIL");

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { newEmail } = await request.json();
    console.log(">>> [ADMIN] Target Communication Node:", newEmail);

    if (!newEmail || !newEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid new email is required.' }, { status: 400 });
    }

    // Check if new email is already in use by a DIFFERENT user
    console.log(">>> [ADMIN] Checking for Node Collisions...");
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', newEmail.toLowerCase())
      .maybeSingle();

    if (existingUser && existingUser.id !== session.user.id) {
      console.log(">>> [ADMIN] Collision Detected: Node owned by another strategist.");
      return NextResponse.json({ error: 'This email is already in use by another strategist.' }, { status: 400 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Store in verification table linked to the NEW email
    console.log(">>> [ADMIN] Registering OTP in Secure Table...");
    await supabase.from('email_verifications').insert({
      email: newEmail.toLowerCase(),
      code: otpHash,
      expires_at: expiresAt,
      used: false,
    });

    // Send email to the NEW address
    console.log(">>> [ADMIN] Triggering SMTP Broadcast (Gmail)...");
    await sendVerificationEmail(newEmail.toLowerCase(), otp, session.user.name);
    console.log(">>> [ADMIN] Broadcast Successful!");

    return NextResponse.json({ success: true, message: 'Verification code broadcast to new node.' });
  } catch (error) {
    console.error('>>> [ADMIN] Critical Signal Error:', error);
    return NextResponse.json({ error: 'Failed to initiate migration broadcast.' }, { status: 500 });
  }
}
