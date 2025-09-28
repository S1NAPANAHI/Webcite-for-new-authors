import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Star, Eye, Book, Scroll, Crown } from 'lucide-react';
import { useAuth } from '@zoroaster/shared/hooks/useAuth';
import { Database } from '../lib/database.types';
import { ProductCard } from '../components/shop/ProductCard';
import { CartProvider } from '../contexts/CartContext';
import { LoadingSkeleton } from '../components/shop/LoadingSkeleton';
import { ShoppingCart as CartSidebar } from '../components/shop/ShoppingCart';
import { supabase } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductWithVariants = Product & {
  product_variants: Database['public']['Tables']['product_variants']['Row'][];
  product_reviews: { rating: number }[];
};

interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  productType: string;
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'title' | 'rating';
  viewMode: 'grid' | 'list';
}

function StorePageContent() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    priceRange: [0, 100],
    productType: 'all',
    sortBy: 'newest',
    viewMode: 'grid'
  });

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants(*),
            product_reviews(rating)
          `)
          .eq('status', 'published')
          .eq('is_available', true)
          .eq('active', true);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Product type filter
      if (filters.productType !== 'all' && product.product_type !== filters.productType) {
        return false;
      }

      // Price filter (using first variant price or default)
      const productPrice = product.product_variants[0]?.price_amount || product.price_cents || 0;
      const priceInDollars = productPrice / 100;
      if (priceInDollars < filters.priceRange[0] || priceInDollars > filters.priceRange[1]) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price_low':
          const priceA = (a.product_variants[0]?.price_amount || a.price_cents || 0);
          const priceB = (b.product_variants[0]?.price_amount || b.price_cents || 0);
          return priceA - priceB;
        case 'price_high':
          const priceA2 = (a.product_variants[0]?.price_amount || a.price_cents || 0);
          const priceB2 = (b.product_variants[0]?.price_amount || b.price_cents || 0);
          return priceB2 - priceA2;
        case 'title':
          return a.name.localeCompare(b.name);
        case 'rating':
          const avgA = a.product_reviews.length ? a.product_reviews.reduce((sum, r) => sum + r.rating, 0) / a.product_reviews.length : 0;
          const avgB = b.product_reviews.length ? b.product_reviews.reduce((sum, r) => sum + r.rating, 0) / b.product_reviews.length : 0;
          return avgB - avgA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ Error Loading Store</div>
          <p className="text-slate-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section - Persian Mythology Themed */}
      <div className="relative overflow-hidden border-b border-amber-500/20">
        {/* Sacred Fire Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-radial from-amber-500/30 to-transparent rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-radial from-red-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-gradient-radial from-amber-400/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-amber-500/25">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              Sacred Treasury
            </h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-slate-200 mb-4 font-light">
              <span className="text-amber-400">Zoroasterverse</span> Digital Collection
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Discover epic tales of <span className="text-amber-400">ancient wisdom</span>, 
              cosmic adventures, and the eternal battle between <span className="text-red-400">light</span> and <span className="text-slate-400">darkness</span>.
              Immerse yourself in Persian mythology brought to life through modern storytelling.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mt-8 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Book className="w-4 h-4" />
              <span>{products.length} Products</span>
            </div>
            <div className="flex items-center space-x-2">
              <Scroll className="w-4 h-4" />
              <span>Digital Library</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Premium Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters Bar */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for books, guides, or content..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
              />
            </div>

            {/* Product Type Filter */}
            <select
              value={filters.productType}
              onChange={(e) => setFilters(prev => ({ ...prev, productType: e.target.value }))}
              className="px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
            >
              <option value="all">All Types</option>
              <option value="book">Books</option>
              <option value="guide">Guides</option>
              <option value="bundle">Bundles</option>
              <option value="subscription">Subscriptions</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
              className="px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="title">Title A-Z</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-800/50 rounded-xl border border-slate-600/50 p-1">
              <button
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                className={`p-2 rounded-lg transition-all ${
                  filters.viewMode === 'grid'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
                className={`p-2 rounded-lg transition-all ${
                  filters.viewMode === 'list'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-slate-400">
            <span className="text-slate-200">{filteredProducts.length}</span> products found
            {filters.search && (
              <span> for "<span className="text-amber-400">{filters.search}</span>"
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="ml-2 text-red-400 hover:text-red-300 text-sm underline"
                >
                  Clear
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            filters.viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={filters.viewMode}
                user={user}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">No products found</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to discover more of our Zoroasterverse collection.
            </p>
            <button
              onClick={() => setFilters({
                search: '',
                category: 'all',
                priceRange: [0, 100],
                productType: 'all',
                sortBy: 'newest',
                viewMode: 'grid'
              })}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Shopping Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}

export default function StorePage() {
  return (
    <CartProvider>
      <StorePageContent />
    </CartProvider>
  );
}