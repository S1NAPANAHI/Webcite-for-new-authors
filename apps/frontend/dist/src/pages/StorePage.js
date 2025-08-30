import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Filter, Grid3X3, List, Star, Crown, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductCard } from '@zoroaster/ui';
const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedFormat, setSelectedFormat] = useState('all'); // This will need to be re-evaluated based on actual file formats
    const [priceRange, setPriceRange] = useState([0, 50]);
    const [viewMode, setViewMode] = useState('grid');
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
            }
            catch (error) {
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
    const handlePurchase = (productId) => {
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
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-background via-background-light to-background", children: [_jsxs("div", { className: "relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" }), _jsxs("div", { className: "relative z-10 container mx-auto px-4 py-16 text-center", children: [_jsxs("h1", { className: "text-5xl md:text-6xl font-heading text-text-light mb-6", children: [_jsx("span", { className: "text-secondary", children: "Zoroasterverse" }), " Store"] }), _jsx("p", { className: "text-xl text-text-light/80 max-w-3xl mx-auto leading-relaxed", children: "Discover epic tales of magic, technology, and cosmic adventure. From single volumes to complete collections, your journey awaits." }), _jsx("div", { className: "mt-8 flex justify-center", children: _jsxs("div", { className: "flex items-center space-x-4 text-text-light/60", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Crown, { className: "w-5 h-5 text-secondary" }), _jsx("span", { children: "Premium Content" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Download, { className: "w-5 h-5 text-accent" }), _jsx("span", { children: "Multiple Formats" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Star, { className: "w-5 h-5 text-secondary" }), _jsx("span", { children: "Exclusive Bundles" })] })] }) })] })] }), _jsxs("div", { className: "container mx-auto px-4 pb-16", children: [_jsxs("div", { className: "bg-background-light/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-border/30", children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-6 items-start lg:items-center", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Search for books, series, or authors...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" })] }), _jsxs("div", { className: "flex items-center space-x-2 bg-background/50 rounded-xl p-1 border border-border/30", children: [_jsx("button", { onClick: () => setViewMode('grid'), className: `p-2 rounded-lg transition-all ${viewMode === 'grid'
                                                    ? 'bg-secondary text-background'
                                                    : 'text-text-light hover:text-secondary'}`, children: _jsx(Grid3X3, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => setViewMode('list'), className: `p-2 rounded-lg transition-all ${viewMode === 'list'
                                                    ? 'bg-secondary text-background'
                                                    : 'text-text-light hover:text-secondary'}`, children: _jsx(List, { className: "w-5 h-5" }) })] }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all", children: [_jsx("option", { value: "newest", children: "Newest First" }), _jsx("option", { value: "oldest", children: "Oldest First" }), _jsx("option", { value: "price-low", children: "Price: Low to High" }), _jsx("option", { value: "price-high", children: "Price: High to Low" }), _jsx("option", { value: "title", children: "Alphabetical" })] }), _jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "px-4 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-text-light transition-all flex items-center space-x-2", children: [_jsx(Filter, { className: "w-5 h-5" }), _jsx("span", { children: "Filters" }), showFilters ? _jsx(ChevronUp, { className: "w-4 h-4" }) : _jsx(ChevronDown, { className: "w-4 h-4" })] })] }), showFilters && (_jsx("div", { className: "mt-6 pt-6 border-t border-border/30", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-light mb-3", children: "Categories" }), _jsx("div", { className: "space-y-2", children: categories.map(category => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer", children: [_jsx("input", { type: "radio", name: "category", value: category.id, checked: selectedCategory === category.id, onChange: (e) => setSelectedCategory(e.target.value), className: "text-secondary focus:ring-secondary" }), _jsx("span", { className: "text-text-light", children: category.name }), _jsxs("span", { className: "text-text-dark text-sm", children: ["(", category.count, ")"] })] }, category.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-light mb-3", children: "Formats" }), _jsx("div", { className: "space-y-2", children: formats.map(format => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer", children: [_jsx("input", { type: "radio", name: "format", value: format.id, checked: selectedFormat === format.id, onChange: (e) => setSelectedFormat(e.target.value), className: "text-secondary focus:ring-secondary" }), _jsx("span", { className: "text-text-light", children: format.name }), _jsxs("span", { className: "text-text-dark text-sm", children: ["(", format.count, ")"] })] }, format.id))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-text-light mb-3", children: ["Price Range: $", priceRange[0], " - $", priceRange[1]] }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "range", min: "0", max: "50", value: priceRange[1], onChange: (e) => setPriceRange([priceRange[0], parseInt(e.target.value)]), className: "w-full h-2 bg-background/50 rounded-lg appearance-none cursor-pointer slider" }), _jsxs("div", { className: "flex justify-between text-sm text-text-dark", children: [_jsx("span", { children: "$0" }), _jsxs("span", { children: ["$", priceRange[1]] })] })] })] })] }) }))] }), _jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsxs("p", { className: "text-text-light", children: ["Showing ", _jsx("span", { className: "text-secondary font-medium", children: filteredProducts.length }), " of", ' ', _jsx("span", { className: "text-text-light", children: products.length }), " products"] }), searchTerm && (_jsx("button", { onClick: () => setSearchTerm(''), className: "text-text-dark hover:text-text-light transition-colors", children: "Clear search" }))] }), filteredProducts.length > 0 ? (_jsx("div", { className: viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-4', children: filteredProducts.map(product => (_jsx("div", { className: viewMode === 'list' ? 'bg-background-light/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30' : '', children: _jsx(ProductCard, { product: product, onPurchase: handlePurchase, showCheckout: true }) }, product.id))) })) : (_jsxs("div", { className: "text-center py-16", children: [_jsx("div", { className: "w-24 h-24 mx-auto mb-6 bg-background-light/30 rounded-full flex items-center justify-center", children: _jsx(Search, { className: "w-12 h-12 text-text-dark" }) }), _jsx("h3", { className: "text-2xl font-heading text-text-light mb-2", children: "No products found" }), _jsx("p", { className: "text-text-dark mb-6", children: "Try adjusting your search terms or filters to find what you're looking for." }), _jsx("button", { onClick: () => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSelectedFormat('all');
                                    setPriceRange([0, 50]);
                                }, className: "px-6 py-3 bg-secondary text-background rounded-xl hover:bg-secondary-dark transition-colors", children: "Clear all filters" })] }))] })] }));
};
export default StorePage;
//# sourceMappingURL=StorePage.js.map