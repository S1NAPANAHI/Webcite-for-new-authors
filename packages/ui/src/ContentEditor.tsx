import React, { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $getSelection, EditorState } from 'lexical';

// Import types from the shared types file
import { 
  ContentItem, 
  ContentStatus, 
  Post, 
  Page, 
  StoreItem, 
  LibraryItem, 
  Character, 
  TimelineEvent, 
  BetaUser 
} from '@zoroaster/shared/types/content';

// Define content type for the editor
type ContentType = 'posts' | 'pages' | 'storeItems' | 'libraryItems' | 'characters' | 'timelineEvents' | 'betaUsers';

// Form data type that omits auto-generated fields
type FormData<T extends ContentItem> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'created_by'>;

// Props interface for the ContentEditor component
interface ContentEditorProps<T extends ContentItem> {
  item?: T;
  contentType: ContentType;
  onSave: (data: T) => void;
  onCancel: () => void;
}

// Helper function to generate a URL-friendly slug from a string
const generateSlug = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export function ContentEditor<T extends ContentItem>({ 
  item, 
  contentType, 
  onSave, 
  onCancel 
}: ContentEditorProps<T>) {
  // State for form data and validation errors
  const [formData, setFormData] = useState<FormData<T>>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data based on content type
  function getInitialFormData(): FormData<T> {
    if (item) {
      // If we have an existing item, use its values
      const { id, created_at, updated_at, created_by, ...rest } = item;
      return rest as FormData<T>;
    }

    // Default values based on content type
    const baseData: Partial<FormData<T>> = {
      status: 'draft' as ContentStatus,
    };

    switch (contentType) {
      case 'posts':
      case 'pages':
        return {
          ...baseData,
          title: '',
          content: '',
          slug: '',
          author_id: '',
          excerpt: '',
          featured_image: '',
          tags: []
        } as unknown as FormData<T>;
      case 'storeItems':
        return {
          ...baseData,
          name: '',
          description: '',
          price: 0,
          category: 'digital',
          image_url: '',
          stock_quantity: 0
        } as unknown as FormData<T>;
      case 'libraryItems':
        return {
          ...baseData,
          title: '',
          description: '',
          file_url: '',
          file_type: '',
          file_size: 0,
          category: 'tutorial',
          tags: []
        } as unknown as FormData<T>;
      case 'characters':
        return {
          ...baseData,
          name: '',
          description: '',
          role: '',
          backstory: '',
          image_url: ''
        } as unknown as FormData<T>;
      default:
        throw new Error(`Unsupported content type: ${contentType}`);
    }
  }

  const handleSubmit = useCallback(() => {
    const dataToSave = item ? { ...item, ...formData } : formData;
    onSave(dataToSave as T);
  }, [formData, item, onSave]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      ...('slug' in prev ? { slug: prev.slug || generateSlug(newTitle) } : {})
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

  // Type-safe field handlers
  const handleTextChange = useCallback((field: keyof FormData<T>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value } as FormData<T>));
  }, []);

  const handleNumberChange = useCallback((field: keyof FormData<T>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(e.target.value) } as FormData<T>));
  }, []);

  const handleSelectChange = useCallback((field: keyof FormData<T>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value } as FormData<T>));
  }, []);
  

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
                value={'title' in formData ? formData.title : ''}
                onChange={handleTextChange('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={'slug' in formData ? formData.slug : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value } as FormData<T>))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="my-awesome-post"
              />
              <p className="mt-1 text-sm text-gray-500">URL-friendly version of the title. e.g., 'my-awesome-post'</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div className="editor-container">
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
        const storeItem = formData as StoreItem;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={storeItem.name}
                onChange={handleTextChange('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                value={storeItem.price}
                onChange={handleNumberChange('price')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={storeItem.category}
                onChange={handleSelectChange('category')}
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
                value={storeItem.description}
                onChange={handleTextChange('description')}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product description..."
              />
            </div>
          </>
        );
      case 'libraryItems':
        const libraryItemFormData = formData as Omit<LibraryItem, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={libraryItemFormData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value} as FormData<T>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resource title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={libraryItemFormData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value} as FormData<T>)}
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
                value={libraryItemFormData.file_url}
                onChange={(e) => setFormData({...formData, file_url: e.target.value} as FormData<T>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={libraryItemFormData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value} as FormData<T>)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resource description..."
              />
            </div>
          </>
        );
      case 'characters':
        const characterFormData = formData as Omit<Character, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Character Name</label>
              <input
                type="text"
                value={characterFormData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value} as FormData<T>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Character name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={characterFormData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value} as FormData<T>)}
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
                value={characterFormData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value} as FormData<T>)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Character description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backstory</label>
              <textarea
                value={characterFormData.backstory}
                onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value } as FormData<T>))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Character backstory..."
              />
            </div>
          </>
        );
      case 'timelineEvents':
        const timelineEventFormData = formData as Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                value={timelineEventFormData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value} as FormData<T>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={timelineEventFormData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value} as FormData<T>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Era</label>
              <select
                value={timelineEventFormData.era}
                onChange={(e) => setFormData({...formData, era: e.target.value} as FormData<T>)}
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
                value={timelineEventFormData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value} as FormData<T>)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event description..."
              />
            </div>
          </>
        );
      case 'betaUsers':
        const betaUserFormData = formData as Omit<BetaUser, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={betaUserFormData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value} as FormData<T>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="User name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={betaUserFormData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value} as FormData<T>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={betaUserFormData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value} as FormData<T>)}
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