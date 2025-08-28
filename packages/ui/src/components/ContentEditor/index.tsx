import React, { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import { 
  ContentItem, 
  ContentType,
  ContentStatus,
  FormData
} from '@zoroaster/shared/types/content';

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

interface ContentEditorProps<T extends ContentItem> {
  item?: T;
  contentType: ContentType;
  onSave: (data: T) => void;
  onCancel: () => void;
}

export function ContentEditor<T extends ContentItem>({ 
  item, 
  contentType, 
  onSave, 
  onCancel 
}: ContentEditorProps<T>) {
  const [formData, setFormData] = useState<FormData<T>>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get initial form data based on content type
  function getInitialFormData(): FormData<T> {
    if (item) {
      // If we have an existing item, use its values
      const { id, created_at, updated_at, created_by, ...rest } = item;
      return rest as FormData<T>;
    }

    // Default values based on content type
    switch (contentType) {
      case 'posts':
      case 'pages':
        return {
          status: 'draft',
          title: '',
          content: '',
          slug: '',
          author_id: undefined,
          excerpt: undefined,
          featured_image: undefined,
          tags: [],
          category_id: undefined,
        } as unknown as FormData<T>;
      case 'storeItems':
        return {
          status: 'active', // Default status for storeItems
          name: '',
          description: '',
          price: 0,
          category: 'digital',
          image_url: undefined,
          stock_quantity: 0,
          sku: undefined,
        } as unknown as FormData<T>;
      case 'libraryItems':
        return {
          status: 'draft',
          title: '',
          description: '',
          file_url: '',
          file_type: undefined,
          file_size: 0,
          category: 'tutorial',
          thumbnail_url: undefined,
        } as unknown as FormData<T>;
      case 'characters':
        return {
          status: 'draft',
          name: '',
          description: '',
          role: '',
          backstory: '',
          image_url: undefined,
          birth_date: undefined,
          death_date: null,
          species: undefined,
          occupation: undefined,
          relationships: undefined,
        } as unknown as FormData<T>;
      case 'timelineEvents': // Add this case
        return {
          status: 'draft',
          title: '',
          date: '',
          era: 'ancient',
          description: '',
          is_published: false,
        } as unknown as FormData<T>;
      case 'betaUsers': // Add this case
        return {
          status: 'pending',
          name: '',
          email: '',
          message: ''
        } as unknown as FormData<T>;
      default:
        throw new Error(`Unsupported content type: ${contentType}`);
    }
  }

  // Reset form when item or content type changes
  useEffect(() => {
    setFormData(getInitialFormData());
    setErrors({});
  }, [contentType, item]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({ 
        ...(item || {} as T), 
        ...formData,
        updated_at: new Date().toISOString(),
        status: formData.status || 'draft'
      } as T);
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Common validations
    if ('title' in formData && !formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if ('content' in formData && !formData.content) {
      newErrors.content = 'Content is required';
    }
    
    // Type-specific validations
    if (contentType === 'storeItems') {
      const storeItem = formData as any;
      if (storeItem.price < 0) {
        newErrors.price = 'Price cannot be negative';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text input changes
  const handleTextChange = useCallback(<K extends keyof FormData<T>>(field: K) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      
      setFormData(prev => ({
        ...prev,
        [field]: value
      } as FormData<T>));
      
      // Auto-generate slug when title changes
      if (field === 'title' && 'slug' in formData) {
        setFormData(prev => ({
          ...prev,
          slug: generateSlug(value)
        } as FormData<T>));
      }
      
      // Clear error when field is updated
      if (errors[field as string]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    }, [errors, formData]);

  // Handle number input changes
  const handleNumberChange = useCallback(<K extends keyof FormData<T>>(field: K) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      
      setFormData(prev => ({
        ...prev,
        [field]: value
      } as FormData<T>));
      
      // Clear error when field is updated
      if (errors[field as string]) {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }, [errors]);

  // Handle select changes
  const handleSelectChange = useCallback(<K extends keyof FormData<T>>(field: K) => 
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      } as FormData<T>));
    }, []);

  // Render form fields based on content type
  const renderFields = () => {
    switch (contentType) {
      case 'posts':
      case 'pages':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={(formData as any).title || ''}
                onChange={handleTextChange('title' as keyof FormData<T>)}
                className="w-full p-2 border rounded"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={(formData as any).slug || ''}
                onChange={handleTextChange('slug' as keyof FormData<T>)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                value={(formData as any).excerpt || ''}
                onChange={handleTextChange('excerpt' as keyof FormData<T>)}
                className="w-full p-2 border rounded h-24"
              />
            </div>
          </>
        );
      case 'storeItems':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={(formData as any).name || ''}
                onChange={handleTextChange('name' as keyof FormData<T>)}
                className="w-full p-2 border rounded"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={(formData as any).price || 0}
                onChange={handleNumberChange('price' as keyof FormData<T>)}
                className="w-full p-2 border rounded"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </>
        );
      // Add more cases for other content types
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {item ? 'Edit' : 'Create'} {contentType}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderFields()}
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            <span className="flex items-center">
              <Save size={16} className="mr-2" />
              {item ? 'Update' : 'Save'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContentEditor;
