import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';
import { Plus, Edit3, Trash2, Search } from 'lucide-react';
// --- Supabase Data Functions ---
const fetchWorks = async () => {
    const { data, error } = await supabase.from('works').select('*').order('created_at', { ascending: true });
    if (error)
        throw new Error(error.message);
    return data;
};
const createWork = async (newWork) => {
    const { data, error } = await supabase.from('works').insert(newWork).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const updateWork = async (updatedWork) => {
    const { id, ...updates } = updatedWork; // Exclude id from update payload
    const { data, error } = await supabase.from('works').update(updates).eq('id', id).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const deleteWork = async (id) => {
    const { error } = await supabase.from('works').delete().eq('id', id);
    if (error)
        throw new Error(error.message);
};
// --- Work Editor Component ---
export const WorkEditor = ({ work, onSave, onCancel, allWorks }) => {
    const [formData, setFormData] = useState({
        title: work?.title || '',
        type: work?.type || 'book',
        parent_id: work?.parent_id || '',
        order_in_parent: work?.order_in_parent || '',
        description: work?.description || '',
        status: work?.status || 'planning',
        progress_percentage: work?.progress_percentage || 0,
        release_date: work?.release_date || '',
        estimated_release: work?.estimated_release || '',
        cover_image_url: work?.cover_image_url || '',
        sample_content: work?.sample_content || '',
        is_purchasable: work?.is_purchasable ?? true,
        is_featured: work?.is_featured ?? false,
        word_count: work?.word_count || '',
        target_word_count: work?.target_word_count || '',
    });
    const handleSubmit = () => {
        onSave({
            ...work,
            ...formData,
            parent_id: formData.parent_id === '' ? null : formData.parent_id, // Convert empty string to null for UUID
            order_in_parent: formData.order_in_parent ? Number(formData.order_in_parent) : undefined,
            progress_percentage: formData.progress_percentage ? Number(formData.progress_percentage) : undefined,
            word_count: formData.word_count ? Number(formData.word_count) : undefined,
            target_word_count: formData.target_word_count ? Number(formData.target_word_count) : undefined,
            id: work?.id // Ensure ID is passed for updates
        });
    };
    const parentWorks = allWorks.filter(w => w.id !== work?.id); // Exclude self from parent options
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6 mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: work ? 'Edit Work' : 'Create New Work' }), _jsxs("form", { onSubmit: (e) => { e.preventDefault(); handleSubmit(); }, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Title" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Type" }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "book", children: "Book" }), _jsx("option", { value: "volume", children: "Volume" }), _jsx("option", { value: "saga", children: "Saga" }), _jsx("option", { value: "arc", children: "Arc" }), _jsx("option", { value: "issue", children: "Issue" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Parent Work (for nesting)" }), _jsxs("select", { value: formData.parent_id, onChange: (e) => setFormData({ ...formData, parent_id: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "None" }), parentWorks.map(w => (_jsxs("option", { value: w.id, children: [w.title, " (", w.type, ")"] }, w.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Order in Parent" }), _jsx("input", { type: "number", value: formData.order_in_parent, onChange: (e) => setFormData({ ...formData, order_in_parent: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "planning", children: "Planning" }), _jsx("option", { value: "writing", children: "Writing" }), _jsx("option", { value: "editing", children: "Editing" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "on_hold", children: "On Hold" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Progress Percentage (0-100)" }), _jsx("input", { type: "number", value: formData.progress_percentage, onChange: (e) => setFormData({ ...formData, progress_percentage: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", max: "100" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Release Date" }), _jsx("input", { type: "date", value: formData.release_date, onChange: (e) => setFormData({ ...formData, release_date: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Estimated Release (e.g., Q2 2024)" }), _jsx("input", { type: "text", value: formData.estimated_release, onChange: (e) => setFormData({ ...formData, estimated_release: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cover Image URL" }), _jsx("input", { type: "url", value: formData.cover_image_url, onChange: (e) => setFormData({ ...formData, cover_image_url: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Sample Content" }), _jsx("textarea", { value: formData.sample_content, onChange: (e) => setFormData({ ...formData, sample_content: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-48" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Word Count" }), _jsx("input", { type: "number", value: formData.word_count, onChange: (e) => setFormData({ ...formData, word_count: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Target Word Count" }), _jsx("input", { type: "number", value: formData.target_word_count, onChange: (e) => setFormData({ ...formData, target_word_count: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "mb-4 flex items-center", children: [_jsx("input", { type: "checkbox", id: "isPurchasable", checked: formData.is_purchasable, onChange: (e) => setFormData({ ...formData, is_purchasable: e.target.checked }), className: "mr-2" }), _jsx("label", { htmlFor: "isPurchasable", className: "text-sm font-medium text-gray-700", children: "Is Purchasable" })] }), _jsxs("div", { className: "mb-4 flex items-center", children: [_jsx("input", { type: "checkbox", id: "isFeatured", checked: formData.is_featured, onChange: (e) => setFormData({ ...formData, is_featured: e.target.checked }), className: "mr-2" }), _jsx("label", { htmlFor: "isFeatured", className: "text-sm font-medium text-gray-700", children: "Is Featured" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", className: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors", children: "Save Work" }), _jsx("button", { type: "button", onClick: onCancel, className: "bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors", children: "Cancel" })] })] })] }));
};
// --- Works Management Component ---
export const WorksManager = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editingWork, setEditingWork] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const { data: allWorks, isLoading, isError, error } = useQuery({ queryKey: ['works'], queryFn: fetchWorks });
    const createMutation = useMutation({
        mutationFn: createWork,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['works'] });
            setIsEditing(false);
            setEditingWork(null);
        },
        onError: (err) => {
            alert(`Error creating work: ${err.message}`);
        }
    });
    const updateMutation = useMutation({
        mutationFn: updateWork,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['works'] });
            setIsEditing(false);
            setEditingWork(null);
        },
        onError: (err) => {
            alert(`Error updating work: ${err.message}`);
        }
    });
    const deleteMutation = useMutation({
        mutationFn: deleteWork,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['works'] });
        },
    });
    const handleSaveWork = (workData) => {
        if (editingWork) {
            updateMutation.mutate(workData);
        }
        else {
            createMutation.mutate(workData);
        }
    };
    const handleDeleteWork = (id) => {
        if (window.confirm('Are you sure you want to delete this work?')) {
            deleteMutation.mutate(id);
        }
    };
    const filteredWorks = allWorks?.filter(work => {
        const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || work.type === filterType;
        const matchesStatus = filterStatus === 'all' || work.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    }) || [];
    if (isLoading)
        return _jsx("div", { children: "Loading works..." });
    if (isError)
        return _jsxs("div", { children: ["Error loading works: ", error?.message] });
    return (_jsx("div", { className: "space-y-6", children: isEditing ? (_jsx(WorkEditor, { work: editingWork, onSave: handleSaveWork, onCancel: () => {
                setIsEditing(false);
                setEditingWork(null);
            }, allWorks: allWorks || [] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Works Management" }), _jsxs("button", { onClick: () => {
                                setEditingWork(null);
                                setIsEditing(true);
                            }, className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Work"] })] }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border mb-6", children: _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search works...", className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: "book", children: "Book" }), _jsx("option", { value: "volume", children: "Volume" }), _jsx("option", { value: "saga", children: "Saga" }), _jsx("option", { value: "arc", children: "Arc" }), _jsx("option", { value: "issue", children: "Issue" })] }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "planning", children: "Planning" }), _jsx("option", { value: "writing", children: "Writing" }), _jsx("option", { value: "editing", children: "Editing" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "on_hold", children: "On Hold" })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Title" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Type" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Status" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Parent" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Release Date" }), _jsx("th", { className: "text-right py-3 px-6 text-sm font-medium text-gray-900", children: "Actions" })] }) }), _jsx("tbody", { children: filteredWorks.map((work) => (_jsxs("tr", { className: "border-b border-gray-200 hover:bg-gray-50", children: [_jsx("td", { className: "py-4 px-6", children: _jsx("div", { className: "font-medium text-gray-900", children: work.title }) }), _jsx("td", { className: "py-4 px-6 text-sm text-gray-500", children: work.type }), _jsx("td", { className: "py-4 px-6", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${work.status === 'published' ? 'bg-green-100 text-green-800' :
                                                    work.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                                                        work.status === 'writing' ? 'bg-yellow-100 text-yellow-800' :
                                                            work.status === 'editing' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'}`, children: work.status }) }), _jsx("td", { className: "py-4 px-6 text-sm text-gray-500", children: allWorks?.find(w => w.id === work.parent_id)?.title || 'N/A' }), _jsx("td", { className: "py-4 px-6 text-sm text-gray-500", children: work.release_date || work.estimated_release || 'N/A' }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => {
                                                            setEditingWork(work);
                                                            setIsEditing(true);
                                                        }, className: "p-1 text-gray-500 hover:text-blue-600", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteWork(work.id), className: "p-1 text-gray-500 hover:text-red-600", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, work.id))) })] }) })] })) }));
};
