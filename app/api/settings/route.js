import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = await getSettings();
    
    // Osiguraj da tagline i aboutText imaju oba jezika
    const localizedSettings = {
      ...settings,
      tagline: settings.tagline || {
        hr: 'Ručno Izrađena Keramika s Ljubavlju',
        en: 'Handcrafted Pottery with Love'
      },
      aboutText: settings.aboutText || {
        hr: '',
        en: ''
      }
    };
    
    return NextResponse.json(localizedSettings);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
