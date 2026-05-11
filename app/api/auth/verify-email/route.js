import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    // Find the latest valid, unused OTP for this email
    const { data: otpRecord, error: fetchError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !otpRecord) {
      return NextResponse.json({ error: 'No pending verification found. Please request a new code.' }, { status: 400 });
    }

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      await supabase.from('email_verifications').update({ used: true }).eq('id', otpRecord.id);
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    // Compare code with hash
    const isValid = await bcrypt.compare(code.trim(), otpRecord.code);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code. Please check and try again.' }, { status: 400 });
    }

    // Mark user as verified
    const { error: verifyError } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('email', email.toLowerCase());

    if (verifyError) {
      console.error('Verify update error:', verifyError);
      return NextResponse.json({ error: 'Failed to verify account. Please try again.' }, { status: 500 });
    }

    // Mark OTP as used
    await supabase.from('email_verifications').update({ used: true }).eq('id', otpRecord.id);

    return NextResponse.json({ success: true, message: 'Email verified successfully! You can now sign in.' });
  } catch (error) {
    console.error('Verify-email route error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
