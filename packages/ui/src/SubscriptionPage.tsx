import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { supabase } from '@zoroaster/shared';
import { BookOpen, Clock, Star, CheckCircle, ArrowRight, Crown } from 'lucide-react';

import { motion } from 'framer-motion';

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
  const PUBLISHABLE_KEY = import.meta?.env?.VITE_STRIPE_PUBLISHABLE_KEY;

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

  const handleSubscribe = async (priceId: string) => {
    if (!isAuthenticated) {
      window.location.href = `/login?returnTo=/subscribe`;
      return;
    }

    try {
      const session = supabase.auth.session();
      if (!session) {
        throw new Error('User is not authenticated');
      }

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const stripe = await loadStripe(PUBLISHABLE_KEY!);
      if (stripe) {
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      // Handle error, e.g., show a notification to the user
    }
  };

  return (
    <>
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
        </div>
      </div>
    </div>
    </>
  );
};

export default SubscriptionPage;
