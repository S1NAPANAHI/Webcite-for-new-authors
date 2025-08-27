import React, { useState, useEffect } from 'react';
'@zoroaster

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
        throw new Error((errorData as { error: string }).error || 'Failed to fetch users.');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      setUsersError('Failed to load users: ' + err.message);
    } finally {
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

    if (epubFile) formData.append('epub_file', epubFile);
    if (pdfFile) formData.append('pdf_file', pdfFile);
    if (mobiFile) formData.append('mobi_file', mobiFile);

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
        (document.getElementById('epubFileInput') as HTMLInputElement).value = '';
        (document.getElementById('pdfFileInput') as HTMLInputElement).value = '';
        (document.getElementById('mobiFileInput') as HTMLInputElement).value = '';

      } else {
        setError((data as { message: string }).message || 'Failed to upload work.');
      }
    } catch (err) {
      console.error('Error uploading work:', err);
      setError('An error occurred while uploading the work. Check console for details.');
    } finally {
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
    } else {
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
    if (!selectedUser) return;

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
        throw new Error((errorData as { error: string }).error || 'Failed to update subscription.');
      }

      alert('Subscription updated successfully!');
      closeSubscriptionModal();
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error('Error updating subscription:', err.message);
      alert('Error updating subscription: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Dashboard</h1>

      {/* Upload Work Section */}
      <div style={{ marginBottom: '50px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>Upload New Work (Chapter/Issue)</h2>
        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="chapter">Chapter</option>
              <option value="issue">Issue</option>
              <option value="book">Book</option>
              <option value="volume">Volume</option>
              <option value="saga">Saga</option>
              <option value="arc">Arc</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' }}
            ></textarea>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Release Date:</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Cover Image URL:</label>
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="e.g., https://example.com/cover.jpg"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>EPUB File:</label>
            <input
              type="file"
              id="epubFileInput"
              onChange={(e) => setEpubFile(e.target.files[0])}
              accept=".epub"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>PDF File:</label>
            <input
              type="file"
              id="pdfFileInput"
              onChange={(e) => setPdfFile(e.target.files[0])}
              accept=".pdf"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>MOBI File:</label>
            <input
              type="file"
              id="mobiFileInput"
              onChange={(e) => setMobiFile(e.target.files[0])}
              accept=".mobi"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Uploading...' : 'Upload Work'}
          </button>
        </form>
      </div>

      {/* User Management Section */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>User Management</h2>
        {usersLoading && <p>Loading users...</p>}
        {usersError && <p style={{ color: 'red' }}>{usersError}</p>}
        {!usersLoading && !usersError && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Display Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Role</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Subscription Status</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.profile?.display_name || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.profile?.role || 'user'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {user.subscriptions.length > 0 && user.subscriptions.some(sub => sub.status === 'active' || sub.status === 'trialing') ? 'Active' : 'Inactive'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button 
                      style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                      onClick={() => openSubscriptionModal(user)}
                    >
                      Manage Subscription
                    </button>
                    <button style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Manage Entitlements</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Subscription Management Modal */}
      {showSubscriptionModal && selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', color: 'black' }}>
            <h3 style={{ marginBottom: '15px' }}>Manage Subscription for {selectedUser.email}</h3>
            <form onSubmit={handleSubscriptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label>Subscription Type:</label>
                <input type="text" value={subscriptionType} onChange={(e) => setSubscriptionType(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Is Active:</label>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ marginLeft: '10px' }} />
              </div>
              <div>
                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>End Date:</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={closeSubscriptionModal} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

