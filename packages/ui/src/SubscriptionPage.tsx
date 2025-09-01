import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { BookOpen, Clock, Star, CheckCircle, ArrowRight, ArrowLeft, Crown, Zap, Heart, Users, Shield, X } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  paypalPlanId: string;
  highlight?: string;
}

export const SubscriptionPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);

  let stripe: any, elements: any, clientSecret: string;
  const PUBLISHABLE_KEY = import.meta?.env?.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Debug environment variables
  React.useEffect(() => {
    console.log('🔑 SubscriptionPage - Environment check:');
    console.log('🔑 Stripe key from env:', import.meta?.env?.VITE_STRIPE_PUBLISHABLE_KEY);
    console.log('🔑 All env vars:', import.meta?.env);
  }, []);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'price_1S2L8JQv3TvmaocsYofzFKgm',
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
      paypalPlanId: 'prod_SyHh0v9pcletkx',
      highlight: 'Perfect for new readers'
    },
    {
      id: 'price_1S2L95Qv3TvmaocsN5zRIEXO',
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
      paypalPlanId: 'prod_SyHiFk24bHGA2U',
      highlight: 'Best value - Save $19.89'
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = `/login?returnTo=/subscribe`;
      return;
    }
    
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return;
    
    setSelectedPlan(plan);
    setShowCheckout(true); // This will trigger the AnimatePresence
    
    // New Stripe logic
    setTimeout(async () => {
      const emailEl = document.getElementById('email') as HTMLInputElement;
      const errorEl = document.getElementById('error');

      if (!PUBLISHABLE_KEY) {
        if (errorEl) errorEl.textContent = 'Stripe Publishable Key is not configured.';
        return;
      }

      try {
        const email = emailEl?.value || '';
        const resp = await fetch('http://localhost:4242/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, priceId: plan.id }) // Use plan.id as PRICE_ID
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Failed to initialize subscription');
        clientSecret = data.clientSecret;
        await mountPaymentElement(clientSecret);
        setDoorsOpen(true); // Open doors after Payment Element is mounted
        
        // Scroll to the form after doors open and elements are mounted
        setTimeout(() => {
          const emailElement = document.getElementById('email');
          const paymentElement = document.getElementById('payment-element');
          const checkoutContainer = document.querySelector('.checkout-form-container');
          
          // Try multiple selectors to find the form
          const targetElement = emailElement || paymentElement || checkoutContainer;
          
          if (targetElement) {
            targetElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 1500); // Wait for door animation and Stripe elements to load
      } catch (e: any) {
        if (errorEl) errorEl.textContent = e.message;
        setShowCheckout(false); // Hide checkout on error
      }
    }, 100); // Small delay to ensure DOM is ready
  };

  async function mountPaymentElement(secret: string) {
    if (!PUBLISHABLE_KEY) return; // Should already be checked in handleSubscribe

    const stripeInstance = await loadStripe(PUBLISHABLE_KEY);
    if (stripeInstance) {
      stripe = stripeInstance;
      elements = stripe.elements({
        clientSecret: secret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#4A90E2',
            colorText: '#1F2937',
            colorTextSecondary: '#6B7280',
            colorDanger: '#EF4444',
            borderRadius: '10px',
          },
          rules: {
            '.Input': { border: '1px solid #E5E7EB', boxShadow: 'none' },
            '.Label': { fontWeight: '500' },
          }
        }
      });
      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
    }
  }

  const handleCloseCheckout = () => {
    setDoorsOpen(false);
    setTimeout(() => {
      setShowCheckout(false);
      setSelectedPlan(null);
      // Optionally unmount Stripe elements here if needed
      if (elements) {
        elements.destroy();
      }
    }, 1000); // Wait for door animation to complete
  };

  const handleCheckoutSuccess = () => {
    handleCloseCheckout();
    // Redirect to success page
    window.location.assign('/subscription-success');
  };

  // Handle confirm button click
  useEffect(() => {
    const confirmBtn = document.getElementById('confirm');
    const emailEl = document.getElementById('email') as HTMLInputElement;
    const errorEl = document.getElementById('error');
    const statusEl = document.getElementById('status');

    const setBusy = (busy: boolean) => {
      if (confirmBtn) {
        (confirmBtn as HTMLButtonElement).disabled = busy;
      }
      if (statusEl) {
        statusEl.textContent = busy ? 'Processing…' : '';
      }
    };

    const handleConfirm = async () => {
      setBusy(true);
      if (errorEl) errorEl.textContent = '';

      const email = emailEl?.value;
      if (!email) {
        if (errorEl) errorEl.textContent = 'Please enter your email.';
        setBusy(false);
        return;
      }

      try {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            receipt_email: email,
            return_url: window.location.origin + '/subscription-success'
          },
          redirect: 'if_required'
        });

        if (error) {
          if (errorEl) errorEl.textContent = error.message || 'Payment failed. Try another payment method.';
          setBusy(false);
          return;
        }

        if (statusEl) statusEl.textContent = 'Success! You’re subscribed.';
        setTimeout(() => window.location.assign('/subscription-success'), 700);
      } catch (e: any) {
        if (errorEl) errorEl.textContent = e.message;
      } finally {
        setBusy(false);
      }
    };

    if (confirmBtn) {
      confirmBtn.addEventListener('click', handleConfirm);
    }

    return () => {
      if (confirmBtn) {
        confirmBtn.removeEventListener('click', handleConfirm);
      }
    };
  }, [showCheckout, stripe, elements]); // Dependencies for useEffect

  // Handle ESC key to close checkout
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCheckout) {
        handleCloseCheckout();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showCheckout]);

  return (
    <>
      <style>
        {`
          :root{
            --primary:#4A90E2; --secondary:#50E3C2;
            --bg:#F9FAFB; --text:#1F2937; --muted:#6B7280; --error:#EF4444;
          }
          .row{display:flex;gap:.75rem;align-items:center;margin:.75rem 0}
          .email{width:100%;padding:.85rem 1rem;border:1px solid #E5E7EB;border-radius:10px;font-size:1rem}
          .btn{background:var(--primary);color:#fff;border:none;padding:.9rem 1rem;border-radius:10px;cursor:pointer}
          .meta{display:flex;justify-content:space-between;align-items:center;margin-top:.5rem;color:var(--muted);font-size:.9rem}
          .secure{display:flex;align-items:center;gap:.4rem}
          .error{color:var(--error);margin-top:.5rem;min-height:1.25rem}
          /* Payment Element container */
          #payment-element{margin:1rem 0}
        `}
      </style>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
      {/* Main Content - Hero Section with Pricing Cards */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
              Join the Zoroasterverse
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the complete story with premium membership plans
            </p>
          </motion.div>

          {/* Modern Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50, rotateY: -10 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: index * 0.2 + 0.4, duration: 0.8, type: "spring", damping: 20 }}
                className={`relative group cursor-pointer ${
                  plan.popular ? 'md:scale-105 z-20' : 'z-10'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      <Crown className="w-4 h-4 inline mr-2" />
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className={`
                  bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                  border-2 rounded-3xl p-8 h-full
                  transition-all duration-500 group-hover:-translate-y-2
                  ${
                    plan.popular 
                      ? 'border-yellow-400 shadow-2xl shadow-yellow-500/25 bg-gradient-to-b from-yellow-50/80 to-white/80 dark:from-yellow-900/20 dark:to-gray-800/80' 
                      : 'border-gray-200 dark:border-gray-600 shadow-xl hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-500'
                  }
                `}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {plan.name}
                    </h3>
                    
                    {plan.highlight && (
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                        plan.popular 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {plan.highlight}
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-6xl font-black text-gray-900 dark:text-white">
                          ${plan.price}
                        </span>
                        <span className="text-2xl text-gray-500 dark:text-gray-400 font-medium">
                          /{plan.interval}
                        </span>
                      </div>
                      {plan.interval === 'year' && (
                        <p className="text-green-600 dark:text-green-400 font-semibold mt-2">
                          Save $19.89 annually • ${(plan.price / 12).toFixed(2)}/month
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.popular 
                            ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                            : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          <CheckCircle 
                            className={`${
                              plan.popular 
                                ? 'text-yellow-600 dark:text-yellow-400' 
                                : 'text-blue-600 dark:text-blue-400'
                            }`} 
                            size={16} 
                          />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group-hover:shadow-xl ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-yellow-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30'
                    } transform group-hover:-translate-y-1`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Join 10,000+ Readers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Door Animation Overlay */}
      <AnimatePresence>
        {showCheckout && (
          <div 
            className="fixed inset-0 z-[9999]" 
            style={{ perspective: '1000px' }}
          >
            {/* Left Door */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: doorsOpen ? -90 : 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-600 to-purple-700 shadow-2xl"
              style={{ transformOrigin: 'right center' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
              <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-white">
                <Crown className="w-16 h-16 mb-4 opacity-30" />
                <h3 className="text-2xl font-bold opacity-50">Zoroasterverse</h3>
              </div>
            </motion.div>

            {/* Right Door */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: doorsOpen ? 90 : 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-600 to-blue-700 shadow-2xl"
              style={{ transformOrigin: 'left center' }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-white text-right">
                <BookOpen className="w-16 h-16 mb-4 opacity-30 ml-auto" />
                <h3 className="text-2xl font-bold opacity-50">Premium</h3>
              </div>
            </motion.div>

            {/* Checkout Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: doorsOpen ? 1 : 0, scale: doorsOpen ? 1 : 0.8 }}
              transition={{ delay: doorsOpen ? 0.5 : 0, duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center p-4 bg-white/10 dark:bg-black/10 backdrop-blur-sm checkout-form-container"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl relative">
                  <button
                    onClick={handleCloseCheckout}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="text-center text-white">
                    <h2 className="text-3xl font-bold mb-2">Complete Your Subscription</h2>
                    <p className="text-white/90">
                      {selectedPlan?.name} • ${selectedPlan?.price}/{selectedPlan?.interval}
                    </p>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  {/* Left: Plan Summary */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        What You're Getting
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${selectedPlan?.price}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            per {selectedPlan?.interval}
                          </div>
                        </div>
                        
                        <ul className="space-y-3">
                          {selectedPlan?.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300 text-sm">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-semibold">30-Day Money-Back Guarantee</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        Not satisfied? Get a full refund within 30 days, no questions asked.
                      </p>
                    </div>
                  </div>

                  {/* Right: Payment Form */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Secure Payment
                    </h3>
                    <div>
                      <div className="row">
                        <input className="email" id="email" type="email" placeholder="Email address" autoComplete="email" required />
                      </div>

                      <div id="payment-element"></div>

                      <button className="btn" id="confirm">Subscribe Now</button>
                      <div className="meta">
                        <span className="secure">🔒 Secure payment</span>
                        <span id="status" aria-live="polite"></span>
                      </div>
                      <div id="error" className="error" role="alert"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Readers Love Zoroasterverse
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the complete story with exclusive benefits
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <BookOpen className="w-12 h-12 text-blue-500" />,
                title: 'Exclusive Content',
                description: 'Access to all chapters, including early releases and subscriber-only content.'
              },
              {
                icon: <Clock className="w-12 h-12 text-blue-500" />,
                title: 'Regular Updates',
                description: 'New chapters delivered consistently. Get the story as it develops!'
              },
              {
                icon: <Zap className="w-12 h-12 text-blue-500" />,
                title: 'Early Access',
                description: 'Be first to experience new chapters before public release.'
              },
              {
                icon: <Heart className="w-12 h-12 text-blue-500" />,
                title: 'Community',
                description: 'Join discussions and connect with fellow readers.'
              },
              {
                icon: <Star className="w-12 h-12 text-blue-500" />,
                title: 'Behind the Scenes',
                description: 'Exclusive insights into the creative process and world-building.'
              },
              {
                icon: <Shield className="w-12 h-12 text-blue-500" />,
                title: 'Ad-Free Experience',
                description: 'Enjoy reading without distractions or interruptions.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default SubscriptionPage;
