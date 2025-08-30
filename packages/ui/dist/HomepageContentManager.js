import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { useToast } from './use-toast';
const toastInstance = useToast();
// --- Supabase Data Functions ---
const fetchHomepageContent = async () => {
    const { data, error } = await supabase.from('homepage_content').select('*');
    if (error)
        throw new Error(error.message);
    return data;
};
const updateHomepageContent = async (item) => {
    const { id, ...updates } = item; // Exclude id from the update payload
    const { data, error } = await supabase.from('homepage_content').update(updates).eq('id', id).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const createHomepageContent = async (item) => {
    const { data, error } = await supabase.from('homepage_content').insert(item).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
// --- News Items Supabase Functions ---
const fetchNewsItems = async () => {
    const { data, error } = await supabase.from('news_items').select('*').order('date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
};
const createNewsItem = async (item) => {
    const { data, error } = await supabase.from('news_items').insert(item).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const updateNewsItem = async (item) => {
    const { data, error } = await supabase.from('news_items').update(item).eq('id', item.id).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const deleteNewsItem = async (id) => {
    const { error } = await supabase.from('news_items').delete().eq('id', id);
    if (error)
        throw new Error(error.message);
};
// --- Release Items Supabase Functions ---
const fetchReleaseItems = async () => {
    const { data, error } = await supabase.from('release_items').select('*').order('release_date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
};
const createReleaseItem = async (item) => {
    const { data, error } = await supabase.from('release_items').insert(item).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const updateReleaseItem = async (item) => {
    const { data, error } = await supabase.from('release_items').update(item).eq('id', item.id).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const deleteReleaseItem = async (id) => {
    const { error } = await supabase.from('release_items').delete().eq('id', id);
    if (error)
        throw new Error(error.message);
};
export const HomepageContentManager = () => {
    const queryClient = useQueryClient();
    const { data: homepageItems, isLoading, isError, error } = useQuery({ queryKey: ['homepageContent'], queryFn: fetchHomepageContent });
    const { data: newsItems, isLoading: isLoadingNews, isError: isErrorNews, error: errorNews } = useQuery({ queryKey: ['newsItems'], queryFn: fetchNewsItems });
    const { data: releaseItems, isLoading: isLoadingReleases, isError: isErrorReleases, error: errorReleases } = useQuery({ queryKey: ['releaseItems'], queryFn: fetchReleaseItems });
    const updateHomepageMutation = useMutation({
        mutationFn: updateHomepageContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepageContent'] });
            toastInstance.toast({ title: 'Content updated successfully!', variant: 'default' });
        },
        onError: (err) => {
            toastInstance.toast({ title: `Error updating content: ${err.message}`, variant: 'destructive' });
        }
    });
    const createHomepageMutation = useMutation({
        mutationFn: createHomepageContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepageContent'] });
            toastInstance.toast({ title: 'Content created successfully!', variant: 'default' });
        },
        onError: (err) => {
            toastInstance.toast({ title: `Error creating content: ${err.message}`, variant: 'destructive' });
        }
    });
    const createNewsMutation = useMutation({
        mutationFn: createNewsItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsItems'] });
            toastInstance.toast({ title: 'News item added successfully!', variant: 'default' });
            closeNewsModal();
        },
        onError: (err) => {
            toastInstance.toast({ title: `Error adding news item: ${err.message}`, variant: 'destructive' });
        }
    });
    const updateNewsMutation = useMutation({
        mutationFn: updateNewsItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsItems'] });
            toastInstance.toast({ title: 'News item updated successfully!', variant: 'default' });
            closeNewsModal();
        },
        onError: (err) => {
            toastInstance.toast({ title: `Error updating news item: ${err.message}`, variant: 'destructive' });
        }
    });
    const deleteNewsMutation = useMutation({
        mutationFn: deleteNewsItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['newsItems'] });
            toastInstance.toast({ title: 'News item deleted successfully!', variant: 'default' });
        },
        onError: (err) => {
            toastInstance.toast({ title: `Error deleting news item: ${err.message}`, variant: 'destructive' });
        }
    });
    const createReleaseMutation = useMutation({
        mutationFn: createReleaseItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
            toastInstance.toast({ title: 'Release item added successfully!', variant: 'default' });
            closeReleaseModal();
        },
        onError: (err) => {
            toastInstance.toast({ title: `Error adding release item: ${err.message}`, variant: 'destructive' });
        }
    });
    const updateReleaseMutation = useMutation({
        mutationFn: updateReleaseItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
            toastInstance.toast({ title: 'Release item updated successfully!', variant: 'default' });
            closeReleaseModal();
        },
        onError: (err) => {
            toastInstance.toast({ title: `Error updating release item: ${err.message}`, variant: 'destructive' });
        }
    });
    const deleteReleaseMutation = useMutation({
        mutationFn: deleteReleaseItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
            toastInstance.toast({ title: 'Release item deleted successfully!', variant: 'default' });
        },
        onError: (err) => {
            toastInstance.toast({ title: `Error deleting release item: ${err.message}`, variant: 'destructive' });
        }
    });
    // State for modals
    const [showNewsModal, setShowNewsModal] = useState(false);
    const [editingNewsItem, setEditingNewsItem] = useState(null);
    const [showReleaseModal, setShowReleaseModal] = useState(false);
    const [editingReleaseItem, setEditingReleaseItem] = useState(null);
    // Helper to get a specific item by section name
    const getItemBySection = (sectionName) => {
        return homepageItems?.find(item => item.section === sectionName);
    };
    // --- Hero Section Handlers ---
    const handleHeroSave = async (e) => {
        e.preventDefault();
        const form = e.target;
        const heroTitle = form.heroTitle.value;
        const heroDescription = form.heroDescription.value;
        const heroButtonText = form.heroButtonText.value;
        const heroButtonLink = form.heroButtonLink.value;
        const itemsToUpdate = [
            { section: 'hero_title', content: heroTitle },
            { section: 'hero_description', content: heroDescription },
            { section: 'hero_button_text', content: heroButtonText },
            { section: 'hero_button_link', content: heroButtonLink },
        ];
        for (const item of itemsToUpdate) {
            const existingItem = getItemBySection(item.section);
            if (existingItem) {
                updateHomepageMutation.mutate({ ...existingItem, content: item.content });
            }
            else {
                createHomepageMutation.mutate(item);
            }
        }
    };
    // --- Statistics Section Handlers ---
    const handleStatsSave = async (e) => {
        e.preventDefault();
        const form = e.target;
        const wordsWritten = form.wordsWritten.value;
        const betaReaders = form.betaReaders.value;
        const averageRating = form.averageRating.value;
        const booksPublished = form.booksPublished.value;
        const itemsToUpdate = [
            { section: 'stat_words_written', content: wordsWritten },
            { section: 'stat_beta_readers', content: betaReaders },
            { section: 'stat_average_rating', content: averageRating },
            { section: 'stat_books_published', content: booksPublished },
        ];
        for (const item of itemsToUpdate) {
            const existingItem = getItemBySection(item.section);
            if (existingItem) {
                updateHomepageMutation.mutate({ ...existingItem, content: item.content });
            }
            else {
                createHomepageMutation.mutate(item);
            }
        }
    };
    // --- News Modal Handlers ---
    const openNewsModal = (item = null) => {
        setEditingNewsItem(item);
        setShowNewsModal(true);
    };
    const closeNewsModal = () => {
        setEditingNewsItem(null);
        setShowNewsModal(false);
    };
    const handleNewsSave = (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.newsTitle.value;
        const content = form.newsContent.value;
        const status = form.newsStatus.value;
        const date = form.newsDate.value;
        const newsData = { title, content, status, date };
        if (editingNewsItem) {
            updateNewsMutation.mutate({ ...editingNewsItem, ...newsData });
        }
        else {
            createNewsMutation.mutate(newsData);
        }
    };
    const handleDeleteNews = (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            deleteNewsMutation.mutate(id);
        }
    };
    // --- Release Modal Handlers ---
    const openReleaseModal = (item = null) => {
        setEditingReleaseItem(item);
        setShowReleaseModal(true);
    };
    const closeReleaseModal = () => {
        setEditingReleaseItem(null);
        setShowReleaseModal(false);
    };
    const handleReleaseSave = (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.releaseTitle.value;
        const type = form.releaseType.value;
        const status = form.releaseStatus.value;
        const description = form.releaseDescription.value;
        const release_date = form.releaseDate.value;
        const purchase_link = form.purchaseLink.value;
        const releaseData = { title, type, status, description, release_date, purchase_link };
        if (editingReleaseItem) {
            updateReleaseMutation.mutate({ ...editingReleaseItem, ...releaseData });
        }
        else {
            createReleaseMutation.mutate(releaseData);
        }
    };
    const handleDeleteRelease = (id) => {
        if (window.confirm('Are you sure you want to delete this release item?')) {
            deleteReleaseMutation.mutate(id);
        }
    };
    if (isLoading || isLoadingNews || isLoadingReleases)
        return _jsx("div", { className: "text-center py-8", children: "Loading homepage content manager..." });
    if (isError)
        return _jsxs("div", { className: "text-center py-8 text-red-500", children: ["Error: ", error?.message] });
    if (isErrorNews)
        return _jsxs("div", { className: "text-center py-8 text-red-500", children: ["Error loading news: ", errorNews?.message] });
    if (isErrorReleases)
        return _jsxs("div", { className: "text-center py-8 text-red-500", children: ["Error loading releases: ", errorReleases?.message] });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4", role: "alert", children: [_jsx("strong", { children: "Note:" }), " Changes made here will be reflected on your homepage immediately after saving."] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md mb-8 overflow-hidden", children: [_jsx("div", { className: "bg-blue-600 text-white p-4 font-semibold", children: "Hero Section" }), _jsx("div", { className: "p-6", children: _jsxs("form", { onSubmit: handleHeroSave, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "heroTitle", className: "block text-gray-700 text-sm font-bold mb-2", children: "Main Title" }), _jsx("input", { type: "text", id: "heroTitle", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: getItemBySection('hero_title')?.content || '' })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "heroDescription", className: "block text-gray-700 text-sm font-bold mb-2", children: "Subtitle/Description" }), _jsx("textarea", { id: "heroDescription", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-y", defaultValue: getItemBySection('hero_description')?.content || '' })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "heroButtonText", className: "block text-gray-700 text-sm font-bold mb-2", children: "Button Text" }), _jsx("input", { type: "text", id: "heroButtonText", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: getItemBySection('hero_button_text')?.content || '' })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "heroButtonLink", className: "block text-gray-700 text-sm font-bold mb-2", children: "Button Link" }), _jsx("input", { type: "url", id: "heroButtonLink", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: getItemBySection('hero_button_link')?.content || '' })] }), _jsx("button", { type: "submit", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", children: "Save Hero Section" })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md mb-8 overflow-hidden", children: [_jsx("div", { className: "bg-blue-600 text-white p-4 font-semibold", children: "Statistics" }), _jsx("div", { className: "p-6", children: _jsxs("form", { onSubmit: handleStatsSave, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "stat-item p-4 border border-gray-200 rounded-md", children: [_jsx("label", { htmlFor: "wordsWritten", className: "block text-gray-700 text-sm font-bold mb-2", children: "Words Written" }), _jsx("input", { type: "text", id: "wordsWritten", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: getItemBySection('stat_words_written')?.content || '' })] }), _jsxs("div", { className: "stat-item p-4 border border-gray-200 rounded-md", children: [_jsx("label", { htmlFor: "betaReaders", className: "block text-gray-700 text-sm font-bold mb-2", children: "Beta Readers" }), _jsx("input", { type: "text", id: "betaReaders", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: getItemBySection('stat_beta_readers')?.content || '' })] }), _jsxs("div", { className: "stat-item p-4 border border-gray-200 rounded-md", children: [_jsx("label", { htmlFor: "averageRating", className: "block text-gray-700 text-sm font-bold mb-2", children: "Average Rating" }), _jsx("input", { type: "text", id: "averageRating", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: getItemBySection('stat_average_rating')?.content || '' })] }), _jsxs("div", { className: "stat-item p-4 border border-gray-200 rounded-md", children: [_jsx("label", { htmlFor: "booksPublished", className: "block text-gray-700 text-sm font-bold mb-2", children: "Books Published" }), _jsx("input", { type: "text", id: "booksPublished", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: getItemBySection('stat_books_published')?.content || '' })] })] }), _jsx("button", { type: "submit", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", children: "Save Statistics" })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md mb-8 overflow-hidden", children: [_jsx("div", { className: "bg-blue-600 text-white p-4 font-semibold", children: "Latest News & Updates" }), _jsxs("div", { className: "p-6", children: [_jsx("button", { onClick: () => openNewsModal(), className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4", children: "+ Add New Update" }), newsItems?.map(news => (_jsxs("div", { className: "bg-gray-100 p-4 rounded-md mb-2 relative", children: [_jsxs("div", { className: "absolute top-2 right-2 flex gap-2", children: [_jsx("button", { onClick: () => openNewsModal(news), className: "bg-blue-500 text-white px-2 py-1 rounded text-xs", children: "Edit" }), _jsx("button", { onClick: () => handleDeleteNews(news.id), className: "bg-red-500 text-white px-2 py-1 rounded text-xs", children: "Delete" })] }), _jsx("h3", { className: "font-bold text-lg mb-1", children: news.title }), _jsx("p", { className: "text-gray-700 text-sm", children: news.content }), _jsxs("small", { className: "text-gray-500", children: ["Status: ", news.status, " | Date: ", news.date] })] }, news.id)))] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md mb-8 overflow-hidden", children: [_jsx("div", { className: "bg-blue-600 text-white p-4 font-semibold", children: "Latest Releases" }), _jsxs("div", { className: "p-6", children: [_jsx("button", { onClick: () => openReleaseModal(), className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4", children: "+ Add New Release" }), releaseItems?.map(release => (_jsxs("div", { className: "bg-gray-100 p-4 rounded-md mb-2 relative", children: [_jsxs("div", { className: "absolute top-2 right-2 flex gap-2", children: [_jsx("button", { onClick: () => openReleaseModal(release), className: "bg-blue-500 text-white px-2 py-1 rounded text-xs", children: "Edit" }), _jsx("button", { onClick: () => handleDeleteRelease(release.id), className: "bg-red-500 text-white px-2 py-1 rounded text-xs", children: "Delete" })] }), _jsx("h3", { className: "font-bold text-lg mb-1", children: release.title }), _jsxs("p", { className: "text-gray-700 text-sm", children: [_jsx("strong", { children: "Type:" }), " ", release.type, " | ", _jsx("strong", { children: "Status:" }), " ", release.status] }), _jsxs("small", { className: "text-gray-500", children: ["Released: ", release.release_date] })] }, release.id)))] })] }), showNewsModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-full max-w-md", children: [_jsxs("div", { className: "flex justify-between items-center border-b pb-3 mb-4", children: [_jsx("h2", { className: "text-xl font-bold", children: editingNewsItem ? 'Edit Update' : 'Add New Update' }), _jsx("button", { onClick: closeNewsModal, className: "text-gray-500 hover:text-gray-700 text-2xl", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleNewsSave, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "newsTitle", className: "block text-gray-700 text-sm font-bold mb-2", children: "Title" }), _jsx("input", { type: "text", id: "newsTitle", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: editingNewsItem?.title || '', required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "newsContent", className: "block text-gray-700 text-sm font-bold mb-2", children: "Content" }), _jsx("textarea", { id: "newsContent", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-y", defaultValue: editingNewsItem?.content || '', required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "newsStatus", className: "block text-gray-700 text-sm font-bold mb-2", children: "Status" }), _jsxs("select", { id: "newsStatus", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: editingNewsItem?.status || 'draft', children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "newsDate", className: "block text-gray-700 text-sm font-bold mb-2", children: "Date" }), _jsx("input", { type: "date", id: "newsDate", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: editingNewsItem?.date || new Date().toISOString().split('T')[0], required: true })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { type: "button", onClick: closeNewsModal, className: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", children: "Cancel" }), _jsx("button", { type: "submit", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", children: "Save Update" })] })] })] }) })), showReleaseModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-full max-w-md", children: [_jsxs("div", { className: "flex justify-between items-center border-b pb-3 mb-4", children: [_jsx("h2", { className: "text-xl font-bold", children: editingReleaseItem ? 'Edit Release' : 'Add New Release' }), _jsx("button", { onClick: closeReleaseModal, className: "text-gray-500 hover:text-gray-700 text-2xl", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleReleaseSave, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "releaseTitle", className: "block text-gray-700 text-sm font-bold mb-2", children: "Title" }), _jsx("input", { type: "text", id: "releaseTitle", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: editingReleaseItem?.title || '', required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "releaseType", className: "block text-gray-700 text-sm font-bold mb-2", children: "Type" }), _jsxs("select", { id: "releaseType", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: editingReleaseItem?.type || 'issue', children: [_jsx("option", { value: "issue", children: "Issue" }), _jsx("option", { value: "arc", children: "Arc" }), _jsx("option", { value: "volume", children: "Volume" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "releaseStatus", className: "block text-gray-700 text-sm font-bold mb-2", children: "Status" }), _jsxs("select", { id: "releaseStatus", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: editingReleaseItem?.status || 'available', children: [_jsx("option", { value: "available", children: "Available" }), _jsx("option", { value: "coming-soon", children: "Coming Soon" }), _jsx("option", { value: "pre-order", children: "Pre-order" })] })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "releaseDescription", className: "block text-gray-700 text-sm font-bold mb-2", children: "Description" }), _jsx("textarea", { id: "releaseDescription", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-y", defaultValue: editingReleaseItem?.description || '' })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "releaseDate", className: "block text-gray-700 text-sm font-bold mb-2", children: "Release Date" }), _jsx("input", { type: "date", id: "releaseDate", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: editingReleaseItem?.release_date || new Date().toISOString().split('T')[0], required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "purchaseLink", className: "block text-gray-700 text-sm font-bold mb-2", children: "Purchase Link" }), _jsx("input", { type: "url", id: "purchaseLink", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", defaultValue: editingReleaseItem?.purchase_link || '' })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { type: "button", onClick: closeReleaseModal, className: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", children: "Cancel" }), _jsx("button", { type: "submit", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", children: "Save Release" })] })] })] }) }))] }));
};
//# sourceMappingURL=HomepageContentManager.js.map