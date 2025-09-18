import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CharacterManager = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    title: '',
    description: '',
    traits: '',
    image_url: '',
    silhouette_url: '',
  });
  const [editingCharacter, setEditingCharacter] = useState<any | null>(null);

  const fetchCharacters = async () => {
    try {
      const { data } = await axios.get('/api/world/characters');
      setCharacters(data);
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Failed to fetch characters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleDeleteCharacter = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      try {
        await axios.delete(`/api/world/characters/${id}`);
        setCharacters(characters.filter(character => character.id !== id));
      } catch (err) {
        console.error('Error deleting character:', err);
        setError('Failed to delete character.');
      }
    }
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const characterData = {
        ...newCharacter,
        traits: newCharacter.traits.split(',').map(trait => trait.trim()),
      };
      await axios.post('/api/world/characters', { characterData });
      setShowCreateModal(false);
      setNewCharacter({
        name: '',
        title: '',
        description: '',
        traits: '',
        image_url: '',
        silhouette_url: '',
      });
      fetchCharacters(); // Refresh the list of characters
    } catch (err) {
      console.error('Error creating character:', err);
      setError('Failed to create character.');
    }
  };

  const handleEditCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharacter) return;
    try {
      const characterData = {
        ...editingCharacter,
        traits: Array.isArray(editingCharacter.traits) ? editingCharacter.traits.join(', ') : editingCharacter.traits.split(',').map((trait: string) => trait.trim()),
      };
      await axios.put(`/api/world/characters/${editingCharacter.id}`, { characterData });
      setShowEditModal(false);
      setEditingCharacter(null);
      fetchCharacters(); // Refresh the list of characters
    } catch (err) {
      console.error('Error updating character:', err);
      setError('Failed to update character.');
    }
  };

  const openEditModal = (character: any) => {
    setEditingCharacter({ 
      ...character, 
      traits: Array.isArray(character.traits) ? character.traits.join(', ') : '',
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
      <h1 className="text-2xl font-bold mb-4">Characters</h1>
      <div className="mb-4">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Character
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((character: any) => (
            <tr key={character.id}>
              <td className="border px-4 py-2">{character.name}</td>
              <td className="border px-4 py-2">{character.title}</td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => openEditModal(character)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteCharacter(character.id)}
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
            <h2 className="text-xl font-bold mb-4">Create New Character</h2>
            <form onSubmit={handleCreateCharacter}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCharacter.title}
                  onChange={(e) => setNewCharacter({ ...newCharacter, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={newCharacter.description}
                  onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="traits">Traits (comma-separated)</label>
                <input
                  type="text"
                  id="traits"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCharacter.traits}
                  onChange={(e) => setNewCharacter({ ...newCharacter, traits: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image_url">Image URL</label>
                <input
                  type="text"
                  id="image_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCharacter.image_url}
                  onChange={(e) => setNewCharacter({ ...newCharacter, image_url: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="silhouette_url">Silhouette URL</label>
                <input
                  type="text"
                  id="silhouette_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newCharacter.silhouette_url}
                  onChange={(e) => setNewCharacter({ ...newCharacter, silhouette_url: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Character
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

      {showEditModal && editingCharacter && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Character</h2>
            <form onSubmit={handleEditCharacter}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCharacter.name}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">Title</label>
                <input
                  type="text"
                  id="edit-title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCharacter.title}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={editingCharacter.description}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-traits">Traits (comma-separated)</label>
                <input
                  type="text"
                  id="edit-traits"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCharacter.traits}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, traits: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-image_url">Image URL</label>
                <input
                  type="text"
                  id="edit-image_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCharacter.image_url}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, image_url: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-silhouette_url">Silhouette URL</label>
                <input
                  type="text"
                  id="edit-silhouette_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCharacter.silhouette_url}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, silhouette_url: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Character
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

export default CharacterManager;
