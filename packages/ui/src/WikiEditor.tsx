import React, { useState, useEffect, useRef, Suspense, lazy, forwardRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { Button } from '@zoroaster/ui';
import { Input } from '@zoroaster/ui';
import { Label } from '@zoroaster/ui';
import { Switch } from '@zoroaster/ui';
import { Textarea } from '@zoroaster/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@zoroaster/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@zoroaster/ui';
import { Badge } from '@zoroaster/ui';
import { Loader2, Save, ArrowLeft, Eye, Tag, Search, X } from 'lucide-react';
import { toast } from 'sonner';

// Import ReactQuill with dynamic import
const ReactQuill = lazy(() => import('react-quill-new').then(module => ({
  default: module.default
})));

// Import Quill CSS
import 'quill/dist/quill.snow.css';

// Simple wrapper component for ReactQuill
const QuillEditor = forwardRef<any, any>(({ value, onChange, ...props }, ref) => {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <ReactQuill
        ref={ref}
        theme="snow"
        value={value}
        onChange={onChange}
        {...props}
      />
    </Suspense>
  );
});
QuillEditor.displayName = 'QuillEditor';

// Quill modules configuration
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  },
};

// Quill editor formats
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'link', 'image'
];

type WikiSection = {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'infobox' | 'gallery' | 'timeline' | 'quote' | 'category-list';
};

type WikiPage = {
  id?: string;
  title: string;
  slug: string;
  sections: WikiSection[];
  category_id: string | null;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
};

type Category = {
  id: string;
  name: string;
};

export function WikiEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategorySearch, setShowCategorySearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  
  const [page, setPage] = useState<WikiPage>({
    title: '',
    slug: '',
    sections: [{
      id: 'section-1',
      title: 'Introduction',
      content: '',
      type: 'text'
    }],
    category_id: null,
    is_published: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: [],
  });

  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchWikiPage();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      
      // Now fetch the categories
      const { data, error, status } = await supabase
        .from('wiki_categories')
        .select('*')
        .order('name', { ascending: true });
      
      console.log('Categories fetch status:', status);
      console.log('Categories data:', data);
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      setCategories(data as Category[] || []);
      
      if (!data || data.length === 0) {
        console.warn('No categories found in the database');
        toast.warning('No categories found. Please create categories first.');
      }
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      toast.error('Failed to load categories. Check console for details.');
    }
  };

  const fetchWikiPage = async () => {
    try {
      const { data, error } = await supabase
        .from('wiki_pages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setPage({
          ...data,
          sections: Array.isArray(data.content) ? data.content : [], // Ensure content is properly mapped to sections
        });
      } else {
        throw new Error('Wiki page not found.');
      }
      
      // Set selected category if exists
      if (data.category_id) {
        const { data: categoryData } = await supabase
          .from('wiki_categories')
          .select('*')
          .eq('id', data.category_id)
          .single();
        
        if (categoryData) {
          setSelectedCategory(categoryData as Category);
        }
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

  const addSection = (type: WikiSection['type']) => {
    const newSection: WikiSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: '',
      type
    };
    setPage(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<WikiSection>) => {
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

  const handleSelectCategory = (category: Category) => {
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
    try {
      setSaving(true);

      // Basic validation
      if (!page.title.trim()) {
        toast.error('Title is required');
        return;
      }

      if (!page.slug.trim()) {
        toast.error('Slug is required');
        return;
      }

      // Ensure the user is authenticated before saving
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error('You must be signed in to save changes.');
        return;
      }

      // Prepare the page data for wiki_pages table (without content/sections)
      const pageInsertUpdateData = {
        title: page.title.trim(),
        slug: page.slug.trim(),
        category_id: page.category_id || null,
        is_published: page.is_published,
        seo_title: page.seo_title?.trim() || null,
        seo_description: page.seo_description?.trim() || null,
        seo_keywords: page.seo_keywords || [],
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

      // If this was a new page, redirect to edit page
      if (!id && resultPage) {
        navigate(`/account/admin/wiki/edit/${resultPage.id}`, { replace: true });
      }

      return resultPage;
    } catch (error: any) {
      console.error('Error saving wiki page:', error);
      
      // More specific error messages
      if (error.code === '23505') { // Unique violation
        toast.error('A page with this slug already exists');
      } else if (error.code === '42501') { // Permission denied
        toast.error('You do not have permission to perform this action');
      } else {
        toast.error(`Failed to save wiki page: ${error.message || 'Unknown error'}`);
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
        toast.error(`Failed to update page status: ${error.message}`);
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

  const Editor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <QuillEditor
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      className="min-h-[200px]"
    />
  );

  const renderSectionContent = (section: WikiSection) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="mt-4">
            <QuillEditor
              value={section.content || ''}
              onChange={(content) => updateSection(section.id, { content })}
              modules={modules}
              formats={formats}
              className="min-h-[300px]"
            />
          </div>
        );
      case 'quote':
        return (
          <div>
            <Textarea
              value={section.content || ''}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Enter quote..."
              rows={3}
            />
          </div>
        );
      // Add other section type editors as needed
      default:
        return <div>Unsupported section type</div>;
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
                              onChange={(e) => updateSection(section.id, { type: e.target.value as WikiSection['type'] })}
                              className="text-sm p-1 border rounded"
                            >
                              <option value="text">Text</option>
                              <option value="infobox">Infobox</option>
                              <option value="gallery">Gallery</option>
                              <option value="timeline">Timeline</option>
                              <option value="quote">Quote</option>
                              <option value="category-list">Category List</option>
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
                  <Button type="button" variant="outline" onClick={() => addSection('text')}>
                    Add Text Section
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addSection('infobox')}>
                    Add Infobox
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addSection('gallery')}>
                    Add Gallery
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

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    name="seo_title"
                    value={page.seo_title}
                    onChange={handleInputChange}
                    placeholder="SEO Title (60 characters max)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {page.seo_title.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description">Meta Description</Label>
                  <Textarea
                    id="seo_description"
                    name="seo_description"
                    value={page.seo_description}
                    onChange={handleInputChange}
                    placeholder="A brief description of the page for search engines (160 characters max)"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {page.seo_description?.length || 0}/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      placeholder="Add a keyword"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleAddKeyword}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {page.seo_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {page.seo_keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="flex items-center">
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
