import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('privileges', JSON.stringify(data.privileges || []));

      navigate('/admin');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Log in
        </button>
      </form>
    </div>
  );
}
