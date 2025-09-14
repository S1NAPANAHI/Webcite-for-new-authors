import { useEffect, useState } from 'react';
import { api } from '../../utils/api';

interface User {
    id: string;
    email: string;
    role: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/v2/admin/data')
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch users.');
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {users.map(u => (
            <li key={u.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <p className="font-semibold">{u.email}</p>
                <p className="text-sm text-gray-600">Role: {u.role}</p>
              </div>
              <button className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
                Manage
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
