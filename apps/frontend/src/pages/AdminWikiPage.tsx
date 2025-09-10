import React from 'react';
import { WikiAdmin } from '../components/wiki/WikiAdmin';

const AdminWikiPage: React.FC = () => {
  return (
    <div className="admin-wiki-page">
      <h1 className="text-2xl font-bold mb-4">Wiki Management</h1>
      <WikiAdmin />
    </div>
  );
};

export default AdminWikiPage;
