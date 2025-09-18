import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, useAuth } from '@zoroaster/shared';
import { AdvancedEditor } from '../../../components/editor/AdvancedEditor';
import { Save, Eye } from 'lucide-react';

interface Work {
  id: string;
  title: string;
}

const ChapterEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [workId, setWorkId] = useState<string>('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch works
        const { data: worksData, error: worksError } = await supabase
          .from('works')
          .select('id, title');
        if (worksError) throw worksError;
        setWorks(worksData || []);

        // Fetch chapter if ID exists
        if (id) {
          const { data: chapterData, error: chapterError } = await supabase
            .from('chapters')
            .select('*')
            .eq('id', id)
            .single();

          if (chapterError) throw chapterError;

          if (chapterData) {
            setTitle(chapterData.title);
            setChapterNumber(chapterData.chapter_number);
            setWorkId(chapterData.work_id);
            setContent(chapterData.content || '');
            setIsPublished(chapterData.is_published);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const saveChapter = async () => {
    setSaving(true);

    try {
      if (!user) throw new Error('Not authenticated');

      const chapterData = {
        title,
        chapter_number: chapterNumber,
        work_id: workId,
        content,
        is_published: isPublished,
      };

      let response;
      if (id) {
        response = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', id);
      } else {
        response = await supabase.from('chapters').insert([chapterData]);
      }

      const { error } = response;

      if (error) throw error;

      navigate('/admin/content/chapters');
    } catch (error) {
      console.error('Error saving chapter:', error);
      alert('Failed to save chapter');
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
          {id ? 'Edit Chapter' : 'New Chapter'}
        </h1>

        <div className="flex space-x-3">
          <button
            onClick={saveChapter}
            disabled={saving || !title || !workId || !chapterNumber}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {id ? 'Save Changes' : 'Create Chapter'}
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
                  placeholder="Enter chapter title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Number
                </label>
                <input
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1, 2, 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Work
                </label>
                <select
                  value={workId}
                  onChange={(e) => setWorkId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Work</option>
                  {works.map(work => (
                    <option key={work.id} value={work.id}>
                      {work.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <AdvancedEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your chapter..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                  Publish Chapter
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditor;
