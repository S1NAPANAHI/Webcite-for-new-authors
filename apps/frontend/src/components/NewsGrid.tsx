import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { ArrowRight, Calendar, User, Clock, Eye, BookOpen, TrendingUp, Star, Plus } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  category?: string;
  category_name?: string;
  category_color?: string;
  tag_names?: string[];
  reading_time?: number;
  is_featured?: boolean;
}

// Sample posts that match your existing blog schema
const SAMPLE_POSTS: BlogPost[] = [
  {
    id: 'sample-1',
    title: 'The Ancient Wisdom of Zoroaster: A Journey Through Time',
    slug: 'ancient-wisdom-of-zoroaster',
    excerpt: 'Explore the profound teachings of Zoroaster and their relevance in modern times. Discover how ancient wisdom shapes our understanding.',
    content: 'The teachings of Zoroaster have shaped civilizations for over 3,000 years. In this comprehensive exploration, we delve into the core principles of Zoroastrianism.',
    featured_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
    author: 'Dr. Sarah Mirza',
    published_at: new Date().toISOString(),
    views: 1247,
    likes_count: 89,
    category: 'Philosophy',
    category_name: 'Philosophy',
    category_color: '#8b5cf6',
    tag_names: ['Philosophy', 'Religion', 'History'],
    reading_time: 8,
    is_featured: true
  },
  {
    id: 'sample-2',
    title: 'Sacred Fire Temples: Architecture of the Divine',
    slug: 'fire-temples-architecture',
    excerpt: 'An architectural journey through the sacred fire temples that have served as centers of worship for thousands of years.',
    content: 'Fire temples represent the heart of Zoroastrian worship. These sacred structures tell stories of devotion and architectural brilliance.',
    featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    author: 'Prof. Jamshid Rostami',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    views: 2156,
    likes_count: 134,
    category: 'Architecture',
    category_name: 'Architecture',
    category_color: '#f97316',
    tag_names: ['Architecture', 'Sacred Sites', 'Culture'],
    reading_time: 6,
    is_featured: false
  },
  {
    id: 'sample-3',
    title: 'The Gathas: Poetry of Divine Inspiration',
    slug: 'gathas-divine-poetry',
    excerpt: 'Dive into the beautiful hymns composed by Zoroaster himself, exploring their poetic structure and spiritual significance.',
    content: 'The Gathas represent the oldest part of the Avesta and contain the direct words of Zoroaster offering profound insights.',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    author: 'Dr. Farah Kermani',
    published_at: new Date(Date.now() - 172800000).toISOString(),
    views: 892,
    likes_count: 67,
    category: 'Scripture',
    category_name: 'Scripture',
    category_color: '#84cc16',
    tag_names: ['Scripture', 'Poetry', 'Theology'],
    reading_time: 5,
    is_featured: false
  }
];

export default function NewsGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 NewsGrid: Fetching latest blog posts using existing schema...');
      
      // Use your existing blog schema with the comprehensive view
      const { data, error } = await supabase
        .from('blog_posts_with_stats') // This view includes category and tag data
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error || !data || data.length === 0) {
        console.log('Using sample data for news grid');
        setPosts(SAMPLE_POSTS);
        setIsUsingSampleData(true);
      } else {
        console.log(`✅ Found ${data.length} real blog posts`);
        setPosts(data as BlogPost[]);
        setIsUsingSampleData(false);
      }
      
    } catch (err) {
      console.error('NewsGrid error, using sample data:', err);
      setPosts(SAMPLE_POSTS);
      setIsUsingSampleData(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const calculateReadTime = (content?: string, reading_time?: number) => {
    if (reading_time) return reading_time;
    if (!content) return 3;
    const words = content.split(/\s+/).length;
    return Math.max(Math.ceil(words / 200), 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading latest news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Info message for sample content */}
      {isUsingSampleData && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-900/20 border border-blue-600/30 rounded-lg px-4 py-2 text-blue-300 text-sm">
            <Plus className="w-4 h-4" />
            Sample content shown - 
            <Link to="/admin/content/blog/new" className="text-blue-200 hover:text-white underline font-medium">
              Create your first post
            </Link>
            to see real content!
          </div>
        </div>
      )}

      {/* Featured Latest Post */}
      {posts[0] && (
        <div className="relative">
          <div className="absolute top-6 left-6 z-10 flex gap-2">
            <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-full shadow-lg">
              ✨ LATEST
            </span>
            {posts[0].is_featured && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                <Star className="w-3 h-3 inline mr-1 fill-current" />
                FEATURED
              </span>
            )}
          </div>
          
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2">
                {posts[0].featured_image ? (
                  <img
                    src={posts[0].featured_image}
                    alt={posts[0].title}
                    className="w-full h-80 lg:h-96 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-80 lg:h-96 flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                    <BookOpen className="w-20 h-20 text-white opacity-80" />
                  </div>
                )}
              </div>
              
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <span 
                    className="px-3 py-1 text-sm font-semibold text-white rounded-full"
                    style={{ 
                      backgroundColor: posts[0].category_color || '#f59e0b'
                    }}
                  >
                    📁 {posts[0].category_name || posts[0].category || 'News'}
                  </span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                  {posts[0].title}
                </h3>
                
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {posts[0].excerpt}
                </p>
                
                {/* Tags */}
                {posts[0].tag_names && posts[0].tag_names.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {posts[0].tag_names.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs font-medium text-amber-200 bg-amber-900/30 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {posts[0].author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(posts[0].published_at)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {calculateReadTime(posts[0].content, posts[0].reading_time)}m read
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {posts[0].views || 0} views
                  </span>
                </div>
                
                <Link
                  to={isUsingSampleData ? `/blog` : `/blog/${posts[0].slug}`}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 group"
                >
                  Read Full Article
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Posts Grid */}
      {posts.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {posts.slice(1).map((post) => (
            <div key={post.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
              <div className="aspect-video relative overflow-hidden">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <BookOpen className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Category badge with your existing colors */}
                <div className="absolute top-4 left-4">
                  <span 
                    className="px-2 py-1 text-xs font-semibold text-white rounded-full"
                    style={{ 
                      backgroundColor: post.category_color || '#f59e0b'
                    }}
                  >
                    {post.category_name || post.category || 'News'}
                  </span>
                </div>
                
                {/* Featured badge */}
                {post.is_featured && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
                      <Star className="w-3 h-3 inline mr-1 fill-current" />
                      FEATURED
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-amber-300 transition-colors">
                  {post.title}
                </h4>
                
                <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                
                {/* Tags */}
                {post.tag_names && post.tag_names.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tag_names.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs text-amber-200 bg-amber-900/20 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.published_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views || 0}
                  </span>
                </div>
                
                <Link
                  to={isUsingSampleData ? `/blog` : `/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm group/link"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl text-lg group"
        >
          <TrendingUp className="w-5 h-5" />
          Explore All Articles
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <div className="mt-4">
          <p className="text-gray-400 text-sm">
            Latest {posts.length} articles from your blog
            {isUsingSampleData && (
              <span className="block mt-2 text-blue-400">
                💡 <Link to="/admin/content/blog/new" className="underline hover:text-blue-300 font-medium">
                  Create your first blog post
                </Link> to show your own content here
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}