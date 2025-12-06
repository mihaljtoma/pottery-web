'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Trash2, Instagram, Image as ImageIcon } from 'lucide-react';

export default function AdminGalleryPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    postUrl: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.status === 401) {
        redirect('/admin/login');
        return;
      }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchPosts();
        setFormData({ imageUrl: '', caption: '', postUrl: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  };

  const deletePost = async (id) => {
    if (!confirm('Delete this gallery post?')) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Instagram className="text-pink-600" size={28} />
                  Social Gallery
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your behind-the-scenes photos
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={20} />
              Add Post
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Post Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Add Gallery Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                
                {formData.imageUrl ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="gallery-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="gallery-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 transition bg-gray-50"
                    >
                      <ImageIcon size={48} className="text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        {uploading ? 'Uploading...' : 'Click to upload image'}
                      </p>
                    </label>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="Add a caption..."
                />
              </div>

              {/* Post URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Post URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.postUrl}
                  onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="https://instagram.com/p/..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!formData.imageUrl}
                  className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition"
                >
                  Add to Gallery
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ imageUrl: '', caption: '', postUrl: '' });
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <Instagram size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No posts yet. Add your first gallery image!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {posts.map((post) => (
                <div key={post.id} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.caption || 'Gallery image'}
                      fill
                      className="object-cover"
                    />
                    {/* Delete Button */}
                    <button
                      onClick={() => deletePost(post.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {post.caption && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {post.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}