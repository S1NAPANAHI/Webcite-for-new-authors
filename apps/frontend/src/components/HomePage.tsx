import React from 'react';
from '@zoroaster/ui'

const HomePage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Welcome to the Zoroasterverse</h1>
      <nav className="mt-4">
        <Link to="/login" className="mr-4">Login</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </div>
  );
};

export default HomePage;
