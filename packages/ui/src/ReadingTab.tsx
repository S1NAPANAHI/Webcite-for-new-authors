import React, { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared';
import { UserProfile } from '@zoroaster/shared/profile'; // Import UserProfile

interface ReadingTabProps {
  userProfile: UserProfile;
}

interface Chapter {
  id: string;
  title: string;
  chapter_number: number;
  work_id: string; // Changed from book_id to work_id
  is_published: boolean;
  // Add other relevant chapter fields as needed
}

const ReadingTab: React.FC<ReadingTabProps> = ({ userProfile }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const orCondition = `current_period_end.gte.${now},current_period_end.is.null`;
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select('id') // Just need to know if there's an active subscription
          .eq('user_id', user.id)
          .eq('is_active', true)
          .lte('start_date', new Date().toISOString())
          .or(orCondition);

        if (subError) {
          throw subError;
        }

        if (!subscriptions || subscriptions.length === 0) {
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
      } catch (err: any) {
        console.error('Error fetching chapters:', err.message);
        setError('Failed to load chapters: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserChapters();
  }, []);

  const handleReadChapter = async (chapterId: string) => {
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
    } catch (err: any) {
      console.error('Error reading chapter:', err.message);
      alert('Error reading chapter: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading chapters...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (chapters.length === 0) {
    return <div className="text-center py-4">No chapters found for your active subscriptions.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Chapters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="bg-background-dark p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-primary">{chapter.title}</h3>
            <p className="text-text-light">Chapter {chapter.chapter_number}</p>
            <p className="text-text-light text-sm">Work ID: {chapter.work_id}</p>
            <button
              className="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
              onClick={() => handleReadChapter(chapter.id)}
            >
              Read Chapter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ReadingTab };
