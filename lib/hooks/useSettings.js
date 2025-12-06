import { useState, useEffect } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Pottery Studio',
    tagline: 'Handcrafted Pottery with Love',
    aboutText: '',
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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading };
}