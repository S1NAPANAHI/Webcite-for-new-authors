import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WikiManager = () => {
  const [wikiItems, setWikiItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newWikiItem, setNewWikiItem] = useState({
    name: '',
    type: 'page', // Default to page
    slug: '',
    parent_id: '',
    content: '',
    excerpt: '',
    is_published: false,
    status: 'draft',
    visibility: 'public',
    tags: '',
    properties: '{}'
  });
  const [editingWikiItem, setEditingWikiItem] = useState<any | null>(null);

  const fetchWikiItems = async () => {
    try {
      const { data } = await axios.get('/api/world/wiki');
      setWikiItems(data);
    } catch (err) {
      console.error('Error fetching wiki items:', err);
      setError('Failed to fetch wiki items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWikiItems();
  }, []);

  const handleDeleteWikiItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this wiki item?')) {
      try {
        await axios.delete(`/api/world/wiki/${id}`);
        setWikiItems(wikiItems.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting wiki item:', err);
        setError('Failed to delete wiki item.');
      }
    }
  };

  const handleCreateWikiItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = {
        ...newWikiItem,
        tags: newWikiItem.tags.split(',').map(tag => tag.trim()),
        properties: JSON.parse(newWikiItem.properties || '{}')
      };
      await axios.post('/api/world/wiki', { wikiItemData: itemData });
      setShowCreateModal(false);
      setNewWikiItem({
        name: '',
        type: 'page',
        slug: '',
        parent_id: '',
        content: '',
        excerpt: '',
        is_published: false,
        status: 'draft',
        visibility: 'public',
        tags: '',
        properties: '{}'
      });
      fetchWikiItems(); // Refresh the list of wiki items
    } catch (err) {
      console.error('Error creating wiki item:', err);
      setError('Failed to create wiki item.');
    }
  };

  const handleEditWikiItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWikiItem) return;
    try {
      const itemData = {
        ...editingWikiItem,
        tags: Array.isArray(editingWikiItem.tags) ? editingWikiItem.tags.join(', ') : editingWikiItem.tags.split(',').map((tag: string) => tag.trim()),
        properties: JSON.parse(editingWikiItem.properties || '{}')
      };
      await axios.put(`/api/world/wiki/${editingWikiItem.id}`, { wikiItemData: itemData });
      setShowEditModal(false);
      setEditingWikiItem(null);
      fetchWikiItems(); // Refresh the list of wiki items
    } catch (err) {
      console.error('Error updating wiki item:', err);
      setError('Failed to update wiki item.');
    }
  };

  const openEditModal = (item: any) => {
    setEditingWikiItem({ 
      ...item, 
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      properties: JSON.stringify(item.properties || {}, null, 2)
    });
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
      <h1 className="text-2xl font-bold mb-4">Wiki</h1>
      <div className="mb-4">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Wiki Item
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wikiItems.map((item: any) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.type}</td>
              <td className="border px-4 py-2">{item.status}</td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => openEditModal(item)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteWikiItem(item.id)}
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
            <h2 className="text-xl font-bold mb-4">Create New Wiki Item</h2>
            <form onSubmit={handleCreateWikiItem}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newWikiItem.name}
                  onChange={(e) => setNewWikiItem({ ...newWikiItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Type</label>
                <select
                  id="type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newWikiItem.type}
                  onChange={(e) => setNewWikiItem({ ...newWikiItem, type: e.target.value })}
                  required
                >
                  <option value="page">Page</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">Slug</label>
                <input
                  type="text"
                  id="slug"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newWikiItem.slug}
                  onChange={(e) => setNewWikiItem({ ...newWikiItem, slug: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parent_id">Parent ID (Optional)</label>
                <input
                  type="text"
                  id="parent_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newWikiItem.parent_id}
                  onChange={(e) => setNewWikiItem({ ...newWikiItem, parent_id: e.target.value })}
                />
              </div>
              {newWikiItem.type === 'page' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">Content</label>
                    <textarea
                      id="content"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                      value={newWikiItem.content}
                      onChange={(e) => setNewWikiItem({ ...newWikiItem, content: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">Excerpt</label>
                    <textarea
                      id="excerpt"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                      value={newWikiItem.excerpt}
                      onChange={(e) => setNewWikiItem({ ...newWikiItem, excerpt: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_published">Is Published</label>
                    <input
                      type="checkbox"
                      id="is_published"
                      className="mr-2 leading-tight"
                      checked={newWikiItem.is_published}
                      onChange={(e) => setNewWikiItem({ ...newWikiItem, is_published: e.target.checked })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">Status</label>
                    <select
                      id="status"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newWikiItem.status}
                      onChange={(e) => setNewWikiItem({ ...newWikiItem, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="visibility">Visibility</label>
                    <select
                      id="visibility"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newWikiItem.visibility}
                      onChange={(e) => setNewWikiItem({ ...newWikiItem, visibility: e.target.value })}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="restricted">Restricted</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="tags"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newWikiItem.tags}
                      onChange={(e) => setNewWikiItem({ ...newWikiItem, tags: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="properties">Properties (JSON)</label>
                    <textarea
                      id="properties"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                      value={newWikiItem.properties}
                      onChange={(e) => setNewWikiItem({ ...newWikiItem, properties: e.target.value })}
                    ></textarea>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Wiki Item
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

      {showEditModal && editingWikiItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Wiki Item</h2>
            <form onSubmit={handleEditWikiItem}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingWikiItem.name}
                  onChange={(e) => setEditingWikiItem({ ...editingWikiItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-type">Type</label>
                <select
                  id="edit-type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingWikiItem.type}
                  onChange={(e) => setEditingWikiItem({ ...editingWikiItem, type: e.target.value })}
                  required
                >
                  <option value="page">Page</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-slug">Slug</label>
                <input
                  type="text"
                  id="edit-slug"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingWikiItem.slug}
                  onChange={(e) => setEditingWikiItem({ ...editingWikiItem, slug: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-parent_id">Parent ID (Optional)</label>
                <input
                  type="text"
                  id="edit-parent_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingWikiItem.parent_id}
                  onChange={(e) => setEditingWikiItem({ ...editingWikiItem, parent_id: e.target.value })}
                />
              </div>
              {editingWikiItem.type === 'page' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-content">Content</label>
                    <textarea
                      id="edit-content"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                      value={editingWikiItem.content}
                      onChange={(e) => setEditingWikiItem({ ...editingWikiItem, content: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-excerpt">Excerpt</label>
                    <textarea
                      id="edit-excerpt"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                      value={editingWikiItem.excerpt}
                      onChange={(e) => setEditingWikiItem({ ...editingWikiItem, excerpt: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-is_published">Is Published</label>
                    <input
                      type="checkbox"
                      id="edit-is_published"
                      className="mr-2 leading-tight"
                      checked={editingWikiItem.is_published}
                      onChange={(e) => setEditingWikiItem({ ...editingWikiItem, is_published: e.target.checked })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-status">Status</label>
                    <select
                      id="edit-status"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={editingWikiItem.status}
                      onChange={(e) => setEditingWikiItem({ ...editingWikiItem, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-visibility">Visibility</label>
                    <select
                      id="edit-visibility"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={editingWikiItem.visibility}
                      onChange={(e) => setEditingWikiItem({ ...editingWikiItem, visibility: e.target.value })}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="restricted">Restricted</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-tags">Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="edit-tags"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={editingWikiItem.tags}
                      onChange={(e) => setEditingWikiItem({ ...editingWikiItem, tags: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-properties">Properties (JSON)</label>
                    <textarea
                      id="edit-properties"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                      value={editingWikiItem.properties}
                      onChange={(e) => setEditingWikiItem({ ...editingWikiItem, properties: e.target.value })}
                    ></textarea>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Wiki Item
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

export default WikiManager;
