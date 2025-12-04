import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const products = await kv.get('products');
    const categories = await kv.get('categories');
    
    return NextResponse.json({
      products: products || [],
      productsCount: products ? products.length : 0,
      categories: categories || [],
      categoriesCount: categories ? categories.length : 0
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
