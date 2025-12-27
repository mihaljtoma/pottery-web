import { NextResponse } from 'next/server';
import { saveContactSubmission } from '@/lib/db';
import { sendConfirmationEmail } from '@/lib/email';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { name, email, message, productName, productId } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Generate confirmation token
    const confirmationToken = uuidv4();
    const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/confirm-contact/${confirmationToken}`;

    // Store pending contact (expires in 24 hours)
    await kv.set(`contact:${confirmationToken}`, {
      name,
      email,
      message,
      productName,
      productId,
      confirmed: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }, { ex: 86400 });

    // Send confirmation email
    const confirmationResult = await sendConfirmationEmail({
      name,
      email,
      confirmationUrl,
      productName
    });

    if (!confirmationResult.success) {
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Confirmation email sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}