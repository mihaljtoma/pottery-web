import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getProducts, getCategories, getContactSubmissions } from '@/lib/db';
import Link from 'next/link';
import { Package, FolderTree, Mail, Settings, LogOut } from 'lucide-react';

export default async function AdminDashboard() {
  const auth = await requireAuth();
  
  if (!auth.authenticated) {
    redirect('/admin/login');
  }

  const products = await getProducts();
  const categories = await getCategories();
  const submissions = await getContactSubmissions();

  const stats = {
    totalProducts: products.length,
    available: products.filter(p => p.availability === 'available').length,
    sold: products.filter(p => p.availability === 'sold').length,
    categories: categories.length,
    unreadMessages: submissions.filter(s => !s.replied).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <form action="/api/auth/logout" method="POST">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
                <LogOut size={20} />
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<Package />}
            color="blue"
          />
          <StatCard
            title="Available"
            value={stats.available}
            icon={<Package />}
            color="green"
          />
          <StatCard
            title="Categories"
            value={stats.categories}
            icon={<FolderTree />}
            color="purple"
          />
          <StatCard
            title="Unread Messages"
            value={stats.unreadMessages}
            icon={<Mail />}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Products"
            description="Manage your pottery collection"
            href="/admin/products"
            icon={<Package size={32} />}
            color="amber"
          />
          <ActionCard
            title="Categories"
            description="Organize products by category"
            href="/admin/categories"
            icon={<FolderTree size={32} />}
            color="blue"
          />
          <ActionCard
            title="Messages"
            description="View contact form submissions"
            href="/admin/messages"
            icon={<Mail size={32} />}
            color="green"
          />
          <ActionCard
            title="Home Page"
            description="Customize homepage sections"
            href="/admin/home"
            icon={<Settings size={32} />}
            color="purple"
          />
          <ActionCard
            title="Settings"
            description="Site configuration and about page"
            href="/admin/settings"
            icon={<Settings size={32} />}
            color="gray"
          />
          <ActionCard
            title="View Site"
            description="See your public website"
            href="/"
            icon={<Package size={32} />}
            color="indigo"
            external
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, href, icon, color, external }) {
  const colors = {
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    gray: 'from-gray-500 to-slate-500',
    indigo: 'from-indigo-500 to-blue-500'
  };

  const Component = external ? 'a' : Link;
  const props = external ? { href, target: '_blank' } : { href };

  return (
    <Component {...props}>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colors[color]} text-white mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Component>
  );
}