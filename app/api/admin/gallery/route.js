import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await kv.get('gallery_posts') || [];
    const sorted = posts.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const posts = await kv.get('gallery_posts') || [];
    
    const newPost = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    await kv.set('gallery_posts', posts);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Create gallery post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}