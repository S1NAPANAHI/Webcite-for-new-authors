import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link as TipTapLink from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Save,
  Eye,
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Settings,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';
import { 
  Chapter, 
  ContentItemWithChildren, 
  CreateChapterForm, 
  ChapterStatus 
} from '../../../types/content';

// Mock data
const mockChapter: Chapter = {
  id: 'ch1',
  issue_id: '5',
  title: 'The Dream of Fire',
  slug: 'the-dream-of-fire',
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'In the depths of night, when the world lay silent and the stars whispered ancient secrets, Darius found himself standing in a realm that existed between dreams and reality. The air shimmered with an otherworldly heat, and before him stretched a vast temple wreathed in eternal flames.'
          }
        ]
      }
    ]
  },
  plain_content: '',
  chapter_number: 1,
  word_count: 3200,
  estimated_read_time: 16,
  status: 'draft',
  published_at: null,
  metadata: {},
  created_at: '2025-02-01T00:00:00Z',
  updated_at: '2025-09-18T00:00:00Z'
};

const mockIssue: ContentItemWithChildren = {
  id: '5',
  type: 'issue',
  title: 'Issue #1: The Calling',
  slug: 'issue-1-the-calling',
  description: 'The journey begins...',
  order_index: 1,
  completion_percentage: 75,
  average_rating: 4.8,
  rating_count: 32,
  status: 'published',
  published_at: '2025-02-10T00:00:00Z',
  metadata: {},
  created_at: '2025-01-20T00:00:00Z',
  updated_at: '2025-09-18T00:00:00Z'
};

interface EditorToolbarProps {
  editor: any;
}

function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;
  
  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-100 text-indigo-700'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
  
  return (
    <div className="border-b border-gray-200 p-4 flex items-center space-x-2 flex-wrap">
      {/* History */}
      <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>
      
      {/* Text Formatting */}
      <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
      </div>
      
      {/* Text Alignment */}
      <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
      </div>
      
      {/* Lists and Quotes */}
      <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
      </div>
      
      {/* Media */}
      <div className="flex items-center space-x-1">
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}

interface ChapterMetaFormProps {
  chapter: Chapter;
  issue: ContentItemWithChildren;
  onUpdate: (updates: Partial<Chapter>) => void;
}

