import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 – Forbidden</h1>
      <p className="text-lg text-gray-700 mb-6">You don’t have permission to view this page.</p>
      <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Go to Homepage
      </Link>
    </div>
  );
}
