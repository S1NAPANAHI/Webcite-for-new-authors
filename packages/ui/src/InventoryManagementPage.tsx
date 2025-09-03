import React, { useState, useEffect } from 'react';
import {
  Package2,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Book,
  Crown,
  Users,
  DollarSign,
  Calendar,
  Download,
  Upload,
  FileText,
  Archive,
  Plus,
  Minus,
  Settings
} from 'lucide-react';

interface InventoryItem {
  id: string;
  product: {
    id: string;
    name: string;
    title: string;
    product_type: 'book' | 'subscription' | 'bundle';
    status: string;
    active: boolean;
  };
  total_sales: number;
  recent_sales: number; // Last 30 days
  revenue: number;
  revenue_recent: number; // Last 30 days
  downloads?: number;
  active_subscriptions?: number;
  conversion_rate?: number;
  last_sale?: string;
  created_at: string;
  updated_at: string;
}

interface InventoryMetrics {
  total_products: number;
  total_books: number;
  total_subscriptions: number;
  total_revenue: number;
  revenue_this_month: number;
  revenue_growth: number;
  total_sales: number;
  sales_this_month: number;
  sales_growth: number;
  active_subscriptions: number;
  subscription_growth: number;
}

type ProductType = 'all' | 'book' | 'subscription' | 'bundle';
type SortBy = 'name' | 'sales' | 'revenue' | 'recent_activity';
type SortOrder = 'asc' | 'desc';

const InventoryManagementPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProductType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('sales');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/admin/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory data');
      
      const data = await response.json();
      setInventory(data.inventory || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    }
  };

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchInventory(), fetchMetrics()]);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort inventory
  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = 
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || item.product.product_type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (sortBy) {
        case 'name':
          aValue = a.product.title.toLowerCase();
          bValue = b.product.title.toLowerCase();
          break;
        case 'sales':
          aValue = a.total_sales;
          bValue = b.total_sales;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'recent_activity':
          aValue = a.last_sale ? new Date(a.last_sale).getTime() : 0;
          bValue = b.last_sale ? new Date(b.last_sale).getTime() : 0;
          break;
        default:
          aValue = a.total_sales;
          bValue = b.total_sales;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Format currency
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get product type icon
  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return <Book className="w-4 h-4" />;
      case 'subscription': return <Crown className="w-4 h-4" />;
      case 'bundle': return <Package2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Get performance indicator
  const getPerformanceIndicator = (current: number, previous: number) => {
    const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    
    if (growth > 10) {
      return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' };
    } else if (growth < -10) {
      return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100' };
    } else {
      return { icon: BarChart3, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading inventory data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Package2 className="w-8 h-8 text-primary" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track digital product performance, sales analytics, and inventory metrics
          </p>
        </div>
        <button
          onClick={fetchData}
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh Data
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(metrics.total_revenue)}
                </p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${
                  metrics.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.revenue_growth >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatPercentage(metrics.revenue_growth)} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Sales */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-foreground">
                  {metrics.total_sales.toLocaleString()}
                </p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${
                  metrics.sales_growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.sales_growth >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatPercentage(metrics.sales_growth)} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold text-foreground">
                  {metrics.active_subscriptions.toLocaleString()}
                </p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${
                  metrics.subscription_growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.subscription_growth >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatPercentage(metrics.subscription_growth)} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-foreground">
                  {metrics.total_products}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {metrics.total_books} books, {metrics.total_subscriptions} subscriptions
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Package2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search, Filter, and Sort Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
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
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ProductType)}
              className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="book">Books</option>
              <option value="subscription">Subscriptions</option>
              <option value="bundle">Bundles</option>
            </select>
          </div>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy as SortBy);
              setSortOrder(newSortOrder as SortOrder);
            }}
            className="px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="sales-desc">Sales (High to Low)</option>
            <option value="sales-asc">Sales (Low to High)</option>
            <option value="revenue-desc">Revenue (High to Low)</option>
            <option value="revenue-asc">Revenue (Low to High)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="recent_activity-desc">Most Recent Activity</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recent Sales (30d)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Sale
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Package2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No products found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || filterType !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Products will appear here once they have sales data'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const performance = getPerformanceIndicator(item.recent_sales, item.total_sales - item.recent_sales);
                  const PerformanceIcon = performance.icon;
                  
                  return (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">
                              {item.product.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getProductTypeIcon(item.product.product_type)}
                          <span className="text-sm text-foreground capitalize">
                            {item.product.product_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {item.total_sales.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {item.recent_sales.toLocaleString()}
                        </div>
                        {item.downloads && (
                          <div className="text-xs text-muted-foreground">
                            {item.downloads.toLocaleString()} downloads
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {formatPrice(item.revenue)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatPrice(item.revenue_recent)} recent
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performance.bg} ${performance.color}`}>
                          <PerformanceIcon className="w-3 h-3 mr-1" />
                          {item.recent_sales > (item.total_sales - item.recent_sales) ? 'Growing' : 
                           item.recent_sales < (item.total_sales - item.recent_sales) / 2 ? 'Declining' : 'Stable'}
                        </div>
                        {item.active_subscriptions !== undefined && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.active_subscriptions} active subs
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">
                          {item.last_sale ? formatDate(item.last_sale) : 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-primary hover:text-primary-dark p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-muted-foreground hover:text-foreground p-1">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementPage;
