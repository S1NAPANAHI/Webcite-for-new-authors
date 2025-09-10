import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { Database } from '@/types/supabase';
import { Spinner } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import CommentSection from '@/components/CommentSection'; // Import CommentSection

type AuthorJourneyPost = Database['public']['Tables']['authors_journey_posts']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

type TableOfContentsItem = {
  id: string;
  text: string;
  level: number;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function AuthorJourneyPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<AuthorJourneyPost | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPostAndAuthor = async () => {
      if (!slug) {
        setError('Post slug not provided.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const { data: postData, error: dbError } = await supabase
          .from('authors_journey_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (dbError) {
          if (dbError.code === 'PGRST116') { // No rows found
            setError('Post not found or not published.');
          } else {
            throw dbError;
          }
        } else {
          setPost(postData);
          if (postData?.author_id) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', postData.author_id)
              .single();
            
            if (profileError) {
              console.error('Error fetching author profile:', profileError);
              setAuthorName('Unknown Author');
            } else {
              setAuthorName(profileData?.username || 'Unknown Author');
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError('Failed to load post: ' + err.message);
        toast.error('Failed to load post: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndAuthor();
  }, [slug]);

  useEffect(() => {
    if (post && contentRef.current) {
      const headings: TableOfContentsItem[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content || '', 'text/html');
      
      doc.querySelectorAll('h1, h2, h3').forEach((headingElement, index) => {
        const level = parseInt(headingElement.tagName.substring(1));
        const text = headingElement.textContent || '';
        const id = headingElement.id || `heading-${index}`;
        headingElement.id = id; // Ensure the heading has an ID
        headings.push({ id, text, level });
      });
      setTableOfContents(headings);

      // Update the DOM with assigned IDs
      if (contentRef.current) {
        contentRef.current.innerHTML = doc.body.innerHTML;
      }
    }
  }, [post]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading post..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-gray-500 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p>The requested post could not be found or is not published.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:w-3/4">
          {/* Title */}
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-gray-400">
            <span>{formatDate(post.published_at)}</span>
            {authorName && <span>By {authorName}</span>}
          </div>

          {/* Body */}
          <div className="mt-8 prose dark:prose-invert max-w-none" ref={contentRef}>
            {/* Content will be set by useEffect */}
          </div>

          {/* Footer / back link */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-gray-700 text-sm text-slate-500 dark:text-gray-400">
            <a href="/learn" className="hover:underline">← Back to Learn Page</a>
          </div>
          <CommentSection contentId={post.id} contentType="post" />
        </div>

        {/* Table of Contents Sidebar */}
        {tableOfContents.length > 0 && (
          <div className="lg:w-1/4 lg:sticky lg:top-24 lg:self-start mt-8 lg:mt-0 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Table of Contents</h3>
            <nav>
              <ul>
                {tableOfContents.map((item) => (
                  <li key={item.id} className={`mb-2 ${item.level === 2 ? 'ml-4' : item.level === 3 ? 'ml-8' : ''}`}>
                    <a 
                      href={`#${item.id}`}
                      onClick={(e) => { e.preventDefault(); scrollToHeading(item.id); }}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}