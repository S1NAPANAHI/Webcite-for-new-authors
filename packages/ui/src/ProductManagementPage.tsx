import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  DollarSign,
  Book,
  Crown,
  Eye,
  EyeOff,
  Upload,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  product_type: 'book' | 'subscription' | 'bundle';
  cover_image_url?: string;
  active: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  prices: ProductPrice[];
  stripe_product_id?: string;
}

interface ProductPrice {
  id: string;
  price_id: string; // Stripe price ID
  nickname?: string;
  currency: string;
  amount_cents: number;
  unit_amount: number;
  interval?: 'month' | 'year' | null;
  interval_count?: number;
  trial_period_days?: number;
  active: boolean;
}

interface ProductFormData {
  name: string;
  title: string;
  description: string;
  product_type: 'book' | 'subscription' | 'bundle';
  cover_image_url: string;
  active: boolean;
  status: 'draft' | 'published' | 'archived';
}

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'book' | 'subscription' | 'bundle'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    title: '',
    description: '',
    product_type: 'book',
    cover_image_url: '',
    active: true,
    status: 'draft'
  });
  const [priceFormData, setPriceFormData] = useState({
    amount: '',
    currency: 'USD',
    interval: '',
    nickname: '',
    trial_period_days: 0
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?include_prices=true');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.product_type === filterType;
    return matchesSearch && matchesType;
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      await fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  // Handle price creation
  const handleCreatePrice = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_amount: Math.round(parseFloat(priceFormData.amount) * 100),
          currency: priceFormData.currency,
          nickname: priceFormData.nickname,
          recurring: priceFormData.interval ? {
            interval: priceFormData.interval,
            trial_period_days: priceFormData.trial_period_days || undefined
          } : undefined
        })
      });

      if (!response.ok) throw new Error('Failed to create price');
      
      await fetchProducts();
      setPriceFormData({
        amount: '',
        currency: 'USD',
        interval: '',
        nickname: '',
        trial_period_days: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create price');
    }
  };

  // Delete product
  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This will deactivate it in Stripe but not permanently delete it.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  // Toggle product status
  const toggleProductStatus = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !product.active })
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      product_type: 'book',
      cover_image_url: '',
      active: true,
      status: 'draft'
    });
    setEditingProduct(null);
  };

  // Open edit modal
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      title: product.title,
      description: product.description,
      product_type: product.product_type,
      cover_image_url: product.cover_image_url || '',
      active: product.active,
      status: product.status
    });
    setShowModal(true);
  };

  // Get product type icon
  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return <Book className="w-4 h-4" />;
      case 'subscription': return <Crown className="w-4 h-4" />;
      case 'bundle': return <Package className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Format price
  const formatPrice = (amountCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Product Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your books, subscriptions, and bundles with integrated Stripe pricing
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Types</option>
            <option value="book">Books</option>
            <option value="subscription">Subscriptions</option>
            <option value="bundle">Bundles</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden">
              {product.cover_image_url ? (
                <img
                  src={product.cover_image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getProductTypeIcon(product.product_type)}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize flex items-center gap-2 mt-1">
                    {getProductTypeIcon(product.product_type)}
                    {product.product_type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleProductStatus(product)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      product.active 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    title={product.active ? 'Active' : 'Inactive'}
                  >
                    {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description || 'No description available'}
              </p>

              {/* Prices */}
              <div className="space-y-2">
                {product.prices && product.prices.length > 0 ? (
                  product.prices.slice(0, 2).map((price) => (
                    <div key={price.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {price.nickname || 'Standard'}
                        {price.interval && ` (${price.interval}ly)`}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatPrice(price.amount_cents, price.currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No prices set</p>
                )}
                {product.prices && product.prices.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{product.prices.length - 2} more prices
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.status === 'published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : product.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {product.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(product.updated_at).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first product'
            }
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            Create Product
          </button>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Internal product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Public display title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Product description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Type
                  </label>
                  <select
                    value={formData.product_type}
                    onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="book">Book (One-time purchase)</option>
                    <option value="subscription">Subscription</option>
                    <option value="bundle">Bundle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-foreground">
                  Product is active (visible to customers)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
