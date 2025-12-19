import { useState, useEffect, useCallback } from 'react';

// Cache za settings
let settingsCache = null;
let settingsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuta

const defaultSettings = {
  siteName: 'Pottery Studio',
  tagline: {
    hr: 'Ručno Izrađena Keramika s Ljubavlju',
    en: 'Handcrafted Pottery with Love'
  },
  aboutText: {
    hr: '',
    en: ''
  },
  contactEmail: 'contact@potterystudio.com',
  contactPhone: '+1 (555) 123-4567',
  studioAddress: '123 Pottery Lane\nArtisan Quarter\nCreative City, CC 12345',
  instagramUrl: '',
  facebookUrl: '',
  twitterUrl: '',
  businessHours: {
    monday: '9:00 AM - 5:00 PM',
    tuesday: '9:00 AM - 5:00 PM',
    wednesday: '9:00 AM - 5:00 PM',
    thursday: '9:00 AM - 5:00 PM',
    friday: '9:00 AM - 5:00 PM',
    saturday: '10:00 AM - 3:00 PM',
    sunday: 'Closed'
  }
};

export function useSettings(locale = 'hr') {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    const now = Date.now();
    
    // Ako je cache još valjan, koristi cache
    if (settingsCache && now - settingsCacheTime < CACHE_DURATION) {
      setSettings(settingsCache);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      const res = await fetch('/api/settings');
      
      if (res.ok) {
        const data = await res.json();
        settingsCache = data;
        settingsCacheTime = now;
        setSettings(data);
        setError(null);
      } else {
        setSettings(defaultSettings);
        setError('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setSettings(defaultSettings);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Localize settings
  const localizedSettings = {
    ...settings,
    tagline: settings.tagline?.[locale] || settings.tagline?.hr || defaultSettings.tagline.hr,
    aboutText: settings.aboutText?.[locale] || settings.aboutText?.hr || defaultSettings.aboutText.hr,
  };

  return { settings: localizedSettings, loading, error };
}