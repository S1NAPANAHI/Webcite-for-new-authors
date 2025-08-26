import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@zoroaster/shared'; // Assuming you use Supabase for auth

interface ContentUrls {
  epub?: string;
  pdf?: string;
  mobi?: string;
  sample?: string;
}

interface WorkContent {
  title: string;
  description: string;
  content_urls: ContentUrls;
}

export const WorkReaderPage: React.FC = () => {
  const { workId } = useParams<{ workId: string }>();
  const [workContent, setWorkContent] = useState<WorkContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
      if (!userId || !workId) return;

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
      } catch (err) {
        console.error('Error fetching work content:', err);
        setError('An error occurred while fetching the work content.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && workId) {
      fetchWorkContent();
    }
  }, [userId, workId]);

  const handleMarkAsFinished = async () => {
    if (!userId || !workId) return;

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
    } catch (err) {
      console.error('Error marking as finished:', err);
      alert('An error occurred while marking as finished.');
    }
  };

  if (loading) {
    return <div className="text-text-light">Loading content...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  if (!workContent) {
    return <div className="text-text-light">Content not found or not accessible.</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '2.5em', marginBottom: '10px', color: '#E0BBE4' }}>{workContent.title}</h2>
      <p style={{ fontSize: '1.1em', color: '#957DAD', marginBottom: '20px' }}>{workContent.description}</p>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.5em', marginBottom: '10px', color: '#FFC72C' }}>Download Options:</h3>
        {workContent.content_urls.epub && (
          <a
            href={workContent.content_urls.epub}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              marginRight: '10px',
              marginBottom: '10px'
            }}
          >
            Download EPUB
          </a>
        )}
        {workContent.content_urls.pdf && (
          <a
            href={workContent.content_urls.pdf}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 15px',
              backgroundColor: '#F44336',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              marginRight: '10px',
              marginBottom: '10px'
            }}
          >
            Download PDF
          </a>
        )}
        {workContent.content_urls.mobi && (
          <a
            href={workContent.content_urls.mobi}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 15px',
              backgroundColor: '#2196F3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              marginRight: '10px',
              marginBottom: '10px'
            }}
          >
            Download MOBI
          </a>
        )}
        {!workContent.content_urls.epub && !workContent.content_urls.pdf && !workContent.content_urls.mobi && (
          <p style={{ color: '#957DAD' }}>No downloadable content available for this work.</p>
        )}
      </div>

      <button
        onClick={handleMarkAsFinished}
        style={{
          padding: '10px 20px',
          backgroundColor: '#8860D0',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Mark as Finished
      </button>

      {/* You can add an embedded viewer here for PDF/EPUB if desired */}
      {/* Example for PDF: <iframe src={workContent.content_urls.pdf} width="100%" height="600px"></iframe> */}
    </div>
  );
};

