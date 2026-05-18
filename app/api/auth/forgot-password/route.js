import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { sendPasswordResetEmail } from '@/lib/email';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address required.' }, { status: 400 });
    }

    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id, first_name')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (!user) {
      // Don't leak that the email doesn't exist for security reasons
      return NextResponse.json({ success: true, message: 'If the email exists, a code was sent.' });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Invalidate previous reset codes
    await supabase
      .from('password_resets')
      .update({ used: true })
      .eq('email', email.toLowerCase())
      .eq('used', false);

    // Insert new reset code
    const { error: insertError } = await supabase
      .from('password_resets')
      .insert({
        email: email.toLowerCase(),
        code: otpHash,
        expires_at: expiresAt,
        used: false,
      });

    if (insertError) {
      console.error('Failed to insert password reset code:', insertError);
      return NextResponse.json({ error: 'Failed to generate reset code.' }, { status: 500 });
    }

    // Send the email
    await sendPasswordResetEmail(email.toLowerCase(), otp, user.first_name);

    return NextResponse.json({ success: true, message: 'Recovery code dispatched.' });
  } catch (error) {
    console.error('Forgot password route error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
