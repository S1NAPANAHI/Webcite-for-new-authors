import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';


// Define the type for our posts
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

const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published') // Only fetch published posts
    .single(); // Expect a single result

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    throw new Error(error.message);
  }
  return data as Post | null;
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError, error } = useQuery<Post | null>({
    queryKey: ['blogPost', slug],
    queryFn: () => (slug ? fetchPostBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug, // Only run query if slug is available
  });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-300">Loading post...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-400">Error loading post: {error?.message}</div>;
  }

  if (!post) {
    return <div className="text-center py-8 text-gray-400">Post not found or not published.</div>;
  }

  // Simple excerpt generation (can be improved with a dedicated field in DB)
  const excerpt = post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl relative z-20">
      <article className="blog-post relative overflow-hidden transition-transform duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-lg-custom">
        {/* Custom before pseudo-element for golden line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d4af37] via-[#b8860b] to-[#d4af37]"></div>

        <div className="post-meta flex justify-between items-center mb-8 pb-4 border-b border-gold-300-opacity flex-wrap gap-4">
          <span className="post-date text-[#d4af37] font-semibold text-sm tracking-wider">{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {/* Assuming a category field or deriving it */}
          <span className="post-category bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-[#1a1a2e] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">World Building</span>
        </div>
        
        <h1 className="post-title font-cinzel text-4xl text-[#f0f0f0] mb-6 leading-tight text-shadow-md">{post.title}</h1>
        
        <div 
          className="post-excerpt text-lg text-[#c0c0c0] mb-8 italic border-l-4 border-[#d4af37] pl-6"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
        
        <div 
          className="post-content text-lg leading-relaxed text-[#e8e8e8] prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Post Footer - Tags and Share Buttons (placeholders) */}
        <div className="post-footer mt-12 pt-8 border-t border-gold-300-opacity flex justify-between items-center flex-wrap gap-4">
          <div className="post-tags flex gap-2 flex-wrap">
            <span className="tag bg-gold-300-opacity-20 text-[#d4af37] px-3 py-1 rounded-full text-sm border border-gold-300-opacity-30 transition-all duration-300 hover:bg-gold-300-opacity-30 hover:scale-105">#Magic</span>
            <span className="tag bg-gold-300-opacity-20 text-[#d4af37] px-3 py-1 rounded-full text-sm border border-gold-300-opacity-30 transition-all duration-300 hover:bg-gold-300-opacity-30 hover:scale-105">#WorldBuilding</span>
          </div>
          
          <div className="social-share flex gap-4">
            <button className="share-btn bg-white-opacity-10 border border-white-opacity-20 text-[#e8e8e8] p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-gold-300-opacity-20 hover:border-[#d4af37] hover:translate-y-[-2px]">📱</button>
            <button className="share-btn bg-white-opacity-10 border border-white-opacity-20 text-[#e8e8e8] p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-gold-300-opacity-20 hover:border-[#d4af37] hover:translate-y-[-2px]">📘</button>
            <button className="share-btn bg-white-opacity-10 border border-white-opacity-20 text-[#e8e8e8] p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-gold-300-opacity-20 hover:border-[#d4af37] hover:translate-y-[-2px]">🔗</button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;