'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import Link from 'next/link';

export default function HomepageCustomizationPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/homepage-sections');
      const data = await res.json();
      setSections(data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = (id) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedItem === null || draggedItem === index) return;

    const newSections = [...sections];
    const draggedSection = newSections[draggedItem];
    
    newSections.splice(draggedItem, 1);
    newSections.splice(index, 0, draggedSection);
    
    // Update order values
    const updatedSections = newSections.map((section, i) => ({
      ...section,
      order: i
    }));
    
    setSections(updatedSections);
    setDraggedItem(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sections)
      });

      if (res.ok) {
        alert('Homepage sections updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save sections:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const sectionIcons = {
    'hero': '🎯',
    'featured-products': '✨',
    'categories': '📁',
    'social-gallery': '📸',
    'testimonials': '💬',
    'contact': '📧'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Homepage Customization</h1>
                <p className="text-gray-600 mt-1">Manage which sections appear on your homepage and their order</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Click the eye icon to hide/show sections on your homepage</li>
            <li>✓ Drag sections to reorder them</li>
            <li>✓ Click "Save Changes" to apply your modifications</li>
          </ul>
        </div>

        {/* Sections List */}
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className={`bg-white rounded-xl shadow-md p-6 cursor-move transition ${
                draggedItem === index ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="text-gray-400 hover:text-gray-600">
                  <GripVertical size={24} />
                </div>

                {/* Icon */}
                <div className="text-3xl">
                  {sectionIcons[section.id] || '📌'}
                </div>

                {/* Section Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{section.name}</h3>
                  <p className="text-sm text-gray-600">ID: {section.id}</p>
                </div>

                {/* Order Badge */}
                <div className="bg-gray-100 rounded-lg px-3 py-1">
                  <p className="text-sm font-semibold text-gray-700">#{index + 1}</p>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleSection(section.id)}
                  className={`p-3 rounded-lg transition ${
                    section.enabled
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {section.enabled ? (
                    <Eye size={24} />
                  ) : (
                    <EyeOff size={24} />
                  )}
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-4 ml-[72px]">
                {section.enabled ? (
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    ✓ Visible on homepage
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    ✗ Hidden from homepage
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
          <p className="text-gray-700">
            <strong>{sections.filter(s => s.enabled).length}</strong> sections enabled out of <strong>{sections.length}</strong> total
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold mb-2">Visible sections in order:</p>
            <ol className="space-y-1">
              {sections
                .filter(s => s.enabled)
                .map((section, index) => (
                  <li key={section.id} className="text-gray-700">
                    {index + 1}. {section.name}
                  </li>
                ))}
            </ol>
          </div>
        </div>

        {/* Save Button (Mobile) */}
        <div className="mt-8 lg:hidden">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}