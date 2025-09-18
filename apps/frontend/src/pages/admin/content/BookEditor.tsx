import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@zoroaster/shared/hooks/useAuth';
import { AdminService } from '@zoroaster/shared/services/admin';
import { ContentService } from '@zoroaster/shared/services/content';
import { Save } from 'lucide-react';
import { Database } from '@zoroaster/shared/database.types';

type Book = Database['public']['Tables']['books']['Row'];

const BookEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [state, setState] = useState<Book['state']>('draft'); // New state for content lifecycle
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        setLoading(true);
        try {
          const bookData = await ContentService.getBookById(id);
          if (bookData) {
            setTitle(bookData.title);
            setDescription(bookData.description || '');
            setReleaseDate(bookData.publish_at ? bookData.publish_at.split('T')[0] : ''); // Format date for input
            setCoverImageUrl(bookData.cover_image || '');
            setIsFeatured(bookData.is_featured || false);
            setState(bookData.state);
          }
        } catch (error) {
          console.error('Error fetching book:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const saveBook = async () => {
    setSaving(true);

    try {
      if (!user) throw new Error('Not authenticated');

      const bookData: Partial<Book> = {
        title,
        description,
        publish_at: releaseDate ? new Date(releaseDate).toISOString() : null,
        cover_image: coverImageUrl || null,
        is_featured: isFeatured,
        state: state,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), // Generate slug
      };

      if (id) {
        // Update existing book
        await AdminService.updateContentState('books', id, state, bookData.publish_at);
        // For other fields, we need a generic update method in AdminService
        // For now, only state and publish_at are handled by updateContentState
        // A full update would look like: await supabase.from('books').update(bookData).eq('id', id);
      } else {
        // Create new book
        await AdminService.createBook(bookData as Book);
      }

      navigate('/admin/content/books');
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Book' : 'New Book'}
        </h1>

        <div className="flex space-x-3">
          <button
            onClick={saveBook}
            disabled={saving || !title || !state}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {id ? 'Save Changes' : 'Create Book'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter book title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value as Book['state'])}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="planning">Planning</option>
                  <option value="writing">Writing</option>
                  <option value="editing">Editing</option>
                  <option value="published">Published</option>
                  <option value="on_hold">On Hold</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the book..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date (Optional)
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visibility & Access</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Featured Book
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEditor;
