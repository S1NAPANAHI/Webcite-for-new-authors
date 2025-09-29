import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Crown, Book, GraduationCap, Shirt, Briefcase, Palette, 
  Music, Star, Filter, Search, ShoppingCart, Heart,
  Flame, Sparkles, Award, TrendingUp, Users, Gift,
  Grid3X3, List, ChevronDown, SlidersHorizontal
} from 'lucide-react';
import '../styles/store.css';

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
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

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

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.relatedCharacters && product.relatedCharacters.some(char => 
          char.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

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
  }, [searchQuery, priceRange, sortBy, products]);

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="product-card" onClick={() => setModalProduct(product)}>
        <div className="product-image">
            <span className="text-4xl">{categories.find(c => c.id === product.category)?.icon}</span>
            <div className="product-badges">
                {product.badges.map(badge => (
                    <span key={badge} className={`badge-persian ${badge.toLowerCase().replace(' ', '-')}`}>{badge}</span>
                ))}
            </div>
        </div>
        <div className="product-info">
            <h3 className="product-title">{product.title}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-rating">
                <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
                <span className="rating-text">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
            {product.relatedCharacters && (
                <div className="product-characters">
                    {product.relatedCharacters.map(char => (
                        <span key={char} className="character-tag">{char}</span>
                    ))}
                </div>
            )}
            <div className="product-footer">
                <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
                </div>
                <div className="product-actions">
                    <button className="action-btn wishlist-action">🤍</button>
                    <button className="action-btn cart-action">Add to Cart</button>
                </div>
            </div>
        </div>
    </div>
  );

  const Modal = ({ product, onClose }: { product: Product, onClose: () => void }) => (
    <div className="modal">
        <div className="modal-content">
            <span className="modal-close" onClick={onClose}>&times;</span>
            <div className="modal-body">
                <div className="product-modal-content">
                    <div className="modal-product-image">
                        <span className="text-6xl">{categories.find(c => c.id === product.category)?.icon}</span>
                        <div className="product-badges">
                            {product.badges.map(badge => (
                                <span key={badge} className={`badge-persian ${badge.toLowerCase().replace(' ', '-')}`}>{badge}</span>
                            ))}
                        </div>
                    </div>
                    <div className="modal-product-info">
                        <h2 className="modal-product-title">{product.title}</h2>
                        <div className="modal-product-category">{product.category}</div>
                        <div className="product-rating">
                            <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
                            <span className="rating-text">{product.rating} ({product.reviewCount} reviews)</span>
                        </div>
                        <p className="modal-product-description">{product.description}</p>
                        {product.relatedCharacters && (
                            <div className="product-characters">
                                <strong>Characters:</strong>
                                {product.relatedCharacters.map(char => (
                                    <span key={char} className="character-tag">{char}</span>
                                ))}
                            </div>
                        )}
                        <div className="modal-product-footer">
                            <div className="product-price">
                                <span className="current-price">${product.price}</span>
                                {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
                            </div>
                            <div className="product-actions">
                                <button className="action-btn wishlist-action">🤍 Add to Wishlist</button>
                                <button className="action-btn cart-action">🛍️ Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white">
        <div className="sacred-fire-orbs">
            <div className="fire-orb orb-1"></div>
            <div className="fire-orb orb-2"></div>
            <div className="fire-orb orb-3"></div>
            <div className="fire-orb orb-4"></div>
            <div className="fire-orb orb-5"></div>
        </div>

import StoreSidebar from '../components/shop/StoreSidebar';

  return (
    <div className="bg-gray-900 text-white flex">
        <StoreSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userTier={userTier}
          sacredFirePoints={sacredFirePoints}
          tierBenefits={tierBenefits}
        />
        <div className="flex-1">
        <div className="sacred-fire-orbs">
            <div className="fire-orb orb-1"></div>
            <div className="fire-orb orb-2"></div>
            <div className="fire-orb orb-3"></div>
            <div className="fire-orb orb-4"></div>
            <div className="fire-orb orb-5"></div>
        </div>

        <section className="hero">
            <div className="hero-background"></div>
            <div className="container mx-auto">
                <div className="hero-content">
                    <h1 className="hero-title">Sacred Treasury</h1>
                    <p className="hero-subtitle">Good Thoughts, Good Words, Good Deeds</p>
                    <p className="hero-description">Discover treasures of ancient Persian wisdom in our sacred digital temple</p>
                    
                    <div className="loyalty-display">
                        <div className="tier-info">
                            <div className="current-tier">
                                <span className="tier-badge-large">{tierBenefits[userTier as keyof typeof tierBenefits].badge}</span>
                                <div className="tier-details">
                                    <span className="tier-name">{tierBenefits[userTier as keyof typeof tierBenefits].name}</span>
                                    <span className="tier-description">Beginning your sacred journey</span>
                                </div>
                            </div>
                            <div className="sacred-points">
                                <div className="points-display">
                                    <span className="fire-icon">🔥</span>
                                    <span className="points-count">{sacredFirePoints}</span>
                                    <span className="points-label">Sacred Fire Points</span>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{width: '43%'}}></div>
                                    </div>
                                    <span className="progress-text">200 points to ⭐ Devotee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="categories">
            <div className="container mx-auto">
                <h2 className="section-title">Explore Sacred Categories</h2>
                <div className="categories-grid">
                    {categories.map(category => (
                        <div key={category.id} className={`category-card ${category.id}`} onClick={() => setSelectedCategory(category.id)}>
                            <div className="category-content">
                                <div className="category-header">
                                    <span className="category-icon">{category.icon}</span>
                                    <div className="category-info">
                                        <h3>{category.name}</h3>
                                        <p>{category.featured}</p>
                                    </div>
                                </div>
                                <div className="category-footer">
                                    <span className="product-count">{category.count} items</span>
                                    <span className="featured-product">Featured: {category.featured}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="products">
            <div className="container mx-auto">
                <div className="products-header">
                    <h2 className="section-title">Featured Treasures</h2>
                    <div className="filters">
                        {categories.map(c => <button key={c.id} className={`filter-btn ${selectedCategory === c.id ? 'active' : ''}`} onClick={() => setSelectedCategory(c.id)}>{c.name}</button>)}
                    </div>
                </div>
                <div className="products-grid">
                    {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
        </section>

        {modalProduct && <Modal product={modalProduct} onClose={() => setModalProduct(null)} />}

    </div>
  );
};

export default EnhancedStorePage;
