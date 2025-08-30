import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
export const AdminUploadPage = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('chapter'); // Default to chapter
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState(''); // Assuming URL for cover image
    const [epubFile, setEpubFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [mobiFile, setMobiFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]); // New state for users
    const [usersLoading, setUsersLoading] = useState(true); // New state for users loading
    const [usersError, setUsersError] = useState(null); // New state for users error
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [subscriptionType, setSubscriptionType] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const fetchUsers = async () => {
        setUsersLoading(true);
        setUsersError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setUsersError('User not authenticated.');
                setUsersLoading(false);
                return;
            }
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch users.');
            }
            const data = await response.json();
            setUsers(data.users);
        }
        catch (err) {
            console.error('Error fetching users:', err instanceof Error ? err.message : err);
            setUsersError('Failed to load users: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
        finally {
            setUsersLoading(false);
        }
    };
    // Fetch users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('description', description);
        formData.append('release_date', releaseDate);
        formData.append('cover_image_url', coverImageUrl); // Send as URL
        if (epubFile)
            formData.append('epub_file', epubFile);
        if (pdfFile)
            formData.append('pdf_file', pdfFile);
        if (mobiFile)
            formData.append('mobi_file', mobiFile);
        try {
            // IMPORTANT: Replace 'YOUR_ADMIN_USER_ID' with an actual admin user's ID from your Supabase auth.users table.
            // You can find this in your Supabase dashboard or by querying your database.
            // For testing, you might hardcode it, but in production, it should come from your auth context.
            const adminUserId = 'YOUR_ADMIN_USER_ID';
            if (adminUserId === 'YOUR_ADMIN_USER_ID') {
                setError("Please replace 'YOUR_ADMIN_USER_ID' with an actual admin user's ID in AdminUploadPage.jsx");
                setLoading(false);
                return;
            }
            const response = await fetch('http://localhost:3001/api/admin/works', {
                method: 'POST',
                headers: {
                    'x-user-id': adminUserId, // Pass user ID for admin authorization middleware
                    // If you implement JWT, you'd add: 'Authorization': `Bearer ${yourAuthToken}`
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Work uploaded successfully!');
                // Clear form
                setTitle('');
                setType('chapter');
                setDescription('');
                setReleaseDate('');
                setCoverImageUrl('');
                setEpubFile(null);
                setPdfFile(null);
                setMobiFile(null);
                // Reset file inputs visually
                document.getElementById('epubFileInput').value = '';
                document.getElementById('pdfFileInput').value = '';
                document.getElementById('mobiFileInput').value = '';
            }
            else {
                setError(data.message || 'Failed to upload work.');
            }
        }
        catch (err) {
            console.error('Error uploading work:', err);
            setError('An error occurred while uploading the work. Check console for details.');
        }
        finally {
            setLoading(false);
        }
    };
    const openSubscriptionModal = (user) => {
        setSelectedUser(user);
        // Pre-fill form if user has an existing subscription
        const activeSub = user.subscriptions.find(sub => sub.status === 'active' || sub.status === 'trialing');
        if (activeSub) {
            setSubscriptionType(activeSub.subscription_type);
            setIsActive(activeSub.status === 'active' || activeSub.status === 'trialing');
            setStartDate(activeSub.start_date ? activeSub.start_date.split('T')[0] : '');
            setEndDate(activeSub.current_period_end ? activeSub.current_period_end.split('T')[0] : '');
        }
        else {
            // Reset form for new subscription
            setSubscriptionType('');
            setIsActive(false);
            setStartDate(new Date().toISOString().split('T')[0]); // Default to today
            setEndDate('');
        }
        setShowSubscriptionModal(true);
    };
    const closeSubscriptionModal = () => {
        setShowSubscriptionModal(false);
        setSelectedUser(null);
    };
    const handleSubscriptionSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser)
            return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('You must be logged in to manage subscriptions.');
                return;
            }
            const response = await fetch(`/api/admin/users/${selectedUser.id}/subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    subscription_type: subscriptionType,
                    status: isActive ? 'active' : 'canceled', // Map boolean isActive to status string
                    start_date: startDate,
                    current_period_end: endDate || null,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update subscription.');
            }
            alert('Subscription updated successfully!');
            closeSubscriptionModal();
            fetchUsers(); // Refresh user list
        }
        catch (err) {
            console.error('Error updating subscription:', err instanceof Error ? err.message : err);
            alert('Error updating subscription: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };
    return (_jsxs("div", { style: { padding: '20px', maxWidth: '1200px', margin: 'auto', fontFamily: 'Arial, sans-serif' }, children: [_jsx("h1", { style: { textAlign: 'center', marginBottom: '30px' }, children: "Admin Dashboard" }), _jsxs("div", { style: { marginBottom: '50px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }, children: [_jsx("h2", { children: "Upload New Work (Chapter/Issue)" }), message && _jsx("p", { style: { color: 'green', fontWeight: 'bold' }, children: message }), error && _jsx("p", { style: { color: 'red', fontWeight: 'bold' }, children: error }), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '15px' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '5px' }, children: "Title:" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), required: true, style: { width: '100%', padding: '8px', boxSizing: 'border-box' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '5px' }, children: "Type:" }), _jsxs("select", { value: type, onChange: (e) => setType(e.target.value), style: { width: '100%', padding: '8px', boxSizing: 'border-box' }, children: [_jsx("option", { value: "chapter", children: "Chapter" }), _jsx("option", { value: "issue", children: "Issue" }), _jsx("option", { value: "book", children: "Book" }), _jsx("option", { value: "volume", children: "Volume" }), _jsx("option", { value: "saga", children: "Saga" }), _jsx("option", { value: "arc", children: "Arc" })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '5px' }, children: "Description:" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), style: { width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '5px' }, children: "Release Date:" }), _jsx("input", { type: "date", value: releaseDate, onChange: (e) => setReleaseDate(e.target.value), style: { width: '100%', padding: '8px', boxSizing: 'border-box' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '5px' }, children: "Cover Image URL:" }), _jsx("input", { type: "text", value: coverImageUrl, onChange: (e) => setCoverImageUrl(e.target.value), placeholder: "e.g., https://example.com/cover.jpg", style: { width: '100%', padding: '8px', boxSizing: 'border-box' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '5px' }, children: "EPUB File:" }), _jsx("input", { type: "file", id: "epubFileInput", onChange: (e) => setEpubFile(e.target.files?.[0] || null), accept: ".epub", style: { width: '100%', padding: '8px', boxSizing: 'border-box' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '5px' }, children: "PDF File:" }), _jsx("input", { type: "file", id: "pdfFileInput", onChange: (e) => setPdfFile(e.target.files?.[0] || null), accept: ".pdf", style: { width: '100%', padding: '8px', boxSizing: 'border-box' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '5px' }, children: "MOBI File:" }), _jsx("input", { type: "file", id: "mobiFileInput", onChange: (e) => setMobiFile(e.target.files?.[0] || null), accept: ".mobi", style: { width: '100%', padding: '8px', boxSizing: 'border-box' } })] }), _jsx("button", { type: "submit", disabled: loading, style: {
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '16px'
                                }, children: loading ? 'Uploading...' : 'Upload Work' })] })] }), _jsxs("div", { style: { border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }, children: [_jsx("h2", { children: "User Management" }), usersLoading && _jsx("p", { children: "Loading users..." }), usersError && _jsx("p", { style: { color: 'red' }, children: usersError }), !usersLoading && !usersError && (_jsxs("table", { style: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: '#f2f2f2' }, children: [_jsx("th", { style: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' }, children: "Email" }), _jsx("th", { style: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' }, children: "Display Name" }), _jsx("th", { style: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' }, children: "Role" }), _jsx("th", { style: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' }, children: "Subscription Status" }), _jsx("th", { style: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' }, children: "Actions" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { children: [_jsx("td", { style: { border: '1px solid #ddd', padding: '8px' }, children: user.email }), _jsx("td", { style: { border: '1px solid #ddd', padding: '8px' }, children: user.profile?.display_name || 'N/A' }), _jsx("td", { style: { border: '1px solid #ddd', padding: '8px' }, children: user.profile?.role || 'user' }), _jsx("td", { style: { border: '1px solid #ddd', padding: '8px' }, children: user.subscriptions.length > 0 && user.subscriptions.some(sub => sub.status === 'active' || sub.status === 'trialing') ? 'Active' : 'Inactive' }), _jsxs("td", { style: { border: '1px solid #ddd', padding: '8px' }, children: [_jsx("button", { style: { marginRight: '5px', padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }, onClick: () => openSubscriptionModal(user), children: "Manage Subscription" }), _jsx("button", { style: { padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }, children: "Manage Entitlements" })] })] }, user.id))) })] }))] }), showSubscriptionModal && selectedUser && (_jsx("div", { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }, children: _jsxs("div", { style: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', color: 'black' }, children: [_jsxs("h3", { style: { marginBottom: '15px' }, children: ["Manage Subscription for ", selectedUser.email] }), _jsxs("form", { onSubmit: handleSubscriptionSubmit, style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: [_jsxs("div", { children: [_jsx("label", { children: "Subscription Type:" }), _jsx("input", { type: "text", value: subscriptionType, onChange: (e) => setSubscriptionType(e.target.value), required: true, style: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Is Active:" }), _jsx("input", { type: "checkbox", checked: isActive, onChange: (e) => setIsActive(e.target.checked), style: { marginLeft: '10px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Start Date:" }), _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), required: true, style: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "End Date:" }), _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), style: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' } })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }, children: [_jsx("button", { type: "button", onClick: closeSubscriptionModal, style: { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }, children: "Cancel" }), _jsx("button", { type: "submit", style: { padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }, children: "Save" })] })] })] }) }))] }));
};
//# sourceMappingURL=AdminUploadPage.js.map