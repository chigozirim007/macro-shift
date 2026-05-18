import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, code, password } = await request.json();

    if (!email || !code || !password || password.length < 8) {
      return NextResponse.json({ error: 'Missing or invalid parameters.' }, { status: 400 });
    }

    // Find the reset code for this email that isn't used
    const { data: resets, error: resetError } = await supabase
      .from('password_resets')
      .select('id, code, expires_at')
      .eq('email', email.toLowerCase())
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (resetError || !resets || resets.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired recovery code.' }, { status: 400 });
    }

    const resetRecord = resets[0];

    // Check expiration
    if (new Date(resetRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Recovery code has expired.' }, { status: 400 });
    }

    // Verify OTP hash
    const isValid = await bcrypt.compare(code, resetRecord.code);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid recovery code.' }, { status: 400 });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 12);

    // Update the user's password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('email', email.toLowerCase());

    if (updateError) {
      console.error('Failed to update user password:', updateError);
      return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
    }

    // Mark code as used
    await supabase
      .from('password_resets')
      .update({ used: true })
      .eq('id', resetRecord.id);

    return NextResponse.json({ success: true, message: 'Password has been reset.' });
  } catch (error) {
    console.error('Reset password route error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
