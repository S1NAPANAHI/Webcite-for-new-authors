import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { Button, Input, Textarea, Label, Switch } from '@zoroaster/ui';
import { toast } from 'sonner';
import { Save, Loader2, ArrowLeft, Eye, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Tag } from './components/ui/tag';

// Import ReactQuill with proper typing
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';



interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  theme?: string;
  modules?: Record<string, any>;
  formats?: string[];
  className?: string;
}

const QuillEditor = forwardRef<typeof ReactQuill, QuillEditorProps>(({ 
  value, 
  onChange, 
  theme = 'snow',
  modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  },
  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ],
  ...props 
}, ref) => {
  const handleChange = (content: string) => {
    try {
      if (onChange) {
        onChange(content);
      }
    } catch (error) {
      console.error('Error in handleChange:', error);
    }
  };

  return (
    <div className="mt-4">
      <ReactQuill
        ref={ref as any}
        theme={theme}
        value={value}
        onChange={handleChange}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }}
        formats={[
          'header',
          'bold', 'italic', 'underline', 'strike',
          'list', 'bullet',
          'link', 'image'
        ]}
        {...props}
      />
    </div>
  );
});

QuillEditor.displayName = 'QuillEditor';

import { WikiPage, WikiSectionView, WikiCategory, fetchWikiPage as fetchSharedWikiPage, fetchCategories as fetchSharedCategories } from '@zoroaster/shared';

interface WikiEditorProps {
  id?: string;
  onUpdatePage?: (page: WikiPage) => void;
  initialData?: WikiPageWithSections;
}

