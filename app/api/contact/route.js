import { NextResponse } from 'next/server';
import { saveContactSubmission } from '@/lib/db';
import { sendContactEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

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

    // Save to database
    await saveContactSubmission({ name, email, message });

    // Send email notification
    const emailResult = await sendContactEmail({ name, email, message });
    
    if (!emailResult.success) {
      console.error('Email failed but saved to database:', emailResult.error);
      // Still return success since it's saved to database
    }
    
    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}