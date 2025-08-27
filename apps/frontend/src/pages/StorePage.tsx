import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid3X3, List, Star, Crown, Download, ShoppingCart, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductCard } from '@zoroaster/ui';
import type { Product } from '@zoroaster/shared'; // Ensure correct Product type is used

const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all'); // This will need to be re-evaluated based on actual file formats
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        // TODO: Display error message to user
      }
    };
    fetchProducts();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'bundles' && product.product_type === 'bundle') ||
        (selectedCategory === 'subscriptions' && (product.product_type === 'chapter_pass' || product.product_type === 'arc_pass')) ||
        (selectedCategory === 'single' && product.product_type === 'single_issue');
      
      // Re-evaluate format filtering based on actual file data from API
      const matchesFormat = selectedFormat === 'all'; // Placeholder for now
      
      const productPrice = product.prices && product.prices.length > 0 ? product.prices[0].unit_amount / 100 : 0;
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesFormat && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-low':
          const priceA = a.prices && a.prices.length > 0 ? a.prices[0].unit_amount : 0;
          const priceB = b.prices && b.prices.length > 0 ? b.prices[0].unit_amount : 0;
          return priceA - priceB;
        case 'price-high':
          const priceA_high = a.prices && a.prices.length > 0 ? a.prices[0].unit_amount : 0;
          const priceB_high = b.prices && b.prices.length > 0 ? b.prices[0].unit_amount : 0;
          return priceB_high - priceA_high;
        case 'title':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedFormat, priceRange, sortBy]);

  const handlePurchase = (productId: string) => {
    console.log('Product purchased:', productId);
    // Handle purchase logic here
  };

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'single', name: 'Single Issues', count: products.filter(p => p.product_type === 'single_issue').length },
    { id: 'bundles', name: 'Bundles', count: products.filter(p => p.product_type === 'bundle').length },
    { id: 'subscriptions', name: 'Subscriptions', count: products.filter(p => p.product_type === 'chapter_pass' || p.product_type === 'arc_pass').length }
  ];

  // Formats will need to be dynamically generated based on available files from API
  const formats = [
    { id: 'all', name: 'All Formats', count: products.length },
    // Add dynamic formats here based on API response
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-light to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-heading text-text-light mb-6">
            <span className="text-secondary">Zoroasterverse</span> Store
          </h1>
          <p className="text-xl text-text-light/80 max-w-3xl mx-auto leading-relaxed">
            Discover epic tales of magic, technology, and cosmic adventure. 
            From single volumes to complete collections, your journey awaits.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-4 text-text-light/60">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-secondary" />
                <span>Premium Content</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-accent" />
                <span>Multiple Formats</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-secondary" />
                <span>Exclusive Bundles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Search and Filters Bar */}
        <div className="bg-background-light/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-border/30">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
              <input
                type="text"
                placeholder="Search for books, series, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-background/50 rounded-xl p-1 border border-border/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-secondary text-background' 
                    : 'text-text-light hover:text-secondary'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-secondary text-background' 
                    : 'text-text-light hover:text-secondary'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Alphabetical</option>
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-text-light transition-all flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-border/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">Categories</label>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-secondary focus:ring-secondary"
                        />
                        <span className="text-text-light">{category.name}</span>
                        <span className="text-text-dark text-sm">({category.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Formats */}
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">Formats</label>
                  <div className="space-y-2">
                    {formats.map(format => (
                      <label key={format.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          value={format.id}
                          checked={selectedFormat === format.id}
                          onChange={(e) => setSelectedFormat(e.target.value)}
                          className="text-secondary focus:ring-secondary"
                        />
                        <span className="text-text-light">{format.name}</span>
                        <span className="text-text-dark text-sm">({format.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-background/50 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-text-dark">
                      <span>$0</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-text-light">
            Showing <span className="text-secondary font-medium">{filteredProducts.length}</span> of{' '}
            <span className="text-text-light">{products.length}</span> products
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-text-dark hover:text-text-light transition-colors"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map(product => (
              <div key={product.id} className={viewMode === 'list' ? 'bg-background-light/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30' : ''}>
                <ProductCard
                  product={product}
                  onPurchase={handlePurchase}
                  showCheckout={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-background-light/30 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-text-dark" />
            </div>
            <h3 className="text-2xl font-heading text-text-light mb-2">No products found</h3>
            <p className="text-text-dark mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedFormat('all');
                setPriceRange([0, 50]);
              }}
              className="px-6 py-3 bg-secondary text-background rounded-xl hover:bg-secondary-dark transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    
      </div>
    );
};

export default StorePage;