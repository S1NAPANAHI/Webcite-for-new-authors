import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Book, GraduationCap, Shirt, Briefcase, Palette, 
  Music, Star, Filter, Search, ShoppingCart, Heart,
  Grid3X3, List, SlidersHorizontal
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  badges: string[];
  rating: number;
  reviewCount: number;
  description: string;
  isPhysical: boolean;
  language: string;
  previewAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

const StorePage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const categories: Category[] = [
    {
      id: 'all',
      name: 'All Products',
      icon: <Grid3X3 className="w-5 h-5" />,
      count: 47
    },
    {
      id: 'books',
      name: 'Books & Ebooks',
      icon: <Book className="w-5 h-5" />,
      count: 18
    },
    {
      id: 'courses',
      name: 'Courses',
      icon: <GraduationCap className="w-5 h-5" />,
      count: 12
    },
    {
      id: 'merchandise',
      name: 'Merchandise',
      icon: <Shirt className="w-5 h-5" />,
      count: 8
    },
    {
      id: 'services',
      name: 'Services',
      icon: <Briefcase className="w-5 h-5" />,
      count: 5
    },
    {
      id: 'digital-art',
      name: 'Digital Art',
      icon: <Palette className="w-5 h-5" />,
      count: 15
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: <Music className="w-5 h-5" />,
      count: 9
    }
  ];

  // Mock products for development
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'The Art of Creative Writing',
      price: 29.99,
      originalPrice: 39.99,
      category: 'books',
      badges: ['Popular'],
      rating: 4.8,
      reviewCount: 124,
      description: 'Master the fundamentals of creative writing with this comprehensive guide.',
      isPhysical: false,
      language: 'English',
      previewAvailable: true
    },
    {
      id: '2',
      title: 'Writing Masterclass',
      price: 79.99,
      category: 'courses',
      badges: ['New'],
      rating: 4.9,
      reviewCount: 87,
      description: 'Complete video course on advanced writing techniques.',
      isPhysical: false,
      language: 'English',
      previewAvailable: true
    },
    {
      id: '3',
      title: 'Author T-Shirt',
      price: 24.99,
      category: 'merchandise',
      badges: [],
      rating: 4.6,
      reviewCount: 45,
      description: 'High-quality cotton t-shirt with author branding.',
      isPhysical: true,
      language: 'N/A',
      previewAvailable: false
    }
  ];

  useEffect(() => {
    // Use mock data for now - replace with actual API call
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
        break;
      default:
        filtered.sort((a, b) => b.badges.length - a.badges.length);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, sortBy, selectedCategory, products]);

  const ProductCard = ({ product }: { product: Product }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setModalProduct(product)}
    >
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center mb-4">
        <div className="text-4xl opacity-40">
          {categories.find(c => c.id === product.category)?.icon}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
            {product.title}
          </h3>
          {product.badges.length > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {product.badges[0]}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <aside className="w-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 h-fit">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
                <span className="text-xs text-gray-500">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Filter</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>
    </aside>
  );

  const Modal = ({ product, onClose }: { product: Product, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{product.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
          
          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-6">
            <div className="text-6xl opacity-40">
              {categories.find(c => c.id === product.category)?.icon}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium text-gray-900 dark:text-white ml-1">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviewCount} reviews)
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Store</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {filteredProducts.length} products available
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="flex gap-8">
          <Sidebar />
          
          <main className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
        
        {modalProduct && <Modal product={modalProduct} onClose={() => setModalProduct(null)} />}
      </div>
    </div>
  );
};

export default StorePage;