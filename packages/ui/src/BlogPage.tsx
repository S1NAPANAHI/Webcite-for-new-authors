import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { Link } from 'react-router-dom';
// Import CSS for proper paragraph spacing
import '../apps/frontend/src/styles/chapter-content.css';

// Define the type for our posts (should match the one in PostsManager.tsx)
type Post = {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  author_id: string;
  views: number;
};

// Async function to fetch published posts from Supabase
const fetchPublishedPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published') // Only fetch published posts
    .order('created_at', { ascending: false }); // Order by newest first

  if (error) {
    throw new Error(error.message);
  }
  return data as Post[];
};

export const BlogPage: React.FC = () => {
  const { data: posts, isLoading, isError, error } = useQuery<Post[]>({ 
    queryKey: ['blogPosts'], 
    queryFn: fetchPublishedPosts 
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error loading posts: {error?.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog & News</h1>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-4">Published on {new Date(post.created_at).toLocaleDateString()}</p>
                <div 
                  className="text-gray-700 leading-relaxed line-clamp-3 chapter-content-render"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <Link to={`/blog/${post.slug}`} className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">Read More &rarr;</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          <p className="text-xl mb-4">No blog posts published yet.</p>
          <p>Check back soon for new content!</p>
        </div>
      )}
    </div>
  );
};