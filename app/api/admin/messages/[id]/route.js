import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { kv } from '@vercel/kv';

export async function PATCH(request, context) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    const { replied } = await request.json();
    
    const messages = await kv.get('contact_submissions') || [];
    const index = messages.findIndex(m => m.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    
    messages[index].replied = replied;
    await kv.set('contact_submissions', messages);
    
    return NextResponse.json(messages[index]);
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    const messages = await kv.get('contact_submissions') || [];
    const filtered = messages.filter(m => m.id !== params.id);
    await kv.set('contact_submissions', filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}