import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  BookOpen
} from 'lucide-react';

// Define the type for a work item
type Work = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  type: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  parent_id?: string;
  order_in_parent?: number;
  description?: string;
  status: 'planning' | 'writing' | 'editing' | 'published' | 'on_hold';
  progress_percentage?: number;
  release_date?: string;
  estimated_release?: string;
  cover_image_url?: string;
  sample_url?: string;
  sample_content?: string; // Added for direct text content
  is_purchasable?: boolean;
  is_featured?: boolean;
  word_count?: number;
  target_word_count?: number;
};

// --- Supabase Data Functions ---
const fetchWorks = async (): Promise<Work[]> => {
  const { data, error } = await supabase.from('works').select('*').order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Work[];
};

const createWork = async (newWork: Omit<Work, 'id' | 'created_at' | 'updated_at'>): Promise<Work> => {
  const { data, error } = await supabase.from('works').insert(newWork).select();
  if (error) throw new Error(error.message);
  return data[0] as Work;
};

const updateWork = async (updatedWork: Work): Promise<Work> => {
  const { id, ...updates } = updatedWork; // Exclude id from update payload
  const { data, error } = await supabase.from('works').update(updates).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0] as Work;
};

const deleteWork = async (id: string): Promise<void> => {
  const { error } = await supabase.from('works').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// --- Work Editor Component ---
export const WorkEditor = ({ work, onSave, onCancel, allWorks }) => {
  const [formData, setFormData] = useState({
    title: work?.title || '',
    type: work?.type || 'book',
    parent_id: work?.parent_id || '',
    order_in_parent: work?.order_in_parent || '',
    description: work?.description || '',
    status: work?.status || 'planning',
    progress_percentage: work?.progress_percentage || 0,
    release_date: work?.release_date || '',
    estimated_release: work?.estimated_release || '',
    cover_image_url: work?.cover_image_url || '',
    sample_content: work?.sample_content || '',
    is_purchasable: work?.is_purchasable ?? true,
    is_featured: work?.is_featured ?? false,
    word_count: work?.word_count || '',
    target_word_count: work?.target_word_count || '',
  });

  const handleSubmit = () => {
    onSave({ 
      ...work, 
      ...formData, 
      parent_id: formData.parent_id === '' ? null : formData.parent_id, // Convert empty string to null for UUID
      order_in_parent: formData.order_in_parent ? Number(formData.order_in_parent) : undefined,
      progress_percentage: formData.progress_percentage ? Number(formData.progress_percentage) : undefined,
      word_count: formData.word_count ? Number(formData.word_count) : undefined,
      target_word_count: formData.target_word_count ? Number(formData.target_word_count) : undefined,
      id: work?.id // Ensure ID is passed for updates
    });
  };

  const parentWorks = allWorks.filter(w => w.id !== work?.id); // Exclude self from parent options

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {work ? 'Edit Work' : 'Create New Work'}
      </h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Work['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="book">Book</option>
              <option value="volume">Volume</option>
              <option value="saga">Saga</option>
              <option value="arc">Arc</option>
              <option value="issue">Issue</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Work (for nesting)</label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {parentWorks.map(w => (
                <option key={w.id} value={w.id}>{w.title} ({w.type})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order in Parent</label>
            <input
              type="number"
              value={formData.order_in_parent}
              onChange={(e) => setFormData({ ...formData, order_in_parent: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Work['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="planning">Planning</option>
              <option value="writing">Writing</option>
              <option value="editing">Editing</option>
              <option value="published">Published</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progress Percentage (0-100)</label>
            <input
              type="number"
              value={formData.progress_percentage}
              onChange={(e) => setFormData({ ...formData, progress_percentage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0" max="100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Release Date</label>
            <input
              type="date"
              value={formData.release_date}
              onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Release (e.g., Q2 2024)</label>
            <input
              type="text"
              value={formData.estimated_release}
              onChange={(e) => setFormData({ ...formData, estimated_release: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
          <input
            type="url"
            value={formData.cover_image_url}
            onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sample Content</label>
          <textarea
            value={formData.sample_content}
            onChange={(e) => setFormData({ ...formData, sample_content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Word Count</label>
            <input
              type="number"
              value={formData.word_count}
              onChange={(e) => setFormData({ ...formData, word_count: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Word Count</label>
            <input
              type="number"
              value={formData.target_word_count}
              onChange={(e) => setFormData({ ...formData, target_word_count: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isPurchasable"
            checked={formData.is_purchasable}
            onChange={(e) => setFormData({ ...formData, is_purchasable: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="isPurchasable" className="text-sm font-medium text-gray-700">Is Purchasable</label>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Is Featured</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Work
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

// --- Works Management Component ---
export const WorksManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: allWorks, isLoading, isError, error } = useQuery<Work[]>({ queryKey: ['works'], queryFn: fetchWorks });

  const createMutation = useMutation({
    mutationFn: createWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
      setIsEditing(false);
      setEditingWork(null);
    },
    onError: (err) => {
      alert(`Error creating work: ${err.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
      setIsEditing(false);
      setEditingWork(null);
    },
    onError: (err) => {
      alert(`Error updating work: ${err.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
    },
  });

  const handleSaveWork = (workData: Omit<Work, 'created_at' | 'updated_at'>) => {
    if (editingWork) {
      updateMutation.mutate(workData as Work);
    } else {
      createMutation.mutate(workData);
    }
  };

  const handleDeleteWork = (id: string) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredWorks = allWorks?.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || work.type === filterType;
    const matchesStatus = filterStatus === 'all' || work.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  if (isLoading) return <div>Loading works...</div>;
  if (isError) return <div>Error loading works: {error?.message}</div>;

  return (
    <div className="space-y-6">
      {isEditing ? (
        <WorkEditor
          work={editingWork}
          onSave={handleSaveWork}
          onCancel={() => {
            setIsEditing(false);
            setEditingWork(null);
          }}
          allWorks={allWorks || []}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Works Management</h1>
            <button
              onClick={() => {
                setEditingWork(null);
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Work
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search works..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="book">Book</option>
                <option value="volume">Volume</option>
                <option value="saga">Saga</option>
                <option value="arc">Arc</option>
                <option value="issue">Issue</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="writing">Writing</option>
                <option value="editing">Editing</option>
                <option value="published">Published</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Works Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Title</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Parent</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Release Date</th>
                  <th className="text-right py-3 px-6 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorks.map((work) => (
                  <tr key={work.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{work.title}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{work.type}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        work.status === 'published' ? 'bg-green-100 text-green-800' :
                        work.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                        work.status === 'writing' ? 'bg-yellow-100 text-yellow-800' :
                        work.status === 'editing' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {work.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{allWorks?.find(w => w.id === work.parent_id)?.title || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{work.release_date || work.estimated_release || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingWork(work);
                            setIsEditing(true);
                          }}
                          className="p-1 text-gray-500 hover:text-blue-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWork(work.id)}
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


