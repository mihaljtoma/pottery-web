import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const posts = await kv.get('gallery_posts') || [];
    // Sort by newest first
    const sorted = posts.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json([], { status: 500 });
  }
}