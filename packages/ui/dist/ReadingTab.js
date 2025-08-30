import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
const ReadingTab = ({ userProfile }) => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUserChapters = async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setError('User not authenticated.');
                    setLoading(false);
                    return;
                }
                // Check if user has ANY active subscription
                const now = new Date().toISOString();
                let baseQuery = supabase.from('subscriptions');
                let query = baseQuery
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('is_active', true)
                    .lte('start_date', now);
                query = query.or(`current_period_end.gte.${now},current_period_end.is.null`);
                const { data: subscriptions, error: subError } = await query;
                if (subError) {
                    throw subError;
                }
                const subscriptionsList = subscriptions;
                if (!subscriptionsList || subscriptionsList.length === 0) {
                    setError('No active subscriptions found.');
                    setLoading(false);
                    return;
                }
                // If user has an active subscription, fetch their entitlements
                const { data: entitlements, error: entitlementsError } = await supabase
                    .from('entitlements')
                    .select('scope') // Select 'scope' instead of 'work_id'
                    .eq('user_id', user.id);
                if (entitlementsError) {
                    throw entitlementsError;
                }
                if (!entitlements || entitlements.length === 0) {
                    setError('No content entitlements found for your active subscription.');
                    setLoading(false);
                    return;
                }
                const entitledWorkIds = entitlements.map(ent => ent.scope.split(':')[1]); // Assuming scope is like 'work:work_id'
                // Now, fetch chapters that belong to these entitled works (books)
                // Assuming 'work_id' from entitlements directly maps to 'work_id' in chapters table
                const { data: fetchedChapters, error: chaptersError } = await supabase
                    .from('chapters')
                    .select('*')
                    .in('work_id', entitledWorkIds) // Changed from book_id to work_id
                    .eq('is_published', true)
                    .order('chapter_number', { ascending: true });
                if (chaptersError) {
                    throw chaptersError;
                }
                setChapters(fetchedChapters || []);
            }
            catch (err) {
                console.error('Error fetching chapters:', err.message);
                setError('Failed to load chapters: ' + err.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUserChapters();
    }, []);
    const handleReadChapter = async (chapterId) => {
        try {
            const response = await fetch(`/api/chapters/secure/${chapterId}`, {
                headers: {
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get signed URL.');
            }
            const data = await response.json();
            window.open(data.signedUrl, '_blank'); // Open in new tab
        }
        catch (err) {
            console.error('Error reading chapter:', err.message);
            alert('Error reading chapter: ' + err.message);
        }
    };
    if (loading) {
        return _jsx("div", { className: "text-center py-4", children: "Loading chapters..." });
    }
    if (error) {
        return _jsx("div", { className: "text-center py-4 text-red-500", children: error });
    }
    if (chapters.length === 0) {
        return _jsx("div", { className: "text-center py-4", children: "No chapters found for your active subscriptions." });
    }
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Your Chapters" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: chapters.map((chapter) => (_jsxs("div", { className: "bg-background-dark p-4 rounded-lg shadow-md", children: [_jsx("h3", { className: "text-xl font-medium text-primary", children: chapter.title }), _jsxs("p", { className: "text-text-light", children: ["Chapter ", chapter.chapter_number] }), _jsxs("p", { className: "text-text-light text-sm", children: ["Work ID: ", chapter.work_id] }), _jsx("button", { className: "mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded", onClick: () => handleReadChapter(chapter.id), children: "Read Chapter" })] }, chapter.id))) })] }));
};
export { ReadingTab };
//# sourceMappingURL=ReadingTab.js.map