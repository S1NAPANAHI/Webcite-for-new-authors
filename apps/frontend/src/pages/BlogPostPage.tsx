import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Eye, 
  MessageCircle,
  Bookmark,
  Tag,
  ExternalLink
} from 'lucide-react';
// Import CSS for proper paragraph spacing
import '../styles/chapter-content.css';
// Import the BlogCoverImage component for proper cropping support
import BlogCoverImage from '../components/blog/BlogCoverImage';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_url?: string;
  cover_crop_settings?: any; // JSON crop settings
  featured_image?: string;
  author?: string;
  status?: string;
  published_at: string;
  created_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  tags?: string[];
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
      // Update page title and meta
      document.title = post.meta_title || `${post.title} | Zoroastervers Blog`;
      if (post.meta_description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', post.meta_description);
        }
      }
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching blog post with slug: ${slug}`);
      
      // FIXED: Fetch post by slug including crop settings
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('❌ Error fetching post:', error);
        if (error.code === 'PGRST116') {
          setError('Post not found');
        } else {
          throw error;
        }
        return;
      }

      if (!data) {
        setError('Post not found');
        return;
      }

      console.log('✅ Post found:', data);
      console.log('🎨 Cover crop settings:', data.cover_crop_settings);

      // Process post data
      let tags = [];
      try {
        if (typeof data.tags === 'string' && data.tags.startsWith('[')) {
          tags = JSON.parse(data.tags);
        } else if (Array.isArray(data.tags)) {
          tags = data.tags;
        } else if (typeof data.tags === 'string' && data.tags) {
          tags = [data.tags];
        }
      } catch {
        tags = [];
      }

      // Process content
      let content = data.content;
      try {
        if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('"'))) {
          content = JSON.parse(content);
        }
      } catch {
        // Keep as string if parsing fails
      }

      // FIXED: Process crop settings
      let cropSettings = null;
      if (data.cover_crop_settings) {
        try {
          cropSettings = typeof data.cover_crop_settings === 'string' 
            ? JSON.parse(data.cover_crop_settings)
            : data.cover_crop_settings;
          console.log('✂️ Parsed crop settings:', cropSettings);
        } catch (err) {
          console.warn('⚠️ Failed to parse crop settings:', err);
          cropSettings = null;
        }
      }

      const processedPost = {
        ...data,
        tags,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        views: (data.views || 0) + 1, // Increment view count
        author: data.author || 'Zoroastervers Team',
        cover_url: data.cover_url || data.featured_image, // Use cover_url as primary
        cover_crop_settings: cropSettings,
        featured_image: data.cover_url || data.featured_image // For compatibility
      };

      setPost(processedPost);

      // Increment view count in database
      await supabase
        .from('blog_posts')
        .update({ views: processedPost.views })
        .eq('id', data.id);

      console.log('✅ Post loaded and view count updated');
      console.log('🖼️ Cover URL:', processedPost.cover_url);
      console.log('✂️ Crop settings applied:', !!cropSettings);

    } catch (err) {
      console.error('❌ Error in fetchPost:', err);
      setError('Failed to load post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    if (!post || !post.tags || post.tags.length === 0) return;

    try {
      console.log('🔍 Fetching related posts...');
      
      // FIXED: Also fetch crop settings for related posts
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_url, cover_crop_settings, featured_image, author, published_at, views')
        .eq('status', 'published')
        .neq('id', post.id)
        .limit(3);

      if (error) throw error;

      if (data && data.length > 0) {
        setRelatedPosts(data.map(p => ({
          ...p,
          cover_url: p.cover_url || p.featured_image,
          featured_image: p.cover_url || p.featured_image // For compatibility
        })));
        console.log(`✅ Found ${data.length} related posts`);
      }
    } catch (err) {
      console.error('❌ Error fetching related posts:', err);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      const newLikesCount = (post.likes_count || 0) + (liked ? -1 : 1);
      
      await supabase
        .from('blog_posts')
        .update({ likes_count: newLikesCount })
        .eq('id', post.id);

      setPost(prev => prev ? { ...prev, likes_count: newLikesCount } : null);
      setLiked(!liked);
      
      console.log(`${liked ? '💔' : '❤️'} Post ${liked ? 'unliked' : 'liked'}`);
    } catch (error) {
      console.error('❌ Error updating like:', error);
    }
  };

  const handleShare = async () => {
    if (!post) return;

    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt || `Read "${post.title}" on Zoroastervers Blog`,
        url: window.location.href
      });
      console.log('📤 Post shared successfully');
    } catch (error) {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('✅ Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('❌ Error sharing:', error);
        alert('❌ Could not share. Please copy the URL manually.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    if (!content) return 1;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  // FIXED: HTML sanitization function to clean up content
  const sanitizeHtml = (html: string): string => {
    if (!html) return '';
    
    // Remove empty paragraph tags
    let cleaned = html.replace(/<p>\s*<\/p>/gi, '');
    
    // Remove consecutive empty tags
    cleaned = cleaned.replace(/(<p><\/p>\s*)+/gi, '');
    
    // Ensure proper paragraph structure
    cleaned = cleaned.replace(/<div>/gi, '<p>').replace(/<\/div>/gi, '</p>');
    
    return cleaned.trim();
  };

  // FIXED: Proper HTML content rendering
  const renderHtmlContent = (content: string) => {
    // Sanitize the HTML content
    const sanitizedContent = sanitizeHtml(content);
    
    return (
      <div 
        className="chapter-content-render"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto transition-colors">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Post Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                {error || 'The blog post you\'re looking for doesn\'t exist or has been removed.'}
              </p>
              <div className="space-y-3">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
                <div>
                  <Link
                    to="/admin/content/blog"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Go to Admin Panel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Post header */}
        <header className="mb-8">
          {/* Featured badge */}
          {post.is_featured && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 rounded-full transition-colors">
                ⭐ Featured Post
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed transition-colors">
              {post.excerpt}
            </p>
          )}

          {/* ✅ FIXED: Post metadata with better spacing */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 pb-6 border-b dark:border-gray-700 transition-colors">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{post.author}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {calculateReadTime(post.content)} min read
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {post.views || 0} views
            </span>
          </div>
        </header>

        {/* ✅ FIXED: Cover image with proper cropping support */}
        {post.cover_url && (
          <div className="mb-8">
            <BlogCoverImage 
              blogPost={{
                title: post.title,
                slug: post.slug,
                cover_url: post.cover_url,
                cover_crop_settings: post.cover_crop_settings
              }}
              size="hero"
              priority={true}
              className="rounded-xl overflow-hidden shadow-lg"
              showPlaceholder={true}
            />
            
            {/* Optional: Show crop indicator in development */}
            {process.env.NODE_ENV === 'development' && post.cover_crop_settings && (
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                ✂️ Image displayed with 16:9 cropping applied
              </div>
            )}
          </div>
        )}

        {/* FIXED: Post content with proper HTML rendering and CSS classes */}
        <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
          <div className="leading-relaxed transition-colors text-gray-900 dark:text-gray-100">
            {renderHtmlContent(post.content)}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Engagement buttons with dark mode */}
        <div className="flex items-center justify-between py-6 border-t border-b dark:border-gray-700 mb-8 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked
                  ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              {post.likes_count || 0}
            </button>
            
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                bookmarked
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              Save
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
            <span>{post.views || 0} views</span>
          </div>
        </div>

        {/* ✅ FIXED: Related posts with cropping support */}
        {relatedPosts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Related Posts</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border dark:border-gray-700"
                >
                  {/* Use BlogCoverImage for related posts too */}
                  {relatedPost.cover_url && (
                    <div className="aspect-video overflow-hidden">
                      <BlogCoverImage 
                        blogPost={{
                          title: relatedPost.title,
                          slug: relatedPost.slug || '',
                          cover_url: relatedPost.cover_url,
                          cover_crop_settings: relatedPost.cover_crop_settings
                        }}
                        size="medium"
                        className="group-hover:scale-105 transition-transform duration-200"
                        showPlaceholder={false}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h4>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 transition-colors">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      <span>{relatedPost.author}</span>
                      <span>•</span>
                      <span>{relatedPost.views || 0} views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div className="text-center pt-8 border-t dark:border-gray-700 transition-colors">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Posts
          </Link>
        </div>
      </article>
    </div>
  );
}