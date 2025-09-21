import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Tag, 
  ChevronRight,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useLatestPosts } from '../hooks/useLatestPosts';
import { supabase } from '@zoroaster/shared';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  slug: string;
  tags?: string[];
  reading_time?: number;
}

interface BlogCategory {
  name: string;
  count: number;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    fetchBlogData();
  }, [currentPage, selectedCategory, sortBy, searchQuery]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);

      // Use mock data for now - replace with real Supabase queries later
      const mockPosts = getMockPosts();
      
      // Filter posts based on search and category
      let filteredPosts = [...mockPosts];
      
      if (searchQuery.trim()) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      if (selectedCategory) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags?.includes(selectedCategory)
        );
      }
      
      // Sort posts
      switch (sortBy) {
        case 'popular':
          filteredPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case 'trending':
          filteredPosts.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
          break;
        default:
          filteredPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      }
      
      // Paginate
      const startIndex = (currentPage - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      setPosts(paginatedPosts);
      setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
      
      // Set featured posts (first 3 posts when on first page with no filters)
      if (currentPage === 1 && !searchQuery && !selectedCategory) {
        setFeaturedPosts(mockPosts.slice(0, 3));
      } else {
        setFeaturedPosts([]);
      }
      
      // Generate categories from all posts
      const tagCounts: Record<string, number> = {};
      mockPosts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      
      const categoryList: BlogCategory[] = Object.entries(tagCounts)
        .map(([name, count]) => ({
          name,
          count,
          slug: name.toLowerCase().replace(/\s+/g, '-')
        }))
        .sort((a, b) => b.count - a.count);
      
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Zoroasterverse Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Dive deep into the rich mythology, characters, and stories that make up the Zoroasterverse. 
              Discover insights, updates, and behind-the-scenes content from our authors.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && currentPage === 1 && !searchQuery && !selectedCategory && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Categories Sidebar */}
          <aside className="lg:w-80">
            <div className="glass-card-strong rounded-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !selectedCategory 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  All Posts
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.name 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs">{category.count}</span>
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { key: 'latest', label: 'Latest Posts', icon: Calendar },
                    { key: 'popular', label: 'Most Viewed', icon: Eye },
                    { key: 'trending', label: 'Most Liked', icon: TrendingUp }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setSortBy(key as typeof sortBy)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        sortBy === key 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <BlogPostSkeleton key={index} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No blog posts available yet.'}
                </p>
              </div>
            ) : (
              <>
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Featured Post Card Component
function FeaturedPostCard({ post }: { post: BlogPost }) {
  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <article className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={post.featured_image || '/api/placeholder/600/400'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time || estimateReadingTime(post.content)} min read
            </div>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likes_count || 0}
              </div>
            </div>
            <span className="text-primary font-medium">Read More →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Regular Blog Post Card Component
function BlogPostCard({ post }: { post: BlogPost }) {
  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <article className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={post.featured_image || '/api/placeholder/400/250'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt || post.content.substring(0, 120) + '...'}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author || 'Zoroastervers'}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time || estimateReadingTime(post.content)} min
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likes_count || 0}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Loading Skeleton Component
function BlogPostSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-muted"></div>
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-16 bg-muted rounded-full"></div>
          <div className="h-6 w-20 bg-muted rounded-full"></div>
        </div>
        <div className="h-6 bg-muted rounded mb-3"></div>
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-4 w-16 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center" aria-label="Pagination">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-4 py-2 text-sm text-muted-foreground">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground bg-card border border-border hover:bg-muted'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

