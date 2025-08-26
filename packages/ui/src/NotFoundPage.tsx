import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Go to Home
      </Link>
    </div>
  );
};


