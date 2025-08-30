import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { ContentEditor } from './ContentEditor';
import { ContentTable } from './ContentTable';
// --- Supabase Data Functions ---
const fetchPages = async () => {
    const { data, error } = await supabase.from('pages').select('*');
    if (error)
        throw new Error(error.message);
    return data;
};
const createPage = async (newPage) => {
    const { data, error } = await supabase.from('pages').insert(newPage).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const updatePage = async (updatedPage) => {
    const { data, error } = await supabase.from('pages').update(updatedPage).eq('id', updatedPage.id).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const deletePage = async (id) => {
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error)
        throw new Error(error.message);
};
// --- Pages Manager Component ---
export const PagesManager = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const { data: pages, isLoading, isError, error } = useQuery({ queryKey: ['pages'], queryFn: fetchPages });
    const createMutation = useMutation({
        mutationFn: createPage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            setIsEditing(false);
            setEditingPage(null);
        },
    });
    const updateMutation = useMutation({
        mutationFn: updatePage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            setIsEditing(false);
            setEditingPage(null);
        },
    });
    const deleteMutation = useMutation({
        mutationFn: deletePage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
        },
    });
    const handleSavePage = (pageData) => {
        if (editingPage) {
            updateMutation.mutate(pageData);
        }
        else {
            createMutation.mutate(pageData);
        }
    };
    const handleDeletePage = (id) => {
        if (window.confirm('Are you sure you want to delete this page?')) {
            deleteMutation.mutate(id);
        }
    };
    const columns = [
        { key: 'title', label: 'Page Title' },
        { key: 'slug', label: 'URL Slug' },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800' // Handle 'archived' or other statuses
                }`, children: item.status }))
        },
        { key: 'created_at', label: 'Created At', render: (item) => new Date(item.created_at ?? '').toLocaleDateString() },
        { key: 'updated_at', label: 'Last Updated', render: (item) => new Date(item.updated_at ?? '').toLocaleDateString() },
    ];
    if (isLoading)
        return _jsx("div", { children: "Loading pages..." });
    if (isError)
        return _jsxs("div", { children: ["Error loading pages: ", error?.message] });
    return (_jsx("div", { className: "space-y-6", children: isEditing ? (_jsx(ContentEditor, { item: editingPage, contentType: "pages", onSave: handleSavePage, onCancel: () => {
                setIsEditing(false);
                setEditingPage(null);
            } })) : (_jsx(ContentTable, { contentType: "pages", items: pages || [], title: "Website Pages", columns: columns, createActionLabel: "New Page", onEdit: (item) => {
                setEditingPage(item ?? undefined);
                setIsEditing(true);
            }, onDelete: handleDeletePage, onCreateNew: () => {
                setEditingPage(null);
                setIsEditing(true);
            } })) }));
};
//# sourceMappingURL=PagesManager.js.map