// Mock data for development
function getMockPosts(): BlogPost[] {
  return [
    {
      id: '1',
      title: 'The Ancient Wisdom of Zoroaster: A Journey Through Time',
      excerpt: 'Explore the profound teachings of Zoroaster and their relevance in modern times. Discover how ancient wisdom shapes our understanding of good versus evil.',
      content: 'The teachings of Zoroaster have shaped civilizations for over 3,000 years. In this comprehensive exploration, we delve into the core principles of Zoroastrianism and examine how these ancient beliefs continue to influence modern thought and spirituality. From the concept of free will to the eternal struggle between light and darkness, Zoroastrian philosophy offers profound insights into the human condition and our relationship with the divine.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Dr. Sarah Mirza',
      published_at: new Date(Date.now() - 86400000).toISOString(),
      views: 1247,
      likes_count: 89,
      comments_count: 23,
      slug: 'ancient-wisdom-of-zoroaster',
      tags: ['History', 'Philosophy', 'Religion'],
      reading_time: 8
    },
    {
      id: '2',
      title: 'Fire Temples: Sacred Architecture of the Zoroastrian Faith',
      excerpt: 'An architectural journey through the sacred fire temples that have served as centers of worship for thousands of years.',
      content: 'Fire temples represent the heart of Zoroastrian worship. These sacred structures, with their eternal flames, tell stories of devotion, community, and architectural brilliance spanning millennia. From the great fire of Yazd to the Atash Bahrams of Mumbai, each temple carries unique historical significance.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Prof. Jamshid Rostami',
      published_at: new Date(Date.now() - 172800000).toISOString(),
      views: 2156,
      likes_count: 134,
      comments_count: 67,
      slug: 'fire-temples-sacred-architecture',
      tags: ['Architecture', 'Sacred Sites', 'Culture'],
      reading_time: 12
    },
    {
      id: '3',
      title: 'The Gathas: Poetry of Divine Inspiration',
      excerpt: 'Dive into the beautiful hymns composed by Zoroaster himself, exploring their poetic structure and spiritual significance.',
      content: 'The Gathas represent the oldest part of the Avesta and contain the direct words of Zoroaster. These seventeen hymns offer profound insights into the prophet\'s teachings and relationship with Ahura Mazda. Their poetic beauty and theological depth continue to inspire scholars and believers alike.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Dr. Farah Kermani',
      published_at: new Date(Date.now() - 259200000).toISOString(),
      views: 892,
      likes_count: 67,
      comments_count: 31,
      slug: 'gathas-poetry-divine-inspiration',
      tags: ['Scripture', 'Poetry', 'Theology'],
      reading_time: 15
    },
    {
      id: '4',
      title: 'Modern Zoroastrian Communities Around the World',
      excerpt: 'Meet the vibrant Zoroastrian communities that keep ancient traditions alive in our modern world.',
      content: 'From Mumbai to Toronto, London to Tehran, Zoroastrian communities continue to thrive while preserving their ancient heritage. This article explores how modern Zoroastrians navigate tradition and contemporary life, maintaining their identity while contributing to diverse societies worldwide.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Reza Dalal',
      published_at: new Date(Date.now() - 345600000).toISOString(),
      views: 1683,
      likes_count: 203,
      comments_count: 89,
      slug: 'modern-zoroastrian-communities',
      tags: ['Community', 'Modern Life', 'Global'],
      reading_time: 10
    },
    {
      id: '5',
      title: 'The Symbolism of Light and Darkness in Zoroastrian Thought',
      excerpt: 'Understanding the fundamental dualism that forms the core of Zoroastrian theology and its impact on world religions.',
      content: 'The eternal struggle between light and darkness, good and evil, forms the foundation of Zoroastrian thought. This exploration examines how this dualistic worldview has influenced major world religions and philosophical systems, from Christianity to Buddhism.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Prof. Cyrus Bahram',
      published_at: new Date(Date.now() - 432000000).toISOString(),
      views: 756,
      likes_count: 45,
      comments_count: 18,
      slug: 'symbolism-light-darkness',
      tags: ['Theology', 'Symbolism', 'Philosophy'],
      reading_time: 7
    },
    {
      id: '6',
      title: 'Celebrations and Festivals: The Zoroastrian Calendar',
      excerpt: 'Discover the rich tradition of Zoroastrian festivals and celebrations that mark the passage of seasons and spiritual milestones.',
      content: 'The Zoroastrian calendar is filled with meaningful celebrations that connect believers to the natural world and spiritual realm. From Nowruz to the six seasonal festivals, each celebration carries deep significance and brings communities together in joyous observance.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Shireen Irani',
      published_at: new Date(Date.now() - 518400000).toISOString(),
      views: 1124,
      likes_count: 78,
      comments_count: 42,
      slug: 'celebrations-festivals-calendar',
      tags: ['Festivals', 'Culture', 'Traditions'],
      reading_time: 9
    },
    {
      id: '7',
      title: 'Women in Zoroastrianism: Equality and Spiritual Leadership',
      excerpt: 'Exploring the progressive role of women in Zoroastrian society and their contributions to the faith throughout history.',
      content: 'Zoroastrianism has long recognized the spiritual equality of women and men. This article examines the roles of women as priests, scholars, and community leaders, highlighting their significant contributions to preserving and advancing the faith across generations.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Dr. Dina Mehta',
      published_at: new Date(Date.now() - 604800000).toISOString(),
      views: 934,
      likes_count: 112,
      comments_count: 56,
      slug: 'women-in-zoroastrianism',
      tags: ['Gender Studies', 'History', 'Leadership'],
      reading_time: 11
    },
    {
      id: '8',
      title: 'The Avesta: Understanding Zoroastrian Sacred Texts',
      excerpt: 'A comprehensive guide to the Avesta, the primary collection of religious texts of Zoroastrianism.',
      content: 'The Avesta comprises the religious texts of Zoroastrianism, composed in the Avestan language. This guide explores the structure, content, and significance of these sacred writings, from the Yasna to the Yashts, providing insight into Zoroastrian liturgy and belief.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Prof. Ardashir Mistri',
      published_at: new Date(Date.now() - 691200000).toISOString(),
      views: 678,
      likes_count: 34,
      comments_count: 19,
      slug: 'avesta-sacred-texts',
      tags: ['Scripture', 'Language', 'Literature'],
      reading_time: 13
    },
    {
      id: '9',
      title: 'Environmental Ethics in Zoroastrian Teaching',
      excerpt: 'How ancient Zoroastrian principles align with modern environmental consciousness and sustainability.',
      content: 'Zoroastrianism\'s emphasis on the purity of the elements - earth, water, fire, and air - provides a foundation for environmental stewardship that feels remarkably contemporary. This article explores how these ancient teachings can guide modern environmental action.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Dr. Kaveh Farrokh',
      published_at: new Date(Date.now() - 777600000).toISOString(),
      views: 1456,
      likes_count: 167,
      comments_count: 73,
      slug: 'environmental-ethics-teaching',
      tags: ['Environment', 'Ethics', 'Modern Life'],
      reading_time: 6
    }
  ];
}