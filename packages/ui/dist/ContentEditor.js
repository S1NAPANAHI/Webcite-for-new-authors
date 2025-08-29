import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
// Helper function to generate a URL-friendly slug from a string
const generateSlug = (str) => {
    if (!str)
        return '';
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
export function ContentEditor({ item, contentType, onSave, onCancel }) {
    // State for form data and validation errors
    const [formData, setFormData] = useState(getInitialFormData());
    const [errors, setErrors] = useState({});
    // Initialize form data based on content type
    function getInitialFormData() {
        if (item) {
            // If we have an existing item, use its values
            const { id, created_at, updated_at, created_by, ...rest } = item;
            return rest;
        }
        // Create a type-safe default form data object based on content type
        const defaultData = (() => {
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
                    };
                case 'storeItems':
                    return {
                        status: 'active',
                        name: '',
                        description: '',
                        price: 0,
                        category: 'digital',
                        image_url: undefined,
                        stock_quantity: 0,
                        sku: undefined,
                    };
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
                    };
                case 'characters':
                    return {
                        status: 'draft',
                        name: '',
                        description: '',
                        role: '',
                        backstory: '',
                        image_url: '',
                        birth_date: undefined,
                        death_date: undefined,
                        species: undefined,
                        occupation: undefined,
                        relationships: undefined,
                    };
                case 'timelineEvents':
                    return {
                        status: 'draft',
                        title: '',
                        date: '',
                        era: 'ancient',
                        description: '',
                        is_published: false,
                        details: null,
                        background_image: null,
                        nested_events: [],
                    };
                case 'betaUsers':
                    return {
                        status: 'pending',
                        name: '',
                        email: '',
                        message: ''
                    };
                default:
                    throw new Error(`Unsupported content type: ${contentType}`);
            }
        })();
        return defaultData;
    }
    const handleSubmit = useCallback(() => {
        const dataToSave = item ? { ...item, ...formData } : formData;
        onSave(dataToSave);
    }, [formData, item, onSave]);
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };
    const handleTitleChange = (e) => {
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
        onError(error) {
            console.error(error);
        },
    };
    // Type-safe field handlers
    const handleTextChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    const handleNumberChange = useCallback((field) => (e) => {
        const value = parseFloat(e.target.value);
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    const handleSelectChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    const renderFields = () => {
        switch (contentType) {
            case 'posts':
            case 'pages':
                const postPageFormData = formData; // Cast to a union of Post | Page
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Title" }), _jsx("input", { type: "text", value: postPageFormData.title, onChange: handleTextChange('title'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter title...", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Slug" }), _jsx("input", { type: "text", value: postPageFormData.slug, onChange: (e) => setFormData(prev => ({ ...prev, slug: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "my-awesome-post" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "URL-friendly version of the title. e.g., 'my-awesome-post'" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Content" }), _jsx("div", { className: "editor-container", children: _jsxs(LexicalComposer, { initialConfig: initialConfig, children: [_jsx(RichTextPlugin, { contentEditable: _jsx(ContentEditable, { className: "editor-input" }), placeholder: _jsx("div", { className: "editor-placeholder", children: "Enter your content..." }), ErrorBoundary: LexicalErrorBoundary }), _jsx(HistoryPlugin, {}), _jsx(AutoFocusPlugin, {})] }) })] })] }));
            case 'storeItems':
                const storeItemFormData = formData; // Cast to StoreItem
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Product Name" }), _jsx("input", { type: "text", value: storeItemFormData.name, onChange: handleTextChange('name'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Product name..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Price" }), _jsx("input", { type: "number", step: "0.01", value: storeItemFormData.price, onChange: handleNumberChange('price'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "0.00" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category" }), _jsxs("select", { value: storeItemFormData.category, onChange: handleSelectChange('category'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "digital", children: "Digital" }), _jsx("option", { value: "physical", children: "Physical" }), _jsx("option", { value: "subscription", children: "Subscription" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: storeItemFormData.description, onChange: handleTextChange('description'), rows: 6, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Product description..." })] })] }));
            case 'libraryItems':
                const libraryItemFormData = formData; // Cast to LibraryItem
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Title" }), _jsx("input", { type: "text", value: libraryItemFormData.title, onChange: handleTextChange('title'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Resource title..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category" }), _jsxs("select", { value: libraryItemFormData.category, onChange: handleSelectChange('category'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "tutorial", children: "Tutorial" }), _jsx("option", { value: "resources", children: "Resources" }), _jsx("option", { value: "template", children: "Template" }), _jsx("option", { value: "guide", children: "Guide" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "File URL" }), _jsx("input", { type: "url", value: libraryItemFormData.file_url, onChange: handleTextChange('file_url'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "https://..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: libraryItemFormData.description, onChange: handleTextChange('description'), rows: 6, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Resource description..." })] })] }));
            case 'characters':
                const characterFormData = formData; // Cast to Character
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Character Name" }), _jsx("input", { type: "text", value: characterFormData.name, onChange: handleTextChange('name'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Character name..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Role" }), _jsxs("select", { value: characterFormData.role, onChange: handleSelectChange('role'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "protagonist", children: "Protagonist" }), _jsx("option", { value: "antagonist", children: "Antagonist" }), _jsx("option", { value: "mentor", children: "Mentor" }), _jsx("option", { value: "ally", children: "Ally" }), _jsx("option", { value: "neutral", children: "Neutral" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: characterFormData.description, onChange: handleTextChange('description'), rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Character description..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Backstory" }), _jsx("textarea", { value: characterFormData.backstory, onChange: handleTextChange('backstory'), rows: 6, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Character backstory..." })] })] }));
            case 'timelineEvents':
                const timelineEventFormData = formData; // Cast to TimelineEvent
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Event Title" }), _jsx("input", { type: "text", value: timelineEventFormData.title, onChange: handleTextChange('title'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Event title..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date" }), _jsx("input", { type: "date", value: timelineEventFormData.date, onChange: handleTextChange('date'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Era" }), _jsxs("select", { value: timelineEventFormData.era, onChange: handleSelectChange('era'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "ancient", children: "Ancient" }), _jsx("option", { value: "medieval", children: "Medieval" }), _jsx("option", { value: "modern", children: "Modern" }), _jsx("option", { value: "future", children: "Future" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: timelineEventFormData.description, onChange: handleTextChange('description'), rows: 6, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Event description..." })] })] }));
            case 'betaUsers':
                const betaUserFormData = formData; // Cast to BetaUser
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Name" }), _jsx("input", { type: "text", value: betaUserFormData.name, onChange: handleTextChange('name'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "User name..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { type: "email", value: betaUserFormData.email, onChange: handleTextChange('email'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "user@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Message" }), _jsx("textarea", { value: betaUserFormData.message, onChange: handleTextChange('message'), rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "User message/notes..." })] })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: item ? `Edit ${contentType}` : `Create New ${contentType}` }), _jsx("button", { onClick: onCancel, className: "p-2 text-gray-500 hover:text-gray-700", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-6", children: [renderFields(), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [contentType === 'posts' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] })), contentType === 'pages' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })), contentType === 'storeItems' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" })] })), contentType === 'libraryItems' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })), contentType === 'characters' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })), contentType === 'timelineEvents' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })), contentType === 'betaUsers' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" })] }))] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsxs("button", { type: "button", onClick: handleSubmit, className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors", children: [_jsx(Save, { className: "w-4 h-4" }), "Save"] }), _jsx("button", { type: "button", onClick: onCancel, className: "flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors", children: "Cancel" })] })] })] }));
}
;
