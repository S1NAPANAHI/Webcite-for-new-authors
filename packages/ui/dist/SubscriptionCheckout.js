import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShoppingCart, Crown, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');
const CheckoutForm = ({ product, onSuccess, onCancel, customerEmail }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(customerEmail || '');
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setIsProcessing(true);
        setError(null);
        try {
            // Create checkout session
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: product.id,
                    successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: `${window.location.origin}/cancel`,
                    customerEmail: email,
                    productSlug: product.id
                }),
            });
            const { url, error: responseError } = await response.json();
            if (responseError) {
                throw new Error(responseError);
            }
            // Redirect to Stripe Checkout
            window.location.href = url;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setIsProcessing(false);
        }
    };
    const formatPrice = (amountCents, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amountCents / 100);
    };
    const formatInterval = (interval) => {
        if (!interval)
            return '';
        return interval === 'month' ? 'monthly' : interval === 'year' ? 'yearly' : interval;
    };
    return (_jsxs("div", { className: "max-w-md mx-auto bg-background-light rounded-2xl shadow-lg overflow-hidden border border-border/30", children: [_jsx("div", { className: "bg-gradient-to-r from-primary/80 to-secondary/80 p-6 text-text-light", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-16 h-20 bg-white bg-opacity-20 rounded-md flex items-center justify-center", children: _jsx(Crown, { className: "w-8 h-8 text-white" }) }), _jsx("div", { children: _jsx("h2", { className: "text-xl font-bold", children: product.name }) })] }) }), _jsx("div", { className: "p-6 border-b border-border/30", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-secondary", children: formatPrice(product.price, product.currency) }), product.is_subscription && (_jsxs("div", { className: "text-text-light/70", children: ["per ", formatInterval(product.interval), product.trial_period_days && product.trial_period_days > 0 && (_jsxs("span", { className: "ml-2 text-success font-medium", children: ["\u2022 ", product.trial_period_days, "-day free trial"] }))] })), !product.is_subscription && (_jsx("div", { className: "text-text-light/70", children: "One-time purchase" }))] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-text-light mb-2", children: "Email Address" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full px-3 py-2 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all", placeholder: "your@email.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-light mb-2", children: "Card Details" }), _jsx("div", { className: "border border-border/30 rounded-xl p-3 bg-background/30", children: _jsx(CardElement, { options: {
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#e0e0e0',
                                                '::placeholder': {
                                                    color: '#a0a0a0',
                                                },
                                            },
                                            invalid: {
                                                color: '#dc3545',
                                            },
                                        },
                                    } }) })] }), error && (_jsxs("div", { className: "flex items-center space-x-2 text-error bg-error/10 p-3 rounded-xl border border-error/30", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm", children: error })] })), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { type: "submit", disabled: !stripe || isProcessing, className: "w-full bg-secondary text-background py-3 px-4 rounded-xl font-medium hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-background-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200", children: isProcessing ? (_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-background" }), _jsx("span", { children: "Processing..." })] })) : (_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx(ShoppingCart, { className: "w-5 h-5" }), _jsx("span", { children: product.is_subscription ? 'Start Subscription' : 'Complete Purchase' })] })) }), _jsx("button", { type: "button", onClick: onCancel, className: "w-full bg-background/50 text-text-light py-3 px-4 rounded-xl font-medium hover:bg-background/70 focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background-light transition-all duration-200 border border-border/30", children: "Cancel" })] }), _jsxs("div", { className: "text-center text-xs text-text-dark", children: [_jsxs("div", { className: "flex items-center justify-center space-x-1 mb-2", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-success" }), _jsx("span", { children: "Secure payment powered by Stripe" })] }), _jsx("p", { children: "Your payment information is encrypted and secure." })] })] })] }));
};
const SubscriptionCheckout = (props) => {
    // Check if Stripe key is configured
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey || stripeKey === 'pk_test_your_key_here') {
        return (_jsx("div", { className: "max-w-md mx-auto bg-background-light rounded-2xl p-6 border border-border/30", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertTriangle, { className: "w-16 h-16 text-warning mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-bold text-text-light mb-2", children: "Stripe Not Configured" }), _jsx("p", { className: "text-text-dark mb-4", children: "Please configure your Stripe publishable key in the environment variables to enable checkout functionality." }), _jsx("div", { className: "bg-background/30 p-4 rounded-xl border border-border/30", children: _jsx("p", { className: "text-sm text-text-dark font-mono", children: "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here" }) }), _jsx("button", { onClick: props.onCancel, className: "mt-4 px-6 py-2 bg-secondary text-background rounded-xl hover:bg-secondary-dark transition-colors", children: "Close" })] }) }));
    }
    return (_jsx(Elements, { stripe: stripePromise, children: _jsx(CheckoutForm, { ...props }) }));
};
export { SubscriptionCheckout };
