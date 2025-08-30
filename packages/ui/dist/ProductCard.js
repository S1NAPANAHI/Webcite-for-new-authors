import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { ShoppingCart, Crown, Plus } from 'lucide-react';
import { SubscriptionCheckout } from './SubscriptionCheckout';
import { useCart } from '@zoroaster/shared/CartContext';
export const ProductCard = ({ product, onPurchase, showCheckout = false }) => {
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showSample, setShowSample] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const { addItem, isInCart } = useCart();
    // Get primary price (first price or subscription price)
    const primaryPrice = product.prices && product.prices.length > 0 ? {
        id: product.prices[0].id,
        unit_amount: product.prices[0].unit_amount,
        currency: product.prices[0].currency,
        interval: product.prices[0].interval || undefined, // Add interval if available
        trial_days: product.prices[0].trial_days || undefined, // Add trial_days if available
    } : null;
    const formatPrice = (amountCents, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amountCents / 100);
    };
    const handlePurchase = (price) => {
        setSelectedPrice(price);
        setShowCheckoutModal(true);
    };
    const handleAddToCart = () => {
        if (primaryPrice) {
            addItem({
                id: product.id,
                title: product.name, // Temporarily cast to any
                price: primaryPrice.unit_amount / 100,
                currency: primaryPrice.currency,
                format: 'digital' // Added a placeholder format
            });
        }
    };
    const handleCheckoutSuccess = (sessionId) => {
        setShowCheckoutModal(false);
        if (onPurchase) {
            onPurchase(product.id);
        }
        // You can redirect to success page or show success message
        console.log('Purchase successful:', sessionId);
    };
    const handleCheckoutCancel = () => {
        setShowCheckoutModal(false);
    };
    if (!primaryPrice) {
        return null; // Don't render if no price available
    }
    const isProductInCart = isInCart(product.id);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-background-light/30 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 product-card-hover glass-effect border border-border/30", children: [_jsxs("div", { className: "relative h-64 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30", children: [_jsx("div", { className: "w-full h-full flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Crown, { className: "w-16 h-16 text-secondary mx-auto mb-2" }), _jsx("p", { className: "text-text-light/60 text-sm font-medium", children: product.name })] }) }), product.active && (_jsx("div", { className: "absolute top-4 right-4 bg-success text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg", children: "Available" })), product.product_type === 'bundle' && (_jsx("div", { className: "absolute top-4 left-4 bg-secondary text-background px-3 py-1 rounded-full text-xs font-medium shadow-lg", children: "Bundle" })), (product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') && (_jsx("div", { className: "absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg", children: "Subscription" }))] }), _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-xl font-bold text-text-light mb-3 line-clamp-2", children: product.name }), _jsx("p", { className: "text-text-light/70 text-sm mb-4 line-clamp-3 leading-relaxed", children: product.description }), _jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "text-3xl font-bold text-secondary mb-2", children: formatPrice(primaryPrice.unit_amount, primaryPrice.currency) }), (product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') && (_jsx("div", { className: "text-text-light/70 text-sm", children: "per month" })), !(product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') && (_jsx("div", { className: "text-text-light/70 text-sm", children: "One-time purchase" }))] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: handleAddToCart, disabled: isProductInCart, className: `w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${isProductInCart
                                            ? 'bg-success text-white cursor-not-allowed'
                                            : 'bg-secondary text-background hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-background-light shadow-lg hover:shadow-xl'}`, children: isProductInCart ? (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2713" }), _jsx("span", { children: "Added to Cart" })] })) : (_jsxs(_Fragment, { children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx("span", { children: "Add to Cart" })] })) }), _jsxs("button", { onClick: () => handlePurchase(primaryPrice), className: "w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl", children: [_jsx(ShoppingCart, { className: "w-5 h-5" }), _jsx("span", { children: (product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') ? 'Start Subscription' : 'Buy Now' })] })] }), _jsx("div", { className: "mt-6 pt-4 border-t border-border/30", children: _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm text-text-dark", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-text-light", children: "Published:" }), _jsx("br", {}), new Date(product.created_at).toLocaleDateString()] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-text-light", children: "Type:" }), _jsx("br", {}), product.product_type === 'bundle' ? 'Bundle' : (product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') ? 'Subscription' : 'Single Issue'] })] }) })] })] }), showCheckoutModal && selectedPrice && (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-background-light rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto glass-effect border border-border/30", children: [_jsx("div", { className: "p-6 border-b border-border/30", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium text-text-light", children: "Complete Purchase" }), _jsxs("button", { onClick: () => setShowCheckoutModal(false), className: "text-text-dark hover:text-text-light transition-colors p-1 rounded-lg hover:bg-background/30", children: [_jsx("span", { className: "sr-only", children: "Close" }), _jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })] })] }) }), _jsx(SubscriptionCheckout, { product: {
                                id: product.id,
                                name: product.name,
                                price: selectedPrice.unit_amount,
                                currency: selectedPrice.currency,
                                interval: selectedPrice.interval,
                                trial_period_days: selectedPrice.trial_days,
                                is_subscription: (product.product_type === 'chapter_pass' || product.product_type === 'arc_pass')
                            }, onSuccess: handleCheckoutSuccess, onCancel: handleCheckoutCancel })] }) }))] }));
};
//# sourceMappingURL=ProductCard.js.map