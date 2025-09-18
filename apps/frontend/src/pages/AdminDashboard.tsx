import { useEffect, useState } from 'react';
import { useAuth } from '@zoroaster/shared/hooks/useAuth';
import { KpiCard } from '../admin/components/KpiCard';

interface DashboardData {
  books: any[];
  chapters: any[];
  users: any[];
}

const mockDashboardData: DashboardData = {
  books: [
    { id: 'book1', title: 'The Mock Saga', state: 'published', created_at: new Date().toISOString() },
    { id: 'book2', title: 'Another Mock Tale', state: 'draft', created_at: new Date().toISOString() },
  ],
  chapters: [
    { id: 'chap1', title: 'Chapter One', state: 'published', created_at: new Date().toISOString() },
    { id: 'chap2', title: 'Chapter Two', state: 'draft', created_at: new Date().toISOString() },
  ],
  users: [
    { id: 'user1', email: 'admin@example.com', subscription_status: 'admin', created_at: new Date().toISOString() },
    { id: 'user2', email: 'premium@example.com', subscription_status: 'premium', created_at: new Date().toISOString() },
  ],
};

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for authentication to resolve
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    // Use mock data directly
    setData(mockDashboardData);
    setLoading(false);
  }, [isAdmin, authLoading]);

  if (authLoading || loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!isAdmin) {
    return <div>Access Denied. You must be an admin to view this page.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Novel Platform Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          title="Total Books"
          value={data?.books?.length || 0}
          color="blue"
        />
        <KpiCard
          title="Total Chapters"
          value={data?.chapters?.length || 0}
          color="green"
        />
        <KpiCard
          title="Total Users"
          value={data?.users?.length || 0}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Books</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data?.books?.slice(0, 5).map((book: any) => (
                <div key={book.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-500">Status: {book.state}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(book.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Users</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data?.users?.slice(0, 5).map((user: any) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">Tier: {user.subscription_status}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}