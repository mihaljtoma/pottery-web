import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      categoryId: searchParams.get('categoryId'),
      availability: searchParams.get('availability'),
      featured: searchParams.get('featured'),
      search: searchParams.get('search')
    };

    const products = await getProducts(filters);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    console.log('Creating product:', data); // ADD THIS LINE FOR DEBUGGING
    const product = await createProduct(data);
    console.log('Product created:', product); // ADD THIS LINE FOR DEBUGGING
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}