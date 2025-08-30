import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, forwardRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import { Switch } from './switch';
import { toast } from 'sonner';
import { Save, Loader2, ArrowLeft, Eye, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Tag } from './components/ui/tag';
// Import ReactQuill with proper typing
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
const QuillEditor = forwardRef(({ value, onChange, theme = 'snow', modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ]
}, formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
], ...props }, ref) => {
    const handleChange = (content) => {
        try {
            if (onChange) {
                onChange(content);
            }
        }
        catch (error) {
            console.error('Error in handleChange:', error);
        }
    };
    return (_jsx("div", { className: "mt-4", children: _jsx(ReactQuill, { ref: ref, theme: theme, value: value, onChange: handleChange, modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            }, formats: [
                'header',
                'bold', 'italic', 'underline', 'strike',
                'list', 'bullet',
                'link', 'image'
            ], ...props }) }));
});
QuillEditor.displayName = 'QuillEditor';
import { fetchWikiPage as fetchSharedWikiPage, fetchCategories as fetchSharedCategories } from '@zoroaster/shared/wiki';
function isWikiCategory(obj) {
    return obj && typeof obj === 'object' && !('error' in obj) && 'id' in obj && 'name' in obj;
}
export function WikiEditor({ id, onUpdatePage, initialData }) {
    const { id: urlId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCategorySearch, setShowCategorySearch] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
    const [page, setPage] = useState(() => {
        if (initialData) {
            return {
                ...initialData,
                category: initialData.category || null,
                user: initialData.user || null,
            };
        }
        return {
            id: '',
            title: '',
            slug: '',
            excerpt: null,
            content: '',
            seo_title: null,
            seo_description: null,
            seo_keywords: [],
            sections: [],
            category_id: null,
            is_published: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: null,
            folder_id: null,
            view_count: null,
            category: null,
            user: null,
        };
    });
    const [newKeyword, setNewKeyword] = useState('');
    useEffect(() => {
        const pageId = id || urlId; // Use the prop id if available, otherwise fall back to urlId
        fetchCategories();
        if (pageId) {
            fetchWikiPage(pageId);
        }
        else {
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
        }
        catch (error) {
            console.error('Error in fetchCategories:', error);
            toast.error('Failed to load categories. Check console for details.');
        }
    };
    const fetchWikiPage = async (pageId) => {
        try {
            const data = await fetchSharedWikiPage(pageId);
            if (data) {
                // Ensure sections is always an array
                const pageWithSections = {
                    ...data,
                    sections: data.sections || []
                };
                setPage(pageWithSections);
                // Set selected category if exists
                if (data.category) {
                    setSelectedCategory(data.category);
                }
            }
            else {
                throw new Error('Wiki page not found.');
            }
        }
        catch (error) {
            console.error('Error fetching wiki page:', error);
            toast.error('Failed to load wiki page');
        }
        finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPage(prev => ({ ...prev, [name]: value }));
    };
    const addSection = (type) => {
        const newSection = {
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
    const updateSection = (sectionId, updates) => {
        setPage(prev => ({
            ...prev,
            sections: prev.sections.map(section => section.id === sectionId ? { ...section, ...updates } : section)
        }));
    };
    const removeSection = (sectionId) => {
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
    const handleRemoveKeyword = (keyword) => {
        setPage(prev => ({
            ...prev,
            seo_keywords: prev.seo_keywords.filter(k => k !== keyword),
        }));
    };
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setPage(prev => ({ ...prev, category_id: category.id }));
        setShowCategorySearch(false);
    };
    const handleRemoveCategory = () => {
        setSelectedCategory(null);
        setPage(prev => ({ ...prev, category_id: null }));
    };
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/--+/g, '-') // Replace multiple hyphens with single
            .trim();
    };
    const handleTitleChange = (e) => {
        const title = e.target.value;
        setPage(prev => ({
            ...prev,
            title,
            slug: generateSlug(title),
            seo_title: prev.seo_title || title,
        }));
    };
    const handleAddKeyword = () => {
        if (newKeyword.trim() && !(page.seo_keywords ?? []).includes(newKeyword.trim())) {
            setPage(prev => ({
                ...prev,
                seo_keywords: [...(prev.seo_keywords ?? []), newKeyword.trim()],
            }));
            setNewKeyword('');
        }
    };
    const handleRemoveKeyword = (keyword) => {
        setPage(prev => ({
            ...prev,
            seo_keywords: (prev.seo_keywords ?? []).filter(k => k !== keyword),
        }));
    };
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setPage(prev => ({ ...prev, category_id: category.id }));
        setShowCategorySearch(false);
    };
    const handleRemoveCategory = () => {
        setSelectedCategory(null);
        setPage(prev => ({ ...prev, category_id: null }));
    };
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/--+/g, '-') // Replace multiple hyphens with single
            .trim();
    };
    const handleTitleChange = (e) => {
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
            let resultPage = null; // To store the result of page insert/update
            if (id) {
                // Update existing page
                const { data, error } = await supabase
                    .from('wiki_pages')
                    .update(pageInsertUpdateData)
                    .eq('id', id)
                    .select()
                    .single();
                if (error)
                    throw error;
                if (data) {
                    resultPage = data;
                }
                else {
                    throw new Error('Page data not found after update.');
                }
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
            }
            else {
                // Create new page
                const { data, error } = await supabase
                    .from('wiki_pages')
                    .insert([
                    {
                        ...pageInsertUpdateData,
                        created_by: user.id, // Add created_by for new pages
                        created_at: new Date().toISOString(),
                        view_count: 0,
                    },
                ])
                    .select('*, user:profiles(*), category:wiki_categories(*)')
                    .single();
                if (error)
                    throw error;
                if (data) {
                    resultPage = data;
                }
                else {
                    throw new Error('Page data not found after creation.');
                }
                toast.success('Wiki page created successfully');
            }
            // Handle content blocks (sections)
            if (resultPage && page.sections && page.sections.length > 0) {
                const contentBlocksToInsert = page.sections.map((section, index) => ({
                    page_id: resultPage.id,
                    type: section.type,
                    content: section.content, // Assuming content is already in the correct format (jsonb)
                    position: index,
                    created_by: user.id, // Assign created_by for content blocks
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
                // Explicitly handle the user property from resultPage
                let userProfile = null;
                if (resultPage.user && typeof resultPage.user === 'object' && !('error' in resultPage.user)) {
                    userProfile = resultPage.user;
                }
                // Prepare the updated page data with all required fields
                const updatedPage = {
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
                    user: userProfile, // Assign the correctly typed user
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
        }
        catch (error) {
            console.error('Error saving wiki page:', error);
            // More specific error messages
            if (error.code === '23505') { // Unique violation
                toast.error('A page with this slug already exists');
            }
            else if (error.code === '42501') { // Permission denied
                toast.error('You do not have permission to perform this action');
            }
            else {
                toast.error(`Failed to save wiki page: ${(error instanceof Error ? error.message : String(error)) || 'Unknown error'}`);
            }
            throw error; // Re-throw to allow further error handling if needed
        }
        finally {
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
                if (error)
                    throw error;
                toast.success(`Page ${newStatus ? 'published' : 'unpublished'} successfully`);
            }
            catch (error) {
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
                    created_by: user.id,
                    is_active: true
                }
            ])
                .select()
                .single();
            if (error) {
                console.error('Error creating category:', error);
                throw new Error('Failed to create category');
            }
            if (data === null) { // Explicitly check for null
                console.error('No data returned after creating category, but no error was thrown.');
                toast.error('Failed to create category: No data received.');
                return;
            }
            const newCategory = data;
            // Add the new category to the list
            setCategories(prev => [...prev, newCategory]);
            // Select the new category
            handleSelectCategory(newCategory);
            setNewCategoryName('');
            setIsCreatingNewCategory(false);
            toast.success('Category created successfully');
        }
        catch (error) {
            console.error('Error creating category:', error);
            toast.error('Failed to create category');
        }
    };
    const renderCategorySelector = () => (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Category" }), selectedCategory ? (_jsxs("div", { className: "flex items-center justify-between p-2 border rounded-md", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Tag, { className: "h-4 w-4 mr-2 text-muted-foreground" }), _jsx("span", { children: selectedCategory.name })] }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: handleRemoveCategory, children: _jsx(X, { className: "h-4 w-4" }) })] })) : isCreatingNewCategory ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { placeholder: "Enter category name", value: newCategoryName, onChange: (e) => setNewCategoryName(e.target.value), autoFocus: true }), _jsx(Button, { type: "button", onClick: handleCreateCategory, disabled: !newCategoryName.trim(), children: "Add" })] }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setIsCreatingNewCategory(false), children: "Cancel" })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsxs(Button, { type: "button", variant: "outline", className: "w-full justify-start", onClick: () => setShowCategorySearch(true), children: [_jsx(Tag, { className: "h-4 w-4 mr-2" }), "Select a category"] }), _jsxs("div", { className: "text-center text-sm text-muted-foreground", children: ["or", ' ', _jsx("button", { type: "button", className: "text-primary hover:underline", onClick: () => setIsCreatingNewCategory(true), children: "create a new category" })] })] }))] }));
    const renderSectionContent = (section) => {
        const handleContentChange = (content) => {
            updateSection(section.id, { content });
        };
        const editorModules = {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
                return (_jsx("div", { className: "mt-4", children: _jsx(QuillEditor, { value: section.content || '', onChange: handleContentChange, placeholder: "Start writing..." }) }));
            case 'quote':
                return (_jsx("div", { className: "mt-4 border-l-4 border-gray-300 pl-4 italic", children: _jsx(QuillEditor, { value: section.content || '', onChange: handleContentChange, placeholder: "Start writing..." }) }));
            case 'code':
                return (_jsx("div", { className: "mt-4 bg-gray-100 p-4 rounded-md font-mono text-sm", children: _jsx(Textarea, { value: section.content || '', onChange: (e) => updateSection(section.id, { content: e.target.value }), placeholder: "Enter code...", rows: 6, className: "font-mono" }) }));
            case 'divider':
                return _jsx("div", { className: "my-6 border-t border-gray-200" });
            case 'image':
                return (_jsxs("div", { className: "mt-4", children: [_jsx(Input, { type: "text", value: section.content || '', onChange: (e) => updateSection(section.id, { content: e.target.value }), placeholder: "Enter image URL..." }), section.content && (_jsx("div", { className: "mt-2", children: _jsx("img", { src: section.content, alt: "Section content", className: "max-w-full h-auto rounded-md" }) }))] }));
            default:
                return (_jsxs("div", { className: "mt-4 text-gray-500 italic", children: ["Unsupported section type: ", section.type] }));
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    const filteredCategories = searchTerm
        ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : categories;
    return (_jsx("div", { className: "container mx-auto p-6", children: _jsxs("form", { onSubmit: (e) => e.preventDefault(), children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => navigate('/account/admin/wiki'), children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Wiki"] }), _jsx("h1", { className: "text-2xl font-bold", children: id ? 'Edit Wiki Page' : 'Create New Wiki Page' })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Label, { htmlFor: "is_published", children: "Publish" }), _jsx(Switch, { id: "is_published", checked: page.is_published ?? undefined, onCheckedChange: handlePublishToggle })] }), _jsx(Button, { type: "button", disabled: saving, onClick: handleSave, children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Saving..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "mr-2 h-4 w-4" }), "Save Changes"] })) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Page Content" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "Title *" }), _jsx(Input, { id: "title", name: "title", value: page.title, onChange: handleTitleChange, placeholder: "Enter page title", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Label, { htmlFor: "slug", children: "URL Slug *" }), _jsx("span", { className: "text-sm text-muted-foreground", children: `${window.location.origin}/wiki/${page.slug || 'your-page-slug'}` })] }), _jsx(Input, { id: "slug", name: "slug", value: page.slug, onChange: handleInputChange, placeholder: "page-slug", required: true })] }), renderCategorySelector(), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Sections" }), page.sections.map((section, index) => (_jsxs(Card, { className: "mb-4", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Input, { value: section.title, onChange: (e) => updateSection(section.id, { title: e.target.value }), placeholder: "Section Title", className: "text-xl font-bold" }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("select", { value: section.type, onChange: (e) => updateSection(section.id, { type: e.target.value }), className: "text-sm p-1 border rounded", children: [_jsx("option", { value: "paragraph", children: "Paragraph" }), _jsx("option", { value: "heading_1", children: "Heading 1" }), _jsx("option", { value: "heading_2", children: "Heading 2" }), _jsx("option", { value: "heading_3", children: "Heading 3" }), _jsx("option", { value: "bullet_list", children: "Bullet List" }), _jsx("option", { value: "ordered_list", children: "Ordered List" }), _jsx("option", { value: "image", children: "Image" }), _jsx("option", { value: "table", children: "Table" }), _jsx("option", { value: "quote", children: "Quote" }), _jsx("option", { value: "code", children: "Code" }), _jsx("option", { value: "divider", children: "Divider" })] }), _jsx(Button, { variant: "ghost", size: "icon", type: "button", onClick: () => removeSection(section.id), disabled: page.sections.length <= 1, children: _jsx(X, { className: "h-4 w-4" }) })] })] }) }), _jsx(CardContent, { children: renderSectionContent(section) })] }, section.id)))] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => addSection('paragraph'), children: "Add Paragraph" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => addSection('heading_1'), children: "Add Heading 1" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => addSection('quote'), children: "Add Quote" })] })] })] }) }), _jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Publishing" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: "Status" }), _jsx("p", { className: "text-sm text-muted-foreground", children: page.is_published ? 'Published' : 'Draft' })] }), _jsx(Switch, { checked: page.is_published ?? undefined, onCheckedChange: handlePublishToggle })] }), id && (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "URL" }), _jsx("div", { className: "flex items-center", children: _jsxs("a", { href: `/wiki/${page.slug}`, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-blue-600 hover:underline flex items-center", children: ["View page ", _jsx(Eye, { className: "ml-1 h-3 w-3" })] }) })] }))] })] }) })] })] }) }));
}
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
            if (error)
                throw error;
            toast.success(`Page ${newStatus ? 'published' : 'unpublished'} successfully`);
        }
        catch (error) {
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
                created_by: user.id,
                is_active: true
            }
        ])
            .select()
            .single();
        if (error) {
            console.error('Error creating category:', error);
            throw new Error('Failed to create category');
        }
        if (data === null) { // Explicitly check for null
            console.error('No data returned after creating category, but no error was thrown.');
            toast.error('Failed to create category: No data received.');
            return;
        }
        const newCategory = data;
        // Add the new category to the list
        setCategories(prev => [...prev, newCategory]);
        // Select the new category
        handleSelectCategory(newCategory);
        setNewCategoryName('');
        setIsCreatingNewCategory(false);
        toast.success('Category created successfully');
    }
    catch (error) {
        console.error('Error creating category:', error);
        toast.error('Failed to create category');
    }
};
const renderCategorySelector = () => (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Category" }), selectedCategory ? (_jsxs("div", { className: "flex items-center justify-between p-2 border rounded-md", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Tag, { className: "h-4 w-4 mr-2 text-muted-foreground" }), _jsx("span", { children: selectedCategory.name })] }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: handleRemoveCategory, children: _jsx(X, { className: "h-4 w-4" }) })] })) : isCreatingNewCategory ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { placeholder: "Enter category name", value: newCategoryName, onChange: (e) => setNewCategoryName(e.target.value), autoFocus: true }), _jsx(Button, { type: "button", onClick: handleCreateCategory, disabled: !newCategoryName.trim(), children: "Add" })] }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setIsCreatingNewCategory(false), children: "Cancel" })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsxs(Button, { type: "button", variant: "outline", className: "w-full justify-start", onClick: () => setShowCategorySearch(true), children: [_jsx(Tag, { className: "h-4 w-4 mr-2" }), "Select a category"] }), _jsxs("div", { className: "text-center text-sm text-muted-foreground", children: ["or", ' ', _jsx("button", { type: "button", className: "text-primary hover:underline", onClick: () => setIsCreatingNewCategory(true), children: "create a new category" })] })] }))] }));
const renderSectionContent = (section) => {
    const handleContentChange = (content) => {
        updateSection(section.id, { content });
    };
    const editorModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
            return (_jsx("div", { className: "mt-4", children: _jsx(QuillEditor, { value: section.content || '', onChange: handleContentChange, placeholder: "Start writing..." }) }));
        case 'quote':
            return (_jsx("div", { className: "mt-4 border-l-4 border-gray-300 pl-4 italic", children: _jsx(QuillEditor, { value: section.content || '', onChange: handleContentChange, placeholder: "Start writing..." }) }));
        case 'code':
            return (_jsx("div", { className: "mt-4 bg-gray-100 p-4 rounded-md font-mono text-sm", children: _jsx(Textarea, { value: section.content || '', onChange: (e) => updateSection(section.id, { content: e.target.value }), placeholder: "Enter code...", rows: 6, className: "font-mono" }) }));
        case 'divider':
            return _jsx("div", { className: "my-6 border-t border-gray-200" });
        case 'image':
            return (_jsxs("div", { className: "mt-4", children: [_jsx(Input, { type: "text", value: section.content || '', onChange: (e) => updateSection(section.id, { content: e.target.value }), placeholder: "Enter image URL..." }), section.content && (_jsx("div", { className: "mt-2", children: _jsx("img", { src: section.content, alt: "Section content", className: "max-w-full h-auto rounded-md" }) }))] }));
        default:
            return (_jsxs("div", { className: "mt-4 text-gray-500 italic", children: ["Unsupported section type: ", section.type] }));
    }
};
if (loading) {
    return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
}
const filteredCategories = searchTerm
    ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : categories;
