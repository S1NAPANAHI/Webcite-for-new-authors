import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  LoadingSkeleton
} from '@zoroaster/ui';
import { Check, Crown, Zap, Star, Shield, Heart } from 'lucide-react';

// Types
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  price_amount: number;
  currency: string;
  billing_interval: string;
  stripe_price_id: string;
  privileges: Record<string, boolean | number>;
  is_active: boolean;
  sort_order: number;
}

interface UserSubscription {
  id: string;
  status: string;
  current_period_end: string;
  subscription_plan_id: string;
  plan_name: string;
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SubscriptionsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user's current subscription
  const { data: currentSubscription } = useQuery<UserSubscription | null>({
    queryKey: ['current-subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans!inner(name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? {
        ...data,
        plan_name: data.subscription_plans?.name
      } : null;
    }
  });

  // Handle subscription creation
  const createSubscription = useMutation({
    mutationFn: async (priceId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please log in to subscribe');

      // Call your backend API to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
    },
  });

  const formatPrice = (amount: number, currency: string, interval: string) => {
    const price = (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return `${price}/${interval}`;
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('beta')) return <Shield className="w-6 h-6" />;
    if (name.includes('premium')) return <Zap className="w-6 h-6" />;
    if (name.includes('ultimate') || name.includes('patron')) return <Crown className="w-6 h-6" />;
    return <Star className="w-6 h-6" />;
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('beta')) return 'from-blue-500 to-blue-600';
    if (name.includes('premium')) return 'from-purple-500 to-purple-600';
    if (name.includes('ultimate') || name.includes('patron')) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.subscription_plan_id === planId;
  };

  if (plansLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <LoadingSkeleton className="h-8 w-64 mx-auto mb-4" />
          <LoadingSkeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-red-500 mr-2" />
            <h1 className="text-4xl md:text-5xl font-bold text-white font-['Cinzel']">
              Support the Zoroasterverse
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join our community and unlock exclusive content, early access, and special privileges. 
            Your support helps bring the ancient wisdom of Zarathustra to the modern world.
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Currently subscribed to {currentSubscription.plan_name}
                    </h3>
                    <p className="text-green-300">
                      Active until {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="success" className="bg-green-500/20 text-green-300">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                isCurrentPlan(plan.id) 
                  ? 'ring-2 ring-yellow-500 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5' 
                  : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700/50 hover:to-slate-800/50'
              } border-slate-700`}
            >
              {/* Plan Icon & Popular Badge */}
              <div className="absolute top-4 right-4">
                {plan.name.toLowerCase().includes('premium') && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Most Popular
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getPlanColor(plan.name)}`}>
                    {getPlanIcon(plan.name)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white font-['Cinzel']">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-1">
                      {plan.description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(plan.price_amount, plan.currency, plan.billing_interval)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => {
                    setIsLoading(plan.id);
                    createSubscription.mutate(plan.stripe_price_id);
                  }}
                  disabled={isCurrentPlan(plan.id) || isLoading !== null}
                  className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                    isCurrentPlan(plan.id)
                      ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                      : `bg-gradient-to-r ${getPlanColor(plan.name)} hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5`
                  }`}
                >
                  {isLoading === plan.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : isCurrentPlan(plan.id) ? (
                    'Current Plan'
                  ) : (
                    'Choose Plan'
                  )}
                </Button>

                {isCurrentPlan(plan.id) && (
                  <p className="text-center text-sm text-green-300 mt-2">
                    You're currently subscribed to this plan
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8 font-['Cinzel']">
            Why Subscribe?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Exclusive Access</h3>
              <p className="text-gray-300">
                Get early access to new releases, beta content, and exclusive materials
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Support the Mission</h3>
              <p className="text-gray-300">
                Help preserve and share ancient Zoroastrian wisdom with the modern world
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Features</h3>
              <p className="text-gray-300">
                Unlock advanced features, priority support, and special privileges
              </p>
            </div>
          </div>
        </div>

        {/* FAQ or Contact */}
        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Questions about subscriptions? 
            <a href="/contact" className="text-blue-400 hover:text-blue-300 ml-1">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
