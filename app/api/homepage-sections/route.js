import { NextResponse } from 'next/server';
import { getHomepageSections, updateHomepageSections, updateSectionOrder } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const sections = await getHomepageSections();
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Get homepage sections error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage sections' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const sections = await updateHomepageSections(data);
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Update homepage sections error:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage sections' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const sections = await updateSectionOrder(data);
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Update section order error:', error);
    return NextResponse.json(
      { error: 'Failed to update section order' },
      { status: 500 }
    );
  }
}