import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import toast from 'react-hot-toast'; // Import toast
import { Plus, Edit3, Trash2, Eye, Search, Save, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
// --- Supabase Data Functions ---
const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*');
    if (error)
        throw new Error(error.message);
    return data;
};
const createPost = async (newPost) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError)
        throw new Error(userError.message);
    if (!user)
        throw new Error('User not authenticated.');
    console.log('Attempting to create post with data:', { ...newPost, author_id: user.id });
    const { data, error } = await supabase.from('posts').insert({ ...newPost, author_id: user.id }).select(); // Add .select() here
    if (error)
        throw new Error(error.message);
    if (!data || data.length === 0)
        throw new Error('Failed to create post: No data returned.');
    return data[0];
};
const updatePost = async (updatedPost) => {
    const { data, error } = await supabase.from('posts').update(updatedPost).eq('id', updatedPost.id).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const deletePost = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error)
        throw new Error(error.message);
};
// --- Post Editor Component ---
export const PostEditor = ({ post, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: post?.title || '',
        content: post?.content || '',
        status: post?.status || 'draft',
        slug: post?.slug || ''
    });
    const handleSubmit = () => {
        if (!formData.title.trim()) {
            toast.error('Title cannot be empty.');
            return;
        }
        if (!formData.slug.trim()) {
            toast.error('Slug cannot be empty.');
            return;
        }
        const dataToSave = post ? { ...post, ...formData } : formData;
        onSave(dataToSave);
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: post ? 'Edit Post' : 'Create New Post' }), _jsx("button", { onClick: onCancel, className: "p-2 text-gray-500 hover:text-gray-700", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Title" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter post title...", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Slug" }), _jsx("input", { type: "text", value: formData.slug, onChange: (e) => setFormData({ ...formData, slug: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "post-url-slug" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Content" }), _jsx(ReactQuill, { theme: "snow", value: formData.content, onChange: (value) => setFormData({ ...formData, content: value }), className: "h-64 mb-12" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsxs("button", { type: "button", onClick: handleSubmit, className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors", children: [_jsx(Save, { className: "w-4 h-4" }), "Save Post"] }), _jsx("button", { type: "button", onClick: onCancel, className: "flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors", children: "Cancel" })] })] })] }));
};
// --- Posts Management Component ---
export const PostsManager = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const { data: posts, isLoading, isError, error } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
    const createMutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setIsEditing(false);
            setEditingPost(null);
        },
    });
    const updateMutation = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setIsEditing(false);
            setEditingPost(null);
        },
    });
    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
    const handleSavePost = (postData) => {
        if (editingPost) {
            // If editing an existing post, ensure ID is present
            updateMutation.mutate(postData);
        }
        else {
            // If creating a new post, omit the ID as Supabase will generate it
            const { ...newPostData } = postData;
            createMutation.mutate(newPostData);
        }
    };
    const handleDeletePost = (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deleteMutation.mutate(id);
        }
    };
    const filteredPosts = posts?.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
        return matchesSearch && matchesFilter;
    }) || [];
    if (isLoading)
        return _jsx("div", { children: "Loading posts..." });
    if (isError)
        return _jsxs("div", { children: ["Error loading posts: ", error?.message] });
    return (_jsx("div", { className: "space-y-6", children: isEditing ? (_jsx(PostEditor, { post: editingPost, onSave: handleSavePost, onCancel: () => {
                setIsEditing(false);
                setEditingPost(null);
            } })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Posts" }), _jsxs("button", { onClick: () => {
                                setEditingPost(null);
                                setIsEditing(true);
                            }, className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Post"] })] }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search posts...", className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }) }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "archived", children: "Archived" })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Title" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Status" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Author" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Date" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Views" }), _jsx("th", { className: "text-right py-3 px-6 text-sm font-medium text-gray-900", children: "Actions" })] }) }), _jsx("tbody", { children: filteredPosts.map((post) => (_jsxs("tr", { className: "border-b border-gray-200 hover:bg-gray-50", children: [_jsx("td", { className: "py-4 px-6", children: _jsx("div", { className: "font-medium text-gray-900", children: post.title }) }), _jsx("td", { className: "py-4 px-6", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : post.status === 'draft'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'}`, children: post.status }) }), _jsx("td", { className: "py-4 px-6 text-sm text-gray-500", children: post.author_id }), _jsx("td", { className: "py-4 px-6 text-sm text-gray-500", children: new Date(post.created_at).toLocaleDateString() }), _jsx("td", { className: "py-4 px-6 text-sm text-gray-500", children: post.views }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => {
                                                            setEditingPost(post);
                                                            setIsEditing(true);
                                                        }, className: "p-1 text-gray-500 hover:text-blue-600", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { className: "p-1 text-gray-500 hover:text-green-600", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeletePost(post.id), className: "p-1 text-gray-500 hover:text-red-600", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, post.id))) })] }) })] })) }));
};
//# sourceMappingURL=PostsManager.js.map