import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  
} from 'lucide-react';

// Define the type for a character item
type Character = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  image_url?: string;
  silhouette_url?: string;
};

// --- Supabase Data Functions ---
const fetchCharacters = async (): Promise<Character[]> => {
  const { data, error } = await supabase.from('characters').select('*').order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Character[];
};

const createCharacter = async (newCharacter: Omit<Character, 'id' | 'created_at' | 'updated_at'>): Promise<Character> => {
  const { data, error } = await supabase.from('characters').insert(newCharacter).select();
  if (error) throw new Error(error.message);
  return data[0] as Character;
};

const updateCharacter = async (updatedCharacter: Character): Promise<Character> => {
  const { id, ...updates } = updatedCharacter; // Exclude id from update payload
  const { data, error } = await supabase.from('characters').update(updates).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0] as Character;
};

const deleteCharacter = async (id: string): Promise<void> => {
  const { error } = await supabase.from('characters').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// --- Character Editor Component ---
export const CharacterEditor = ({ character, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: character?.name || '',
    title: character?.title || '',
    description: character?.description || '',
    traits: character?.traits.join(', ') || '',
    image_url: character?.image_url || '',
    silhouette_url: character?.silhouette_url || '',
  });

  const handleSubmit = () => {
    const characterData = {
      ...formData,
      traits: formData.traits.split(',').map((trait: string) => trait.trim()).filter((trait: string) => trait !== ''),
    };
    onSave({ ...character, ...characterData, id: character?.id });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {character ? 'Edit Character' : 'Create New Character'}
      </h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Traits (comma-separated)</label>
          <input
            type="text"
            value={formData.traits}
            onChange={(e) => setFormData({ ...formData, traits: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Silhouette URL (Optional)</label>
          <input
            type="url"
            value={formData.silhouette_url}
            onChange={(e) => setFormData({ ...formData, silhouette_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Character
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Characters Management Component ---
export const CharactersManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: characters, isLoading, isError, error } = useQuery<Character[]>({ queryKey: ['characters'], queryFn: fetchCharacters });

  const createMutation = useMutation({
    mutationFn: createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      setIsEditing(false);
      setEditingCharacter(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      setIsEditing(false);
      setEditingCharacter(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });

  const handleSaveCharacter = (characterData: Omit<Character, 'created_at' | 'updated_at'>) => {
    if (editingCharacter) {
      updateMutation.mutate(characterData as Character);
    } else {
      createMutation.mutate(characterData);
    }
  };

  const handleDeleteCharacter = (id: string) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredCharacters = characters?.filter(character => {
    return character.name.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  if (isLoading) return <div>Loading characters...</div>;
  if (isError) return <div>Error loading characters: {error?.message}</div>;

  return (
    <div className="space-y-6">
      {isEditing ? (
        <CharacterEditor
          character={editingCharacter}
          onSave={handleSaveCharacter}
          onCancel={() => {
            setIsEditing(false);
            setEditingCharacter(null);
          }}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Characters</h1>
            <button
              onClick={() => {
                setEditingCharacter(null);
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Character
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search characters..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Characters Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Title</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Traits</th>
                  <th className="text-right py-3 px-6 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCharacters.map((character) => (
                  <tr key={character.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{character.name}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{character.title}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{character.traits.join(', ')}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCharacter(character);
                            setIsEditing(true);
                          }}
                          className="p-1 text-gray-500 hover:text-blue-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCharacter(character.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};


