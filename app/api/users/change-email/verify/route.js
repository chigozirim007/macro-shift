import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    console.log(">>> [ADMIN] Final Identity Handover Initiated...");
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { newEmail, code } = await request.json();
    console.log(">>> [ADMIN] Handover Node:", newEmail);
    console.log(">>> [ADMIN] Code Verification Requested...");

    if (!newEmail || !code) {
      return NextResponse.json({ error: 'Missing verification parameters.' }, { status: 400 });
    }

    // Verify OTP for the new email
    const cleanEmail = newEmail.toLowerCase().trim();
    console.log(">>> [ADMIN] Querying Pending Codes for:", cleanEmail);
    
    const { data: verification, error: verifyError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', cleanEmail)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (verifyError || !verification) {
      console.log(">>> [ADMIN] Verification Failure: No active code found for", cleanEmail);
      return NextResponse.json({ error: 'No active verification code found for this node. Please request a new code.' }, { status: 400 });
    }

    const isExpired = new Date() > new Date(verification.expires_at);
    if (isExpired) {
      console.log(">>> [ADMIN] Verification Failure: Code expired.");
      return NextResponse.json({ error: 'Verification code has expired.' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(code, verification.code);
    if (!isMatch) {
      console.log(">>> [ADMIN] Verification Failure: Hash mismatch.");
      return NextResponse.json({ error: 'Incorrect verification code.' }, { status: 400 });
    }

    console.log(">>> [ADMIN] Verification Success. Synchronizing Database...");

    // Mark OTP as used
    await supabase
      .from('email_verifications')
      .update({ used: true })
      .eq('id', verification.id);

    // ATOMIC UPDATE: Finalize the email rotation
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        email: newEmail.toLowerCase(),
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id);

    if (updateError) {
      console.error('>>> [ADMIN] Database Sync Error:', updateError);
      return NextResponse.json({ error: 'Failed to finalize identity handover.' }, { status: 500 });
    }

    console.log(">>> [ADMIN] Handover Complete! Identity Node Synchronized.");
    return NextResponse.json({ success: true, message: 'Identity node synchronized successfully.' });
  } catch (error) {
    console.error('>>> [ADMIN] Critical Handover Error:', error);
    return NextResponse.json({ error: 'Internal server error during handover.' }, { status: 500 });
  }
}
