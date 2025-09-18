import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvancedEditor from '../../../components/AdvancedEditor';

const PagesManager = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    publish_at: ''
  });
  const [editingPage, setEditingPage] = useState<any | null>(null);

  const fetchPages = async () => {
    try {
      const { data } = await axios.get('/api/content/pages');
      setPages(data);
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError('Failed to fetch pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDeletePage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await axios.delete(`/api/content/pages/${id}`);
        setPages(pages.filter(page => page.id !== id));
      } catch (err) {
        console.error('Error deleting page:', err);
        setError('Failed to delete page.');
      }
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/content/pages', newPage);
      setShowCreateModal(false);
      setNewPage({
        title: '',
        slug: '',
        content: '',
        status: 'draft',
        publish_at: ''
      });
      fetchPages(); // Refresh the list of pages
    } catch (err) {
      console.error('Error creating page:', err);
      setError('Failed to create page.');
    }
  };

  const handleEditPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    try {
      await axios.put(`/api/content/pages/${editingPage.id}`, editingPage);
      setShowEditModal(false);
      setEditingPage(null);
      fetchPages(); // Refresh the list of pages
    } catch (err) {
      console.error('Error updating page:', err);
      setError('Failed to update page.');
    }
  };

  const openEditModal = (page: any) => {
    setEditingPage({ ...page, publish_at: page.publish_at ? new Date(page.publish_at).toISOString().slice(0, 16) : '' });
    setShowEditModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pages</h1>
      <div className="mb-4">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Page
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Slug</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page: any) => (
            <tr key={page.id}>
              <td className="border px-4 py-2">{page.title}</td>
              <td className="border px-4 py-2">{page.slug}</td>
              <td className="border px-4 py-2">{page.status}</td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => openEditModal(page)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeletePage(page.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Create New Page</h2>
            <form onSubmit={handleCreatePage}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">Slug</label>
                <input
                  type="text"
                  id="slug"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">Content</label>
                <AdvancedEditor
                  initialContent={newPage.content}
                  onSave={(htmlContent) => setNewPage({ ...newPage, content: htmlContent })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">Status</label>
                <select
                  id="status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPage.status}
                  onChange={(e) => setNewPage({ ...newPage, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publish_at">Publish At</label>
                <input
                  type="datetime-local"
                  id="publish_at"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPage.publish_at}
                  onChange={(e) => setNewPage({ ...newPage, publish_at: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Page
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingPage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Page</h2>
            <form onSubmit={handleEditPage}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">Title</label>
                <input
                  type="text"
                  id="edit-title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-slug">Slug</label>
                <input
                  type="text"
                  id="edit-slug"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-content">Content</label>
                <AdvancedEditor
                  initialContent={editingPage.content}
                  onSave={(htmlContent) => setEditingPage({ ...editingPage, content: htmlContent })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingPage.status}
                  onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-publish_at">Publish At</label>
                <input
                  type="datetime-local"
                  id="edit-publish_at"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingPage.publish_at}
                  onChange={(e) => setEditingPage({ ...editingPage, publish_at: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Page
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesManager;