return (_jsx("div", { className: "container mx-auto p-6", children: _jsxs("form", { onSubmit: (e) => e.preventDefault(), children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => navigate('/account/admin/wiki'), children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Wiki"] }), _jsx("h1", { className: "text-2xl font-bold", children: id ? 'Edit Wiki Page' : 'Create New Wiki Page' })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Label, { htmlFor: "is_published", children: "Publish" }), _jsx(Switch, { id: "is_published", checked: page.is_published, onCheckedChange: handlePublishToggle })] }), _jsx(Button, { type: "button", disabled: saving, onClick: handleSave, children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Saving..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "mr-2 h-4 w-4" }), "Save Changes"] })) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Page Content" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "Title *" }), _jsx(Input, { id: "title", name: "title", value: page.title, onChange: handleTitleChange, placeholder: "Enter page title", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Label, { htmlFor: "slug", children: "URL Slug *" }), _jsx("span", { className: "text-sm text-muted-foreground", children: `${window.location.origin}/wiki/${page.slug || 'your-page-slug'}` })] }), _jsx(Input, { id: "slug", name: "slug", value: page.slug, onChange: handleInputChange, placeholder: "page-slug", required: true })] }), renderCategorySelector(), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Sections" }), page.sections.map((section, index) => (_jsxs(Card, { className: "mb-4", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Input, { value: section.title, onChange: (e) => updateSection(section.id, { title: e.target.value }), placeholder: "Section Title", className: "text-xl font-bold" }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("select", { value: section.type, onChange: (e) => updateSection(section.id, { type: e.target.value }), className: "text-sm p-1 border rounded", children: [_jsx("option", { value: "paragraph", children: "Paragraph" }), _jsx("option", { value: "heading_1", children: "Heading 1" }), _jsx("option", { value: "heading_2", children: "Heading 2" }), _jsx("option", { value: "heading_3", children: "Heading 3" }), _jsx("option", { value: "bullet_list", children: "Bullet List" }), _jsx("option", { value: "ordered_list", children: "Ordered List" }), _jsx("option", { value: "image", children: "Image" }), _jsx("option", { value: "table", children: "Table" }), _jsx("option", { value: "quote", children: "Quote" }), _jsx("option", { value: "code", children: "Code" }), _jsx("option", { value: "divider", children: "Divider" })] }), _jsx(Button, { variant: "ghost", size: "icon", type: "button", onClick: () => removeSection(section.id), disabled: page.sections.length <= 1, children: _jsx(X, { className: "h-4 w-4" }) })] })] }) }), _jsx(CardContent, { children: renderSectionContent(section) })] }, section.id)))] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => addSection('paragraph'), children: "Add Paragraph" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => addSection('heading_1'), children: "Add Heading 1" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => addSection('quote'), children: "Add Quote" })] })] })] }) }), _jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Publishing" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: "Status" }), _jsx("p", { className: "text-sm text-muted-foreground", children: page.is_published ? 'Published' : 'Draft' })] }), _jsx(Switch, { checked: page.is_published, onCheckedChange: handlePublishToggle })] }), id && (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "URL" }), _jsx("div", { className: "flex items-center", children: _jsxs("a", { href: `/wiki/${page.slug}`, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-blue-600 hover:underline flex items-center", children: ["View page ", _jsx(Eye, { className: "ml-1 h-3 w-3" })] }) })] }))] })] }) })] })] }) }));
//# sourceMappingURL=WikiEditor.js.map