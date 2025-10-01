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
import { useBlogPosts, useBlogMetadata, BlogPost } from '../hooks/useBlogData';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'published_at' | 'views' | 'likes_count'>('published_at');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const { posts, totalCount, loading, error, refetch } = useBlogPosts({
    limit: postsPerPage,
    offset: (currentPage - 1) * postsPerPage,
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    sortBy,
    sortOrder: 'desc'
  });

  const { categories, tags, loading: metadataLoading } = useBlogMetadata();

  // Featured posts (first 3 posts when on first page with no filters)
  const { posts: featuredPosts } = useBlogPosts({
    limit: 3,
    offset: 0,
    sortBy: 'is_featured',
    sortOrder: 'desc'
  });

  const totalPages = Math.ceil(totalCount / postsPerPage);
  const showFeaturedPosts = currentPage === 1 && !searchQuery && !selectedCategory;

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, sortBy]);

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
              Zoroastervers Blog
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
        {showFeaturedPosts && featuredPosts.length > 0 && (
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
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs">{category.posts_count}</span>
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { key: 'published_at', label: 'Latest Posts', icon: Calendar },
                    { key: 'views', label: 'Most Viewed', icon: Eye },
                    { key: 'likes_count', label: 'Most Liked', icon: TrendingUp }
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

              {/* Popular Tags */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 8).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      {tag.name}
                      <span className="text-xs">({tag.posts_count})</span>
                    </span>
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
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Error loading posts</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button 
                  onClick={refetch}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
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
                {/* Results Info */}
                <div className="mb-8">
                  <p className="text-muted-foreground">
                    Showing {posts.length} of {totalCount.toLocaleString()} posts
                    {selectedCategory && ` in ${selectedCategory}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>

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
          {/* Category & Tags */}
          <div className="flex items-center gap-2 mb-3">
            {post.category_name && (
              <span 
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: `${post.category_color}20`, 
                  color: post.category_color 
                }}
              >
                {post.category_name}
              </span>
            )}
            {post.tag_names && post.tag_names.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

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