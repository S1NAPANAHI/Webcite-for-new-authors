import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Clock, 
  ArrowLeft,
  Tag,
  ThumbsUp
} from 'lucide-react';
import { supabase } from '@zoroaster/shared';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  author?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  tags?: string[];
  reading_time?: number;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use mock data - replace with Supabase query later
      const mockPost = getMockPostBySlug(slug!);
      
      if (!mockPost) {
        setError('Post not found');
        return;
      }

      setPost(mockPost);

      // Get related posts (other posts with similar tags)
      if (mockPost.tags && mockPost.tags.length > 0) {
        const allMockPosts = getMockPosts();
        const related = allMockPosts
          .filter(p => 
            p.id !== mockPost.id && 
            p.tags?.some(tag => mockPost.tags?.includes(tag))
          )
          .slice(0, 3);
        
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    const newLikesCount = (post.likes_count || 0) + (isLiked ? -1 : 1);
    setPost({ ...post, likes_count: newLikesCount });
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="aspect-video bg-muted rounded-2xl mb-8"></div>
            <div className="h-12 bg-muted rounded mb-4"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author || 'Zoroastervers Team'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time || estimateReadingTime(post.content)} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{(post.views || 0).toLocaleString()} views</span>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes_count || 0}</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments_count || 0}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-foreground leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group">
                  <article className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={relatedPost.featured_image || '/api/placeholder/300/200'}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {relatedPost.views || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {relatedPost.likes_count || 0}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

// Mock data functions
function getMockPosts(): BlogPost[] {
  return [
    {
      id: '1',
      title: 'The Ancient Wisdom of Zoroaster: A Journey Through Time',
      excerpt: 'Explore the profound teachings of Zoroaster and their relevance in modern times.',
      content: 'The teachings of Zoroaster have shaped civilizations for over 3,000 years. In this comprehensive exploration, we delve into the core principles of Zoroastrianism and examine how these ancient beliefs continue to influence modern thought and spirituality.\n\nFrom the concept of free will to the eternal struggle between light and darkness, Zoroastrian philosophy offers profound insights into the human condition and our relationship with the divine. The prophet Zoroaster, also known as Zarathustra, lived sometime between 628-551 BCE in ancient Persia, and his teachings formed the foundation of one of the world\'s oldest monotheistic religions.\n\nThe core principle of "Good Thoughts, Good Words, Good Deeds" (Humata, Hukhta, Hvarshta) remains as relevant today as it was over three millennia ago. This ethical framework provides a simple yet profound guide for living a righteous life, emphasizing the power of individual choice in the cosmic battle between good and evil.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Dr. Sarah Mirza',
      published_at: new Date(Date.now() - 86400000).toISOString(),
      views: 1247,
      likes_count: 89,
      comments_count: 23,
      tags: ['History', 'Philosophy', 'Religion'],
      reading_time: 8
    },
    {
      id: '2',
      title: 'Fire Temples: Sacred Architecture of the Zoroastrian Faith',
      excerpt: 'An architectural journey through the sacred fire temples that have served as centers of worship.',
      content: 'Fire temples represent the heart of Zoroastrian worship. These sacred structures, with their eternal flames, tell stories of devotion, community, and architectural brilliance spanning millennia.\n\nFrom the great fire of Yazd to the Atash Bahrams of Mumbai, each temple carries unique historical significance. The eternal flames housed within these sacred spaces have burned continuously for centuries, some for over a thousand years, representing the eternal light of Ahura Mazda.\n\nThe architecture of fire temples reflects both practical needs and spiritual symbolism. The inner sanctum, where the sacred fire burns, is carefully designed to maintain purity while allowing the faithful to offer prayers and make offerings.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Prof. Jamshid Rostami',
      published_at: new Date(Date.now() - 172800000).toISOString(),
      views: 2156,
      likes_count: 134,
      comments_count: 67,
      tags: ['Architecture', 'Sacred Sites', 'Culture'],
      reading_time: 12
    }
    // Add more mock posts as needed
  ];
}

function getMockPostBySlug(slug: string): BlogPost | null {
  const posts = getMockPosts();
  return posts.find(post => post.slug === slug) || null;
}