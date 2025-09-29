import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Crown, Book, GraduationCap, Shirt, Briefcase, Palette, 
  Music, Star, Filter, Search, ShoppingCart, Heart,
  Flame, Sparkles, Award, TrendingUp, Users, Gift,
  Grid3X3, List, ChevronDown, SlidersHorizontal
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  image?: string;
  badges: string[];
  rating: number;
  reviewCount: number;
  description: string;
  isPhysical: boolean;
  difficultyLevel?: string;
  language: string;
  relatedCharacters: string[];
  previewAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  subcategories: string[];
  featured?: string;
}

const EnhancedStorePage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userTier, setUserTier] = useState<string>('initiate');
  const [sacredFirePoints, setSacredFirePoints] = useState<number>(0);

  const categories: Category[] = [
    {
      id: 'all',
      name: 'All Sacred Treasures',
      icon: <Flame className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-600',
      count: 47,
      subcategories: [],
      featured: 'Complete Collection'
    },
    {
      id: 'literature',
      name: 'Digital Literature',
      icon: <Book className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-600',
      count: 18,
      subcategories: ['Novels', 'Short Stories', 'Poetry', 'Character Guides'],
      featured: 'Fire Temple Chronicles'
    },
    {
      id: 'learning',
      name: 'Learning Academy',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-600',
      count: 12,
      subcategories: ['Writing Courses', 'Language', 'History', 'Mythology'],
      featured: 'Persian Writing Masterclass'
    },
    {
      id: 'merchandise',
      name: 'Sacred Merchandise',
      icon: <Shirt className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-600',
      count: 8,
      subcategories: ['Apparel', 'Accessories', 'Art Prints', 'Home Decor'],
      featured: 'Ahura Mazda T-Shirt'
    },
    {
      id: 'services',
      name: 'Professional Services',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-600',
      count: 5,
      subcategories: ['Editing', 'Cover Design', 'Coaching', 'Research'],
      featured: 'Mythology Consultation'
    },
    {
      id: 'digital-art',
      name: 'Digital Assets',
      icon: <Palette className="w-5 h-5" />,
      color: 'from-rose-500 to-red-600',
      count: 15,
      subcategories: ['Character Art', 'Backgrounds', 'Icons', 'Templates'],
      featured: 'Zarathustra Portrait Set'
    },
    {
      id: 'audio',
      name: 'Audio Experience',
      icon: <Music className="w-5 h-5" />,
      color: 'from-yellow-500 to-amber-600',
      count: 9,
      subcategories: ['Audiobooks', 'Meditation', 'Pronunciation', 'Soundscapes'],
      featured: 'Epic Persian Soundscape'
    }
  ];

  const tierBenefits = {
    initiate: { discount: 0, multiplier: 1.0, badge: '🔰', name: 'Initiate' },
    devotee: { discount: 10, multiplier: 1.1, badge: '⭐', name: 'Devotee' },
    guardian: { discount: 20, multiplier: 1.2, badge: '🛡️', name: 'Guardian' },
    fire_keeper: { discount: 30, multiplier: 1.5, badge: '🔥', name: 'Fire Keeper' }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const query = new URLSearchParams();
      if (selectedCategory !== 'all') {
        query.append('category', selectedCategory);
      }
      const response = await fetch(`/api/products?${query.toString()}`);
      const data = await response.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
    };

    const fetchUserLoyalty = async () => {
      const response = await fetch('/api/user/loyalty');
      const data = await response.json();
      setUserTier(data.current_tier);
      setSacredFirePoints(data.sacred_fire_points);
    };

    fetchProducts();
    fetchUserLoyalty();
  }, [selectedCategory]);

  // Filter products based on selected criteria
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.relatedCharacters.some(char => 
          char.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Would sort by creation date in real implementation
        break;
      default: // featured
        filtered.sort((a, b) => b.badges.length - a.badges.length);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, priceRange, sortBy, products]);

  const getBadgeStyle = (badge: string) => {
    const badgeStyles = {
      'Bestseller': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900',
      'Award Winner': 'bg-gradient-to-r from-purple-400 to-purple-600 text-white',
      'New': 'bg-gradient-to-r from-green-400 to-green-600 text-white',
      'Staff Pick': 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
      'Limited Edition': 'bg-gradient-to-r from-red-400 to-red-600 text-white',
      'Professional': 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white',
      'Digital': 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white',
      'Relaxing': 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white'
    };
    return badgeStyles[badge as keyof typeof badgeStyles] || 'bg-gray-200 text-gray-800';
  };

  const calculateDiscountedPrice = (price: number) => {
    const discount = tierBenefits[userTier as keyof typeof tierBenefits].discount;
    return price * (1 - discount / 100);
  };

  const SacredFireOrb = ({ size = 'w-2 h-2' }: { size?: string }) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-amber-300 to-orange-500 animate-pulse shadow-lg shadow-amber-500/50`} />
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-6xl opacity-20">
          {categories.find(cat => cat.id === product.category)?.icon}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badges.map(badge => (
            <span key={badge} className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(badge)}`}>
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* Preview Button */}
        {product.previewAvailable && (
          <div className="absolute bottom-3 right-3">
            <button className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-full transition-colors">
              Preview
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {product.subcategory}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Related Characters */}
        {product.relatedCharacters.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.relatedCharacters.slice(0, 2).map(character => (
                <span key={character} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">
                  {character}
                </span>
              ))}
              {product.relatedCharacters.length > 2 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                  +{product.relatedCharacters.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {tierBenefits[userTier as keyof typeof tierBenefits].discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-amber-600">
                  ${calculateDiscountedPrice(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-lg text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-green-600 font-semibold">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            Add to Cart
          </button>
        </div>

        {/* Physical Product Indicator */}
        {product.isPhysical && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Physical product - shipping required
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      {/* Sacred Fire Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20">
          <SacredFireOrb size="w-3 h-3" />
        </div>
        <div className="absolute top-40 right-32 animation-delay-1000">
          <SacredFireOrb size="w-2 h-2" />
        </div>
        <div className="absolute bottom-32 left-40 animation-delay-2000">
          <SacredFireOrb size="w-4 h-4" />
        </div>
        <div className="absolute bottom-20 right-20 animation-delay-3000">
          <SacredFireOrb size="w-3 h-3" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="w-12 h-12 text-yellow-300" />
              <h1 className="text-5xl font-bold">Sacred Treasury</h1>
              <Crown className="w-12 h-12 text-yellow-300" />
            </div>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Discover epic tales of ancient wisdom, cosmic adventures, and the eternal battle between 
              <span className="font-semibold text-yellow-200"> light </span> and 
              <span className="font-semibold text-red-200"> darkness</span>.
            </p>

            {/* User Status */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-2xl">{tierBenefits[userTier as keyof typeof tierBenefits].badge}</span>
                <span className="font-semibold">{tierBenefits[userTier as keyof typeof tierBenefits].name}</span>
                {tierBenefits[userTier as keyof typeof tierBenefits].discount > 0 && (
                  <span className="text-yellow-200">• {tierBenefits[userTier as keyof typeof tierBenefits].discount}% OFF</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Flame className="w-5 h-5 text-amber-300" />
                <span className="font-semibold">{sacredFirePoints} Sacred Fire Points</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-200">47</div>
                <div className="text-sm opacity-80">Digital Treasures</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-200">7</div>
                <div className="text-sm opacity-80">Sacred Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-200">1.2K+</div>
                <div className="text-sm opacity-80">Happy Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-200">4.8⭐</div>
                <div className="text-sm opacity-80">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="text-xs opacity-75">({category.count})</span>
                </button>
              ))}
            </div>

            {/* Search and Controls */}
            <div className="flex items-center gap-3 ml-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search treasures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'} transition-colors`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'} transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">$0</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1 accent-amber-500"
                    />
                    <span className="text-sm text-gray-500">$100+</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Up to ${priceRange[1]}</div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Type</label>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold">
                      Digital
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      Physical
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500">
                    <option value="all">All Languages</option>
                    <option value="english">English</option>
                    <option value="persian">Persian</option>
                    <option value="avestan">Avestan</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' 
                ? 'All Sacred Treasures' 
                : categories.find(cat => cat.id === selectedCategory)?.name
              }
            </h2>
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} treasures
              {searchQuery && (
                <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                  "{searchQuery}"
                </span>
              )}
            </p>
          </div>

          {/* Featured Category Info */}
          {selectedCategory !== 'all' && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Featured Product</div>
              <div className="font-semibold text-amber-600">
                {categories.find(cat => cat.id === selectedCategory)?.featured}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 mb-12 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No treasures found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms to discover more sacred content.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange([0, 100]);
                setSortBy('featured');
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Sacred Fire Blessing */}
        <div className="text-center py-12 border-t border-gray-200 mt-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SacredFireOrb size="w-3 h-3" />
            <Flame className="w-8 h-8 text-amber-500" />
            <SacredFireOrb size="w-3 h-3" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            🔥 May the Sacred Fire Light Your Path 🔥
          </h3>
          <p className="text-lg text-gray-600 italic">
            "Good Thoughts, Good Words, Good Deeds" - Zarathustra
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStorePage;