import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { kv } from '@vercel/kv';

export async function DELETE(request, context) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    const posts = await kv.get('gallery_posts') || [];
    const filtered = posts.filter(p => p.id !== params.id);
    await kv.set('gallery_posts', filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete gallery post error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}