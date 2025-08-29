import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../../packages/shared/src/AuthContext.js';
import { BookOpen, Clock, Star, CheckCircle, ArrowRight, Crown, Zap, Heart } from 'lucide-react';
import { SubscriptionCheckout } from './SubscriptionCheckout';
import { motion } from 'framer-motion';
export const SubscriptionPage = () => {
    const { isAuthenticated } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const subscriptionPlans = [
        {
            id: 'monthly',
            name: 'Monthly Membership',
            price: 9.99,
            interval: 'month',
            features: [
                'Access to all released content',
                'New chapters as they release',
                'Exclusive behind-the-scenes',
                'Early character reveals',
                'Community discussions',
                'Author notes and insights'
            ],
            paypalPlanId: 'monthly_plan_id',
            highlight: 'Perfect for new readers'
        },
        {
            id: 'yearly',
            name: 'Annual Membership',
            price: 99.99,
            interval: 'year',
            features: [
                'Everything in Monthly plan',
                '2 months free (17% savings)',
                'Priority content access',
                'Exclusive annual content',
                'Direct Q&A with author',
                'Member-only events'
            ],
            popular: true,
            paypalPlanId: 'yearly_plan_id',
            highlight: 'Best value - Save $19.89'
        }
    ];
    const handleSubscribe = (planId) => {
        if (!isAuthenticated) {
            window.location.href = `/login?returnTo=/subscribe`;
            return;
        }
        setSelectedPlan(subscriptionPlans.find(plan => plan.id === planId) || null);
        setShowCheckoutModal(true);
    };
    const handleCheckoutClose = () => setShowCheckoutModal(false);
    const handleCheckoutSuccess = () => setShowCheckoutModal(false);
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("section", { className: "relative bg-gradient-to-br from-primary/10 to-background", children: _jsx("div", { className: "container mx-auto px-4 py-24 md:py-32", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: [_jsx("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight", children: "Unlock the Full Zoroasterverse Experience" }), _jsx("p", { className: "text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto", children: "Join our community of readers and get exclusive access to the complete story as it unfolds." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full max-w-6xl mx-auto", children: subscriptionPlans.map((plan, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 + 0.3, duration: 0.5 }, className: `relative w-full ${plan.popular ? 'z-10 transform md:-translate-y-4' : ''}`, children: [plan.popular && (_jsx("div", { className: "absolute -top-3 left-1/2 transform -translate-x-1/2 z-20", children: _jsxs("div", { className: "bg-gradient-to-r from-amber-400 to-amber-600 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20", children: [_jsx(Crown, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "MOST POPULAR" })] }) })), _jsxs("div", { className: `bg-card border rounded-xl p-6 transition-all duration-300 ${plan.popular
                                                ? 'border-amber-500/30 shadow-xl shadow-amber-500/10'
                                                : 'border-border hover:border-primary/50 hover:shadow-lg'}`, children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-foreground mb-2", children: plan.name }), plan.highlight && (_jsx("p", { className: "text-sm text-primary font-medium mb-3", children: plan.highlight })), _jsxs("div", { className: "mb-2", children: [_jsxs("span", { className: "text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent", children: ["$", plan.price] }), _jsxs("span", { className: "text-muted-foreground text-lg", children: ["/", plan.interval] })] }), plan.interval === 'year' && (_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Only $", (plan.price / 12).toFixed(2), " per month"] }))] }), _jsx("ul", { className: "space-y-3 mb-8", children: plan.features.map((feature, idx) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: `flex-shrink-0 mt-0.5 ${plan.popular ? 'text-amber-500' : 'text-primary'}`, size: 18 }), _jsx("span", { className: "text-muted-foreground text-sm", children: feature })] }, idx))) }), _jsxs("button", { onClick: () => handleSubscribe(plan.id), className: `w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${plan.popular
                                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/20'
                                                        : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'}`, children: ["Get Started", _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] }, plan.id))) })] }) }) }), _jsx("section", { className: "py-16 md:py-24 bg-card/30", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold text-center mb-16", children: "What You'll Get" }), _jsx("div", { className: "grid md:grid-cols-3 gap-8 max-w-6xl mx-auto", children: [
                                {
                                    icon: _jsx(BookOpen, { className: "w-8 h-8 text-primary" }),
                                    title: 'Exclusive Content',
                                    description: 'Access to all chapters, including early releases and subscriber-only content.'
                                },
                                {
                                    icon: _jsx(Clock, { className: "w-8 h-8 text-primary" }),
                                    title: 'Regular Updates',
                                    description: 'New chapters delivered on a consistent schedule. No waiting for complete books!'
                                },
                                {
                                    icon: _jsx(Zap, { className: "w-8 h-8 text-primary" }),
                                    title: 'Early Access',
                                    description: 'Be the first to experience new chapters and special releases.'
                                },
                                {
                                    icon: _jsx(Heart, { className: "w-8 h-8 text-primary" }),
                                    title: 'Community',
                                    description: 'Join discussions, share theories, and connect with other readers.'
                                },
                                {
                                    icon: _jsx(Star, { className: "w-8 h-8 text-primary" }),
                                    title: 'Behind the Scenes',
                                    description: 'Exclusive insights into the creative process and world-building.'
                                },
                                {
                                    icon: _jsx(CheckCircle, { className: "w-8 h-8 text-primary" }),
                                    title: 'Ad-Free Experience',
                                    description: 'Enjoy your reading without any distractions or interruptions.'
                                }
                            ].map((feature, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: index * 0.1, duration: 0.5 }, className: "bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-primary/30 transition-colors", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4", children: feature.icon }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: feature.title }), _jsx("p", { className: "text-muted-foreground text-sm", children: feature.description })] }, index))) })] }) }), _jsx("section", { className: "py-16 bg-gradient-to-r from-primary/5 to-primary/10", children: _jsxs("div", { className: "container mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: "Ready to Begin Your Journey?" }), _jsx("p", { className: "text-xl text-muted-foreground max-w-2xl mx-auto mb-8", children: "Join thousands of readers who are already exploring the Zoroasterverse." }), _jsxs("div", { className: "flex flex-wrap justify-center gap-4", children: [_jsxs("button", { onClick: () => handleSubscribe('yearly'), className: "px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2", children: ["Start Reading Now", _jsx(ArrowRight, { className: "w-4 h-4" })] }), _jsx("button", { className: "px-6 py-3 border border-border hover:border-primary/50 hover:bg-background/50 text-foreground font-medium rounded-lg transition-all", children: "Learn More" })] })] }) }), showCheckoutModal && selectedPlan && (_jsx(SubscriptionCheckout, { product: {
                    id: selectedPlan.id,
                    name: selectedPlan.name,
                    price: selectedPlan.price * 100, // Use 'price' instead of 'amount_cents'
                    currency: 'usd', // Assuming USD, needs to be dynamic if multiple currencies
                    interval: selectedPlan.interval,
                    is_subscription: true,
                    trial_period_days: undefined, // Add if selectedPlan has this property
                }, onCancel: handleCheckoutClose, onSuccess: handleCheckoutSuccess }))] }));
};
export default SubscriptionPage;
//# sourceMappingURL=SubscriptionPage.js.map