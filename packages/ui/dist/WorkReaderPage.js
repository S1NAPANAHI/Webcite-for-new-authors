import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../packages/shared/src/supabaseClient.js'; // Assuming you use Supabase for auth
export const WorkReaderPage = () => {
    const { workId } = useParams();
    const [workContent, setWorkContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const getUserId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
            else {
                setError('User not authenticated.');
                setLoading(false);
            }
        };
        getUserId();
    }, []);
    useEffect(() => {
        const fetchWorkContent = async () => {
            if (!userId || !workId)
                return;
            try {
                setError(null);
                const response = await fetch(`http://localhost:3001/api/content/${workId}`, {
                    headers: {
                        'x-user-id': userId, // Pass user ID for authorization
                        // Add Authorization header if using JWT
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setWorkContent(data);
                }
                else {
                    setError(data.message || 'Failed to fetch content.');
                }
            }
            catch (err) {
                console.error('Error fetching work content:', err);
                setError('An error occurred while fetching the work content.');
            }
            finally {
                setLoading(false);
            }
        };
        if (userId && workId) {
            fetchWorkContent();
        }
    }, [userId, workId]);
    const handleMarkAsFinished = async () => {
        if (!userId || !workId)
            return;
        try {
            const response = await fetch(`http://localhost:3001/api/library/${userId}/library/${workId}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId,
                },
                body: JSON.stringify({ is_finished: true }),
            });
            if (response.ok) {
                alert('Work marked as finished!');
                // Optionally update UI or navigate back
            }
            else {
                const data = await response.json();
                alert(`Failed to mark as finished: ${data.message}`);
            }
        }
        catch (err) {
            console.error('Error marking as finished:', err);
            alert('An error occurred while marking as finished.');
        }
    };
    if (loading) {
        return _jsx("div", { className: "text-text-light", children: "Loading content..." });
    }
    if (error) {
        return _jsxs("div", { className: "text-red-400", children: ["Error: ", error] });
    }
    if (!workContent) {
        return _jsx("div", { className: "text-text-light", children: "Content not found or not accessible." });
    }
    return (_jsxs("div", { style: { padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }, children: [_jsx("h2", { style: { fontSize: '2.5em', marginBottom: '10px', color: '#E0BBE4' }, children: workContent.title }), _jsx("p", { style: { fontSize: '1.1em', color: '#957DAD', marginBottom: '20px' }, children: workContent.description }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h3", { style: { fontSize: '1.5em', marginBottom: '10px', color: '#FFC72C' }, children: "Download Options:" }), workContent.content_urls.epub && (_jsx("a", { href: workContent.content_urls.epub, target: "_blank", rel: "noopener noreferrer", style: {
                            display: 'inline-block',
                            padding: '10px 15px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            marginRight: '10px',
                            marginBottom: '10px'
                        }, children: "Download EPUB" })), workContent.content_urls.pdf && (_jsx("a", { href: workContent.content_urls.pdf, target: "_blank", rel: "noopener noreferrer", style: {
                            display: 'inline-block',
                            padding: '10px 15px',
                            backgroundColor: '#F44336',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            marginRight: '10px',
                            marginBottom: '10px'
                        }, children: "Download PDF" })), workContent.content_urls.mobi && (_jsx("a", { href: workContent.content_urls.mobi, target: "_blank", rel: "noopener noreferrer", style: {
                            display: 'inline-block',
                            padding: '10px 15px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            marginRight: '10px',
                            marginBottom: '10px'
                        }, children: "Download MOBI" })), !workContent.content_urls.epub && !workContent.content_urls.pdf && !workContent.content_urls.mobi && (_jsx("p", { style: { color: '#957DAD' }, children: "No downloadable content available for this work." }))] }), _jsx("button", { onClick: handleMarkAsFinished, style: {
                    padding: '10px 20px',
                    backgroundColor: '#8860D0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginTop: '20px'
                }, children: "Mark as Finished" })] }));
};
//# sourceMappingURL=WorkReaderPage.js.map