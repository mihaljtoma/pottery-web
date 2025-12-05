import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getContactSubmissions } from '@/lib/db';

export async function GET() {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await getContactSubmissions();
    // Sort by newest first
    const sorted = messages.sort((a, b) => 
      new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}