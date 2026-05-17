import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required for transmission.' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid origin terminal address.' }, { status: 400 });
    }

    // Send the email using Nodemailer
    await sendContactEmail(name, email, subject, message);

    return NextResponse.json({ success: true, message: 'Message securely transmitted to MacroShift Terminal.' });
  } catch (error) {
    console.error('Contact route error:', error);
    return NextResponse.json({ error: error.message || 'Transmission failed. Ensure network connection.' }, { status: 500 });
  }
}
