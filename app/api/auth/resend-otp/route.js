import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { sendVerificationEmail } from '@/lib/email';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Check user exists and is not already verified
    const { data: user } = await supabase
      .from('users')
      .select('first_name, is_verified')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 });
    }

    if (user.is_verified) {
      return NextResponse.json({ error: 'This account is already verified. Please sign in.' }, { status: 400 });
    }

    // Invalidate all previous OTPs
    await supabase
      .from('email_verifications')
      .update({ used: true })
      .eq('email', email.toLowerCase())
      .eq('used', false);

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await supabase.from('email_verifications').insert({
      email: email.toLowerCase(),
      code: otpHash,
      expires_at: expiresAt,
      used: false,
    });

    await sendVerificationEmail(email, otp, user.first_name);

    return NextResponse.json({ success: true, message: 'A new verification code has been sent to your email.' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
