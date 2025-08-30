import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../packages/shared/src/supabaseClient.js';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { XCircle, Info, Star } from 'lucide-react';
// --- Supabase Data Functions ---
const fetchAllWorks = async () => {
    const { data, error } = await supabase.from('works').select('*').order('order_in_parent', { ascending: true });
    if (error)
        throw new Error(error.message);
    return data;
};
const fetchUserLibraryItems = async (userId) => {
    if (!userId)
        return [];
    const { data, error } = await supabase
        .from('purchases')
        .select(`
      id,
      user_id,
      product_id,
      purchased_at,
      status,
      products (
        name,
        description,
        product_type,
        work_id
      )
    `)
        .eq('user_id', userId);
    if (error)
        throw new Error(error.message);
    return data.map(purchase => ({
        id: purchase.id,
        user_id: purchase.user_id,
        product_id: purchase.product_id,
        purchased_at: purchase.purchased_at,
        status: purchase.status,
        product_title: purchase.products?.name || 'Unknown Product',
        product_description: purchase.products?.description,
        product_type: purchase.products?.product_type || 'single_issue',
        work_id: purchase.products?.work_id,
    }));
};
const fetchUserRating = async (userId, workId) => {
    if (!userId || !workId)
        return null;
    const { data, error } = await supabase
        .from('user_ratings')
        .select('rating')
        .eq('user_id', userId)
        .eq('work_id', workId)
        .single();
    if (error && error.code !== 'PGRST116')
        throw new Error(error.message); // PGRST116 means no rows found
    return data ? data.rating : null;
};
const upsertUserRating = async (userId, workId, rating) => {
    const { data, error } = await supabase
        .from('user_ratings')
        .upsert({ user_id: userId, work_id: workId, rating: rating }, { onConflict: 'user_id,work_id' })
        .select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
// --- Work Card Component (New Design) ---
export const WorkCard = ({ work, userLibraryItem, queryClient }) => {
    const { user } = useAuth(); // Get current user for rating
    const [userCurrentRating, setUserCurrentRating] = useState(null);
    const [isSampleExpanded, setIsSampleExpanded] = useState(false);
    const [showSample, setShowSample] = useState(false);
    // Fetch user's specific rating for this work
    const { data: fetchedUserRating } = useQuery({
        queryKey: ['userRating', user?.id, work.id],
        queryFn: () => fetchUserRating(user?.id || '', work.id),
        enabled: !!user?.id, // Only run if user is logged in
    });
    useEffect(() => {
        if (fetchedUserRating !== undefined) {
            setUserCurrentRating(fetchedUserRating);
        }
    }, [fetchedUserRating]);
    const upsertRatingMutation = useMutation({
        mutationFn: ({ userId, workId, rating }) => upsertUserRating(userId, workId, rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userRating', user?.id, work.id] }); // Invalidate specific user rating
            queryClient.invalidateQueries({ queryKey: ['allWorks'] }); // Invalidate all works to update average rating/count
        },
        onError: (err) => {
            alert(`Error submitting rating: ${err.message}`);
        }
    });
    const handleStarClick = (ratingValue) => {
        if (!user) {
            alert("Please log in to submit a rating.");
            return;
        }
        if (user.id) {
            upsertRatingMutation.mutate({ userId: user.id, workId: work.id, rating: ratingValue });
        }
    };
    const progressPercentage = work.word_count && work.target_word_count
        ? Math.min(100, Math.round((work.word_count / work.target_word_count) * 100))
        : work.progress_percentage || 0;
    const authorName = "S. Azar"; // Hardcoded for now
    return (_jsxs("article", { className: "book-card", "data-book-id": work.id, "aria-label": `Book card: ${work.title} by ${authorName}`, children: [_jsxs("div", { className: "book-main", children: [_jsx("div", { className: "cover", role: "img", "aria-label": `Book cover: ${work.title} by ${authorName}`, style: { background: work.cover_image_url ? `url(${work.cover_image_url}) center center / cover` : 'var(--teal)' }, children: !work.cover_image_url && (_jsxs("div", { className: "cover-content", children: [_jsx("div", { className: "cover-title", children: work.title }), _jsx("div", { className: "cover-author", children: authorName })] })) }), _jsxs("div", { className: "details", children: [_jsxs("div", { className: "book-header", children: [_jsx("h3", { className: "book-title", children: work.title }), _jsx("div", { className: "author", children: authorName })] }), (work.release_date || work.estimated_release) && (_jsx("div", { className: "release-info text-sm text-muted mt-1", children: work.release_date ? (_jsxs("span", { children: ["Released: ", new Date(work.release_date).toLocaleDateString()] })) : (_jsxs("span", { children: ["Estimated Release: ", work.estimated_release] })) })), (work.status === 'planning' || work.status === 'writing' || work.status === 'editing') && (_jsxs("div", { className: "progress", "aria-label": "Author writing progress", children: [_jsxs("div", { className: "progress-head", children: [_jsxs("span", { children: [progressPercentage, "% written"] }), _jsxs("span", { "aria-live": "polite", children: [progressPercentage, "%"] })] }), _jsx("div", { className: "bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": progressPercentage, "aria-label": "Author writing progress", children: _jsx("span", { style: { width: `${progressPercentage}%` } }) })] })), _jsx("p", { className: "desc", children: work.description || 'No description available.' }), _jsxs("div", { className: "rating", "aria-label": `Rating ${work.rating?.toFixed(1) || '0.0'} out of 5 based on ${work.reviews_count || 0} reviews`, children: [_jsx("span", { className: "stars", "aria-hidden": "true", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: `star ${i < (userCurrentRating !== null ? userCurrentRating : Math.floor(work.rating || 0)) ? 'filled' : ''}`, onClick: () => handleStarClick(i + 1), onMouseEnter: () => user && setUserCurrentRating(i + 1), onMouseLeave: () => user && setUserCurrentRating(fetchedUserRating !== null ? fetchedUserRating : null), style: { cursor: user ? 'pointer' : 'default' } }, i))) }), _jsx("span", { children: work.rating?.toFixed(1) || '0.0' }), _jsxs("small", { children: ["\u2022 ", work.reviews_count || 0, " reviews"] })] }), _jsx("div", { className: "actions", children: userLibraryItem ? (_jsx(_Fragment, { children: _jsx("button", { className: "btn primary", children: "Open" }) })) : (_jsx("button", { className: "btn primary", children: "Buy now" })) }), work.sample_content && (_jsxs("button", { className: "sample-toggle-btn", onClick: () => setIsSampleExpanded(!isSampleExpanded), "aria-expanded": isSampleExpanded, children: [_jsx("span", { children: "Read Sample" }), _jsx("svg", { className: `toggle-arrow ${isSampleExpanded ? 'expanded' : ''}`, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("polyline", { points: "6,9 12,15 18,9" }) })] }))] })] }), isSampleExpanded && work.sample_content && (_jsxs("div", { className: "sample-card expanded", children: [_jsx("div", { className: "sample-header", children: _jsxs("h4", { children: ["Sample from \"", work.title, "\""] }) }), _jsx("div", { className: "sample-excerpt", children: _jsx("p", { children: work.sample_content }) }), _jsx("div", { className: "sample-actions", children: userLibraryItem ? (_jsx("button", { className: "continue-btn", children: "Continue reading" })) : (_jsx("button", { className: "buy-btn", children: "Buy now" })) })] }))] }));
};
// --- Main Library Page Component ---
export const LibraryPage = () => {
    const { user } = useAuth(); // Get current user from AuthContext
    const queryClient = useQueryClient();
    // Fetch all works
    const { data: allWorks, isLoading: isLoadingWorks, isError: isErrorWorks, error: errorWorks } = useQuery({
        queryKey: ['allWorks'],
        queryFn: fetchAllWorks,
    });
    // Conditionally fetch user library items if user is logged in
    const { data: userLibraryItems, isLoading: isLoadingUserLibrary, isError: isErrorUserLibrary, error: errorUserLibrary } = useQuery({
        queryKey: ['userLibraryItems', user?.id],
        queryFn: () => fetchUserLibraryItems(user?.id || ''),
        enabled: !!user?.id, // Only run query if user is logged in
    });
    const [showInfoBanner, setShowInfoBanner] = useState(true);
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    // Mock calendar data for now
    const filteredWorks = allWorks?.filter(work => {
        const matchesType = filterType === 'All' || work.type === filterType.toLowerCase();
        const matchesStatus = filterStatus === 'All' || work.status === filterStatus.toLowerCase();
        return matchesType && matchesStatus;
    }) || [];
    if (isLoadingWorks || isLoadingUserLibrary)
        return _jsx("div", { className: "text-center py-8 text-text-light", children: "Loading library..." });
    if (isErrorWorks)
        return _jsxs("div", { className: "text-center py-8 text-red-400", children: ["Error loading works: ", errorWorks?.message] });
    if (isErrorUserLibrary)
        return _jsxs("div", { className: "text-center py-8 text-red-400", children: ["Error loading user library: ", errorUserLibrary?.message] });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 bg-background-dark text-text-light min-h-screen", children: [_jsx("h1", { className: "text-4xl font-bold text-text-light mb-6", children: "Your Library" }), showInfoBanner && (_jsxs("div", { className: "bg-blue-900 bg-opacity-30 border border-blue-700 text-blue-200 p-4 rounded-md mb-6 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Info, { size: 20 }), _jsx("p", { className: "text-sm", children: "Files may include a purchaser-specific watermark. Download limits: 5 per format." })] }), _jsx("button", { onClick: () => setShowInfoBanner(false), className: "text-blue-200 hover:text-white", children: _jsx(XCircle, { size: 20 }) })] })), _jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [_jsx("button", { onClick: () => setFilterType('All'), className: `px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'All' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: "All" }), _jsx("button", { onClick: () => setFilterType('Book'), className: `px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Book' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: "Books" }), _jsx("button", { onClick: () => setFilterType('Volume'), className: `px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Volume' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: "Volumes" }), _jsx("button", { onClick: () => setFilterType('Saga'), className: `px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Saga' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: "Sagas" }), _jsx("button", { onClick: () => setFilterType('Arc'), className: `px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Arc' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: "Arcs" }), _jsx("button", { onClick: () => setFilterType('Issue'), className: `px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Issue' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: "Issues" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-3 py-2 rounded-full text-sm font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600", children: [_jsx("option", { value: "All", children: "All Status" }), _jsx("option", { value: "Published", children: "Published" }), _jsx("option", { value: "Planning", children: "Planning" }), _jsx("option", { value: "Writing", children: "Writing" }), _jsx("option", { value: "Editing", children: "Editing" }), _jsx("option", { value: "On_hold", children: "On Hold" })] })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: _jsx("div", { className: "lg:col-span-3", children: _jsx("div", { className: "grid grid-cols-1 gap-6 mb-8", children: filteredWorks.map((work) => {
                            const userLibraryItem = userLibraryItems?.find(item => item.work_id === work.id);
                            return (_jsx(WorkCard, { work: work, userLibraryItem: userLibraryItem, queryClient: queryClient }, work.id));
                        }) }) }) })] }));
};
//# sourceMappingURL=LibraryPage.js.map