import { kv } from '@vercel/kv';
import { sendContactEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request, context) {
  try {
    const params = await context.params;
    const token = params.token;

    // Get pending contact
    const contact = await kv.get(`contact:${token}`);

    if (!contact) {
      return NextResponse.json(
        { error: 'Link expired or invalid' },
        { status: 400 }
      );
    }

    // Mark as confirmed in database
    await kv.set(`contact:${token}`, {
      ...contact,
      confirmed: true,
      confirmedAt: new Date().toISOString()
    });

    // Send confirmation to admin
    await sendContactEmail({
      name: contact.name,
      email: contact.email,
      message: contact.message
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirmation error:', error);
    return NextResponse.json(
      { error: 'Confirmation failed' },
      { status: 500 }
    );
  }
}