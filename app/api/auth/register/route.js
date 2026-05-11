import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { sendVerificationEmail } from '@/lib/email';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, surname, username, email, phoneNumber, location, bio, password, interests } = body;

    // --- Validation ---
    if (!firstName || !surname || !email || !password || !username) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // --- Check email uniqueness ---
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, is_verified')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      if (existingUser.is_verified) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
      }
      // Unverified user: delete and re-register (allows re-signup if they lost the code)
      await supabase.from('users').delete().eq('id', existingUser.id);
    }

    // --- Check username uniqueness ---
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (existingUsername) {
      return NextResponse.json({ error: 'Username is already taken. Please choose another.' }, { status: 409 });
    }

    // --- Hash password ---
    const passwordHash = await bcrypt.hash(password, 12);

    // --- Create user (unverified) ---
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        first_name: firstName,
        last_name: surname,
        username: username.toLowerCase(),
        phone: phoneNumber || null,
        location: location || null,
        bio: bio || null,
        interests: interests || [],
        is_verified: false,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('User insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
    }

    // --- Generate + store OTP ---
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    // Invalidate any previous OTPs for this email
    await supabase
      .from('email_verifications')
      .update({ used: true })
      .eq('email', email.toLowerCase())
      .eq('used', false);

    const { error: otpError } = await supabase.from('email_verifications').insert({
      email: email.toLowerCase(),
      code: otpHash,
      expires_at: expiresAt,
      used: false,
    });

    if (otpError) {
      console.error('OTP insert error:', otpError);
      return NextResponse.json({ error: 'Failed to generate verification code.' }, { status: 500 });
    }

    // --- Send email ---
    await sendVerificationEmail(email, otp, firstName);

    return NextResponse.json({ success: true, message: 'Account created. Check your email for the verification code.' });
  } catch (error) {
    console.error('Register route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
