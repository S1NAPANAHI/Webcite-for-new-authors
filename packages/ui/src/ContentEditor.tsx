import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

interface ContentEditorProps {
  item: any; // The item to be edited (can be post, page, character, etc.)
  contentType: string; // e.g., 'posts', 'pages', 'characters'
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ item, contentType, onSave, onCancel }) => {
  const getInitialFormData = () => {
    switch(contentType) {
      case 'posts':
      case 'pages':
        return {
          title: item?.title || '',
          content: item?.content || '',
          slug: item?.slug || '',
          status: item?.status || 'draft'
        };
      case 'storeItems':
        return {
          name: item?.name || '',
          description: item?.description || '',
          price: item?.price || 0,
          category: item?.category || 'digital',
          status: item?.status || 'active'
        };
      case 'libraryItems':
        return {
          title: item?.title || '',
          description: item?.description || '',
          category: item?.category || 'tutorial',
          file_url: item?.file_url || '',
          status: item?.status || 'draft'
        };
      case 'characters':
        return {
          name: item?.name || '',
          role: item?.role || '',
          description: item?.description || '',
          backstory: item?.backstory || '',
          status: item?.status || 'draft'
        };
      case 'timelineEvents':
        return {
          title: item?.title || '',
          description: item?.description || '',
          date: item?.date || '',
          era: item?.era || 'modern',
          status: item?.status || 'draft'
        };
      case 'betaUsers':
        return {
          name: item?.name || '',
          email: item?.email || '',
          message: item?.message || '',
          status: item?.status || 'pending'
        };
      default:
        return {};
    }
  };

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [item, contentType]);

  const handleSubmit = () => {
    // If editing an existing item, include its ID. Otherwise, omit ID for new items.
    const dataToSave = item ? { ...item, ...formData } : formData;
    onSave(dataToSave);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove all non-word chars
      .replace(/[\s_-]+/g, '-')   // Replace spaces and underscores with single dash
      .replace(/^-+|-+$/g, '');    // Trim dashes from start/end
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug || generateSlug(newTitle) // Auto-generate slug if empty
    }));
  };

  const initialConfig = {
    namespace: 'MyEditor',
    theme: {
      // Add your theme styles here
      // For example:
      // paragraph: 'editor-paragraph',
      // text: {
      //   bold: 'editor-text-bold',
      //   italic: 'editor-text-italic',
      // },
    },
    onError(error: Error) {
      console.error(error);
    },
  };

  const renderFields = () => {
    switch(contentType) {
      case 'posts':
      case 'pages':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="my-awesome-post"
              />
              <p className="mt-1 text-sm text-gray-500">URL-friendly version of the title. e.g., 'my-awesome-post'</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div className="editor-container"> {/* Add a container for styling */}
                <LexicalComposer initialConfig={initialConfig}>
                  <RichTextPlugin
                    contentEditable={<ContentEditable className="editor-input" />}
                    placeholder={<div className="editor-placeholder">Enter your content...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                </LexicalComposer>
              </div>
            </div>
          </>
        );
      case 'storeItems':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product description..."
              />
            </div>
          </>
        );
      case 'libraryItems':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resource title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tutorial">Tutorial</option>
                <option value="resources">Resources</option>
                <option value="template">Template</option>
                <option value="guide">Guide</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
              <input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resource description..."
              />
            </div>
          </>
        );
      case 'characters':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Character Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Character name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="protagonist">Protagonist</option>
                <option value="antagonist">Antagonist</option>
                <option value="mentor">Mentor</option>
                <option value="ally">Ally</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Character description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backstory</label>
              <textarea
                value={formData.backstory}
                onChange={(e) => setFormData({...formData, backstory: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Character backstory..."
              />
            </div>
          </>
        );
      case 'timelineEvents':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Era</label>
              <select
                value={formData.era}
                onChange={(e) => setFormData({...formData, era: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ancient">Ancient</option>
                <option value="medieval">Medieval</option>
                <option value="modern">Modern</option>
                <option value="future">Future</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event description..."
              />
            </div>
          </>
        );
      case 'betaUsers':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="User name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="User message/notes..."
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {item ? `Edit ${contentType}` : `Create New ${contentType}`}
        </h2>
        <button onClick={onCancel} className="p-2 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {renderFields()}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {contentType === 'posts' && (
              <>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </>
            )}
            {contentType === 'pages' && (
              <>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </>
            )}
            {contentType === 'storeItems' && (
              <>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </>
            )}
            {contentType === 'libraryItems' && (
              <>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </>
            )}
            {contentType === 'characters' && (
              <>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </>
            )}
            {contentType === 'timelineEvents' && (
              <>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </>
            )}
            {contentType === 'betaUsers' && (
              <>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </>
            )}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


