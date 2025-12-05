'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, Clock, Trash2, ExternalLink } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, replied

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (res.status === 401) {
        redirect('/admin/login');
        return;
      }
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleReplied = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replied: !currentStatus })
      });

      if (res.ok) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.replied;
    if (filter === 'replied') return msg.replied;
    return true;
  });

  const unreadCount = messages.filter(m => !m.replied).length;

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
                <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                      <Mail size={14} />
                      {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'unread'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('replied')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'replied'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Replied ({messages.length - unreadCount})
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <Mail size={48} className="mx-auto text-gray-400 mb-4 animate-pulse" />
            <p className="text-gray-500">Loading messages...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No messages yet' : 
               filter === 'unread' ? 'No unread messages' : 
               'No replied messages'}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Contact form submissions will appear here.' 
                : 'Change the filter to see other messages.'}
            </p>
          </div>
        )}

        {/* Messages List */}
        {!loading && filteredMessages.length > 0 && (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                  message.replied 
                    ? 'border-gray-200' 
                    : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="p-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Status Icon */}
                      <div className={`p-3 rounded-lg ${
                        message.replied 
                          ? 'bg-green-100' 
                          : 'bg-amber-100'
                      }`}>
                        {message.replied ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : (
                          <Clock className="text-amber-600" size={24} />
                        )}
                      </div>

                      {/* Sender Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {message.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            message.replied
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {message.replied ? 'Replied' : 'New'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <a 
                            href={`mailto:${message.email}`}
                            className="flex items-center gap-1 text-amber-600 hover:text-amber-700"
                          >
                            <Mail size={14} />
                            {message.email}
                          </a>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(message.submittedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleReplied(message.id, message.replied)}
                        className={`p-2 rounded-lg transition ${
                          message.replied
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            : 'bg-green-100 hover:bg-green-200 text-green-600'
                        }`}
                        title={message.replied ? 'Mark as unread' : 'Mark as replied'}
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                        title="Delete message"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {message.message}
                    </p>
                  </div>

                  {/* Reply Button */}
                  <div className="mt-4 flex gap-3">
                    <a
                      href={`mailto:${message.email}?subject=Re: Your pottery inquiry&body=Hi ${message.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A`}
                      className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      <Mail size={16} />
                      Reply via Email
                    </a>
                    {!message.replied && (
                      <button
                        onClick={() => toggleReplied(message.id, false)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        <CheckCircle size={16} />
                        Mark as Replied
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}