function ChapterMetaForm({ chapter, issue, onUpdate }: ChapterMetaFormProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapter Settings</h3>
      
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapter Number
            </label>
            <input
              type="number"
              value={chapter.chapter_number}
              onChange={(e) => onUpdate({ chapter_number: parseInt(e.target.value) || 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={chapter.status}
              onChange={(e) => onUpdate({ status: e.target.value as ChapterStatus })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        
        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            value={chapter.slug}
            onChange={(e) => onUpdate({ slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        {/* Scheduled Publishing */}
        {chapter.status === 'scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              value={chapter.published_at ? new Date(chapter.published_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => onUpdate({ published_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}
        
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{chapter.word_count.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{chapter.estimated_read_time}</div>
            <div className="text-sm text-gray-600">Min Read</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">#{chapter.chapter_number}</div>
            <div className="text-sm text-gray-600">Chapter</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChapterEditor() {
  const { id, issueId } = useParams<{ id?: string; issueId?: string }>();
  const navigate = useNavigate();
  
  const [chapter, setChapter] = useState<Chapter | null>(id ? mockChapter : null);
  const [issue, setIssue] = useState<ContentItemWithChildren | null>(mockIssue);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your chapter...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 hover:text-indigo-700 underline'
        }
      })
    ],
    content: chapter?.content || '',
    onUpdate: ({ editor }) => {
      // Auto-save functionality
      debouncedAutoSave(editor.getJSON());
      
      // Update word count and reading time
      const text = editor.getText();
      const wordCount = text.trim().split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200); // 200 words per minute
      
      setChapter(prev => prev ? {
        ...prev,
        content: editor.getJSON(),
        plain_content: text,
        word_count: wordCount,
        estimated_read_time: readTime
      } : null);
    }
  });
  
  // Debounced auto-save
  const debouncedAutoSave = useCallback(
    debounce(async (content: any) => {
      if (!chapter) return;
      
      setAutoSaving(true);
      try {
        // Auto-save API call
        console.log('Auto-saving chapter...', content);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setAutoSaving(false);
      }
    }, 2000),
    [chapter]
  );
  
  useEffect(() => {
    if (id) {
      // Load existing chapter
      setChapter(mockChapter);
      setTitle(mockChapter.title);
    } else if (issueId) {
      // Create new chapter
      const newChapterNumber = (issue?.metadata?.chapter_count || 0) + 1;
      setChapter({
        id: '',
        issue_id: issueId,
        title: '',
        slug: '',
        content: { type: 'doc', content: [] },
        plain_content: '',
        chapter_number: newChapterNumber,
        word_count: 0,
        estimated_read_time: 0,
        status: 'draft',
        published_at: null,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }, [id, issueId]);
  
  useEffect(() => {
    if (chapter && editor && chapter.content) {
      editor.commands.setContent(chapter.content);
    }
  }, [chapter, editor]);
  
  // Update slug when title changes
  useEffect(() => {
    if (title && chapter) {
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-|-$/g, '');
      
      setChapter(prev => prev ? { ...prev, title, slug } : null);
    }
  }, [title]);
  
  const handleSave = async (publishNow: boolean = false) => {
    if (!chapter || !editor) return;
    
    setLoading(true);
    
    try {
      const chapterData: CreateChapterForm = {
        issue_id: chapter.issue_id,
        title: chapter.title,
        slug: chapter.slug,
        content: editor.getJSON(),
        chapter_number: chapter.chapter_number,
        status: publishNow ? 'published' : chapter.status,
        published_at: publishNow ? new Date().toISOString() : chapter.published_at,
        metadata: chapter.metadata
      };
      
      // API call to save chapter
      console.log('Saving chapter:', chapterData);
      
      if (publishNow) {
        alert('Chapter published successfully!');
      } else {
        alert('Chapter saved as draft!');
      }
      
    } catch (error) {
      console.error('Error saving chapter:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileUpload = async (file: File) => {
    // Handle file upload for chapter content
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Upload file and extract content
      console.log('Uploading file:', file.name);
      
      // For text files, you could read and insert content
      if (file.type === 'text/plain') {
        const content = await file.text();
        editor?.commands.setContent(`<p>${content.replace(/\n/g, '</p><p>')}</p>`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  if (!chapter || !issue) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={`/admin/content/works`}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {id ? 'Edit Chapter' : 'New Chapter'}
                </h1>
                <p className="text-sm text-gray-600">
                  {issue.title} • Chapter {chapter.chapter_number}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {autoSaving && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span>Auto-saving...</span>
                </div>
              )}
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-2 rounded-lg border transition-colors duration-200 flex items-center space-x-2 ${
                  showPreview
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-3 py-2 rounded-lg border transition-colors duration-200 flex items-center space-x-2 ${
                  showSettings
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={() => handleSave(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              
              <button
                onClick={() => handleSave(true)}
                disabled={loading || !chapter.title.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 ${
          showSettings ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
        }`}>
          {/* Editor Column */}
          <div className={showSettings ? 'lg:col-span-2' : 'col-span-1'}>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Title Input */}
              <div className="p-6 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Chapter title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                />
              </div>
              
              {/* File Upload Area */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Upload File</span>
                      <input
                        type="file"
                        accept=".txt,.md,.docx"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    
                    <span className="text-sm text-gray-500">
                      Or paste/type your content below
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{chapter.word_count.toLocaleString()} words</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{chapter.estimated_read_time} min read</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Editor Toolbar */}
              <EditorToolbar editor={editor} />
              
              {/* Editor Content */}
              <div className={`${showPreview ? 'grid grid-cols-2' : ''}`}>
                <div className="prose prose-lg max-w-none p-6 min-h-[500px] focus-within:bg-gray-50 transition-colors duration-200">
                  <EditorContent 
                    editor={editor} 
                    className="outline-none min-h-[400px]"
                  />
                </div>
                
                {/* Preview Pane */}
                {showPreview && (
                  <div className="border-l border-gray-200 p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview</h4>
                    <div className="prose prose-lg max-w-none">
                      <h1>{chapter.title || 'Untitled Chapter'}</h1>
                      <div dangerouslySetInnerHTML={{ 
                        __html: editor?.getHTML() || '<p>Start writing to see preview...</p>' 
                      }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Settings Sidebar */}
          {showSettings && (
            <div className="lg:col-span-1 space-y-6">
              <ChapterMetaForm
                chapter={chapter}
                issue={issue}
                onUpdate={(updates) => setChapter(prev => prev ? { ...prev, ...updates } : null)}
              />
              
              {/* Issue Context */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent Issue</h3>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {issue.cover_image_url ? (
                      <img 
                        src={issue.cover_image_url} 
                        alt={issue.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2">{issue.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{issue.completion_percentage}% complete</p>
                    <Link
                      to={`/admin/content/works`}
                      className="text-sm text-indigo-600 hover:text-indigo-700 mt-2 inline-block"
                    >
                      Manage Issue →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}