export function WikiEditor({ id, onUpdatePage, initialData }: WikiEditorProps) {
  const { id: urlId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategorySearch, setShowCategorySearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WikiCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  
  const [page, setPage] = useState<WikiPageWithSections>(() => {
    if (initialData) return initialData;
    
    return {
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: [],
      sections: [{
        id: 'section-1',
        title: 'Introduction',
        content: '',
        type: 'paragraph',
        page_id: '',
        position: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as WikiSectionView & { content: string }],
      category_id: null,
      is_published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: '',
      folder_id: null,
      view_count: 0,
      category: null,
      user: null,
    } as WikiPageWithSections;
  });

  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    const pageId = id || urlId; // Use the prop id if available, otherwise fall back to urlId
    fetchCategories();
    if (pageId) {
      fetchWikiPage(pageId);
    } else {
      setLoading(false);
    }
  }, [id, urlId]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const data = await fetchSharedCategories(); // Use the shared function
      setCategories(data || []);
      if (!data || data.length === 0) {
        console.warn('No categories found in the database');
        toast.warning('No categories found. Please create categories first.');
      }
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      toast.error('Failed to load categories. Check console for details.');
    }
  };

  const fetchWikiPage = async (pageId: string) => {
    try {
      const data = await fetchSharedWikiPage(pageId);
      
      if (data) {
        // Ensure sections is always an array
        const pageWithSections: WikiPageWithSections = {
          ...data,
          sections: data.sections || []
        };
        setPage(pageWithSections);
        
        // Set selected category if exists
        if (data.category) {
          setSelectedCategory(data.category);
        }
      } else {
        throw new Error('Wiki page not found.');
      }
    } catch (error) {
      console.error('Error fetching wiki page:', error);
      toast.error('Failed to load wiki page');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPage(prev => ({ ...prev, [name]: value }));
  };

  const addSection = (type: WikiSectionView['type']) => {
    const newSection: WikiSectionView = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: '',
      type: type || 'paragraph' // Default to paragraph if type is not provided
    };
    setPage(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<WikiSectionView>) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const removeSection = (sectionId: string) => {
    if (page.sections.length <= 1) {
      toast.error('You must have at least one section');
      return;
    }
    setPage(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !page.seo_keywords.includes(newKeyword.trim())) {
      setPage(prev => ({
        ...prev,
        seo_keywords: [...prev.seo_keywords, newKeyword.trim()],
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setPage(prev => ({
      ...prev,
      seo_keywords: prev.seo_keywords.filter(k => k !== keyword),
    }));
  };

  const handleSelectCategory = (category: WikiCategory) => {
    setSelectedCategory(category);
    setPage(prev => ({ ...prev, category_id: category.id }));
    setShowCategorySearch(false);
  };

  const handleRemoveCategory = () => {
    setSelectedCategory(null);
    setPage(prev => ({ ...prev, category_id: null }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPage(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo_title: prev.seo_title || title,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Basic validation
      if (!page?.title?.trim()) {
        toast.error('Title is required');
        setSaving(false);
        return;
      }

      if (!page.slug?.trim()) {
        toast.error('Slug is required');
        setSaving(false);
        return;
      }

      // Ensure the user is authenticated before saving
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error('You must be signed in to save changes.');
        setSaving(false);
        return;
      }

      // Prepare the page data for wiki_pages table (without content/sections)
      const pageInsertUpdateData = {
        title: page.title.trim(),
        slug: page.slug.trim(),
        category_id: page.category_id || null,
        is_published: page.is_published,
        updated_at: new Date().toISOString(),
      };

      let resultPage: WikiPage | null = null; // To store the result of page insert/update

      if (id) {
        // Update existing page
        const { data, error } = await supabase
          .from('wiki_pages')
          .update(pageInsertUpdateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        if (data) { resultPage = data; } else { throw new Error('Page data not found after update.'); }
        toast.success('Wiki page updated successfully');

        // Delete existing content blocks for update
        const { error: deleteContentError } = await supabase
          .from('wiki_content_blocks')
          .delete()
          .eq('page_id', resultPage.id);

        if (deleteContentError) {
          console.error('Error deleting old content blocks:', deleteContentError);
          throw new Error('Failed to update content blocks');
        }

      } else {
        // Create new page
        const { data, error } = await supabase
          .from('wiki_pages')
          .insert([
            {
              ...pageInsertUpdateData,
              created_by: user!.id, // Add created_by for new pages
              created_at: new Date().toISOString(),
              view_count: 0,
              
            },
          ])
          .select()
          .single();

        if (error) throw error;
        if (data) { resultPage = data; } else { throw new Error('Page data not found after creation.'); }
        toast.success('Wiki page created successfully');
      }

      // Handle content blocks (sections)
      if (resultPage && page.sections && page.sections.length > 0) {
        const contentBlocksToInsert = page.sections.map((section, index) => ({
          page_id: resultPage.id,
          type: section.type,
          content: section.content, // Assuming content is already in the correct format (jsonb)
          position: index,
          created_by: user!.id, // Assign created_by for content blocks
        }));

        const { error: contentBlocksError } = await supabase
          .from('wiki_content_blocks')
          .insert(contentBlocksToInsert);

        if (contentBlocksError) {
          console.error('Error saving content blocks:', contentBlocksError);
          // Optionally, if content blocks fail, you might want to delete the page
          // await supabase.from('wiki_pages').delete().eq('id', resultPage.id);
          throw new Error('Failed to save content blocks');
        }
      }

      // After saving the page, call onUpdatePage with the updated page data
      if (resultPage) {
        // Save sections here...
        
        // Prepare the updated page data with all required fields
        const updatedPage: WikiPageWithSections = {
          ...resultPage,
          title: page.title,
          slug: page.slug,
          excerpt: page.excerpt || null,
          is_published: page.is_published,
          category_id: page.category_id || null,
          category: selectedCategory || null,
          sections: page.sections || [],
          created_at: resultPage.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Include any other required fields from the WikiPage type
        };
        
        // Call the onUpdatePage callback if provided
        if (onUpdatePage) {
          onUpdatePage(updatedPage);
        }
        
        // If this was a new page, navigate to its edit URL
        if (!id) {
          navigate(`/account/admin/wiki/page/${resultPage.id}`);
        }
      }
    } catch (error: any) {
      console.error('Error saving wiki page:', error);
      
      // More specific error messages
      if (error.code === '23505') { // Unique violation
        toast.error('A page with this slug already exists');
      } else if (error.code === '42501') { // Permission denied
        toast.error('You do not have permission to perform this action');
      } else {
        toast.error(`Failed to save wiki page: ${(error instanceof Error ? error.message : String(error)) || 'Unknown error'}`);
      }
      
      throw error; // Re-throw to allow further error handling if needed
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    const newStatus = !page.is_published;
    setPage(prev => ({ ...prev, is_published: newStatus }));
    
    if (id) {
      try {
        const { error } = await supabase
          .from('wiki_pages')
          .update({ 
            is_published: newStatus,
            published_at: newStatus ? new Date().toISOString() : null 
          })
          .eq('id', id);
        
        if (error) throw error;
        toast.success(`Page ${newStatus ? 'published' : 'unpublished'} successfully`);
      } catch (error) {
        console.error('Error updating publish status:', error);
        toast.error(`Failed to update page status: ${(error instanceof Error ? error.message : String(error))}`);
        // Revert on error
        setPage(prev => ({ ...prev, is_published: !newStatus }));
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create categories');
        return;
      }

      const { data, error } = await supabase
        .from('wiki_categories')
        .insert([
          {
            name: newCategoryName.trim(),
            slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
            created_by: user!.id,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Add the new category to the list
      setCategories(prev => [...prev, data]);
      // Select the new category
      handleSelectCategory(data);
      setNewCategoryName('');
      setIsCreatingNewCategory(false);
      toast.success('Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  const renderCategorySelector = () => (
    <div className="space-y-2">
      <Label>Category</Label>
      {selectedCategory ? (
        <div className="flex items-center justify-between p-2 border rounded-md">
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{selectedCategory.name}</span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={handleRemoveCategory}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : isCreatingNewCategory ? (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
            <Button 
              type="button" 
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              Add
            </Button>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => setIsCreatingNewCategory(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => setShowCategorySearch(true)}
          >
            <Tag className="h-4 w-4 mr-2" />
            Select a category
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            or{' '}
            <button 
              type="button" 
              className="text-primary hover:underline"
              onClick={() => setIsCreatingNewCategory(true)}
            >
              create a new category
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSectionContent = (section: WikiSectionView) => {
    const handleContentChange = (content: string) => {
      updateSection(section.id, { content });
    };

    const editorModules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ]
    };

    const editorFormats = [
      'header',
      'bold', 'italic', 'underline', 'strike',
      'list', 'bullet',
      'link', 'image'
    ];

    switch (section.type) {
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
      case 'paragraph':
      case 'bullet_list':
      case 'ordered_list':
        return (
          <div className="mt-4">
            <ReactQuill
              value={section.content || ''}
              onChange={handleContentChange}
              theme="snow"
              modules={editorModules}
              formats={editorFormats}
              className="min-h-[100px]"
            />
          </div>
        );
      case 'quote':
        return (
          <div className="mt-4 border-l-4 border-gray-300 pl-4 italic">
            <ReactQuill
              value={section.content || ''}
              onChange={handleContentChange}
              theme="snow"
              modules={editorModules}
              formats={editorFormats}
              className="min-h-[100px]"
            />
          </div>
        );
      case 'code':
        return (
          <div className="mt-4 bg-gray-100 p-4 rounded-md font-mono text-sm">
            <Textarea
              value={section.content || ''}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Enter code..."
              rows={6}
              className="font-mono"
            />
          </div>
        );
      case 'divider':
        return <div className="my-6 border-t border-gray-200"></div>;
      case 'image':
        return (
          <div className="mt-4">
            <Input
              type="text"
              value={section.content || ''}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Enter image URL..."
            />
            {section.content && (
              <div className="mt-2">
                <img 
                  src={section.content} 
                  alt="Section content" 
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="mt-4 text-gray-500 italic">
            Unsupported section type: {section.type}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filteredCategories = searchTerm
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/account/admin/wiki')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wiki
            </Button>
            <h1 className="text-2xl font-bold">
              {id ? 'Edit Wiki Page' : 'Create New Wiki Page'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="is_published">Publish</Label>
              <Switch 
                id="is_published" 
                checked={page.is_published}
                onCheckedChange={handlePublishToggle}
              />
            </div>
            <Button type="button" disabled={saving} onClick={handleSave}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={page.title}
                    onChange={handleTitleChange}
                    placeholder="Enter page title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <span className="text-sm text-muted-foreground">
                      {`${window.location.origin}/wiki/${page.slug || 'your-page-slug'}`}
                    </span>
                  </div>
                  <Input
                    id="slug"
                    name="slug"
                    value={page.slug}
                    onChange={handleInputChange}
                    placeholder="page-slug"
                    required
                  />
                </div>

                {renderCategorySelector()}

                <div className="space-y-2">
                  <Label>Sections</Label>
                  {page.sections.map((section, index) => (
                    <Card key={section.id} className="mb-4">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            placeholder="Section Title"
                            className="text-xl font-bold"
                          />
                          <div className="flex space-x-2">
                            <select
                              value={section.type}
                              onChange={(e) => updateSection(section.id, { type: e.target.value as WikiSectionView['type'] })}
                              className="text-sm p-1 border rounded"
                            >
                              <option value="paragraph">Paragraph</option>
                              <option value="heading_1">Heading 1</option>
                              <option value="heading_2">Heading 2</option>
                              <option value="heading_3">Heading 3</option>
                              <option value="bullet_list">Bullet List</option>
                              <option value="ordered_list">Ordered List</option>
                              <option value="image">Image</option>
                              <option value="table">Table</option>
                              <option value="quote">Quote</option>
                              <option value="code">Code</option>
                              <option value="divider">Divider</option>
                            </select>
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              onClick={() => removeSection(section.id)}
                              disabled={page.sections.length <= 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {renderSectionContent(section)}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Button type="button" variant="outline" onClick={() => addSection('paragraph')}>
                    Add Paragraph
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addSection('heading_1')}>
                    Add Heading 1
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addSection('quote')}>
                    Add Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {page.is_published ? 'Published' : 'Draft'}
                    </p>
                  </div>
                  <Switch 
                    checked={page.is_published}
                    onCheckedChange={handlePublishToggle}
                  />
                </div>
                
                {id && (
                  <div className="space-y-2">
                    <h4 className="font-medium">URL</h4>
                    <div className="flex items-center">
                      <a 
                        href={`/wiki/${page.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        View page <Eye className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            
          </div>
        </div>
      </form>
    </div>
  );
}
