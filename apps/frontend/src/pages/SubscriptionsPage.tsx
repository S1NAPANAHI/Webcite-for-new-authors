import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';
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
// Types
interface Product {
  id: string; // UUID from Supabase
  stripe_product_id: string; // Stripe's product ID (prod_...)
  name: string;
  description: string;
  active: boolean;
  image?: string;
  metadata?: Record<string, any>;
  product_variants: ProductVariant[]; // Joined from product_variants table
}

interface ProductVariant {
  id: string; // UUID from Supabase
  stripe_price_id: string; // Stripe's price ID (price_...)
  name: string; // e.g., "Monthly", "Annual"
  unit_amount: number; // Amount in cents
  currency: string;
  recurring_interval?: string; // e.g., "month", "year"
  recurring_interval_count?: number;
  active: boolean;
  is_default: boolean;
}

interface UserSubscription {
  id: string;
  status: string;
  current_period_end: string;
  price_id: string; // References Stripe Price ID
  // Add other fields from your 'subscriptions' table as needed
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SubscriptionsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch products and their variants (prices) from Supabase
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['subscription-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          stripe_product_id,
          name,
          description,
          active,
          image,
          metadata,
          product_variants (
            id,
            stripe_price_id,
            name,
            unit_amount,
            currency,
            recurring_interval,
            recurring_interval_count,
            active,
            is_default
          )
        `)
        .eq('active', true); // Only fetch active products

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
        .from('subscriptions')
        .select('*') // Select all fields from the subscriptions table
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing']) // Consider 'trialing' as active
        .single();

      if (error && error.code === 'PGRST116') { // No rows found
        return null;
      }
      if (error) throw error;
      return data || null;
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session.');
      }
      
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
    onError: (error) => {
      console.error('Error creating subscription:', error);
      alert(error.message);
    },
    onSettled: () => {
      setIsLoading(null); // Reset loading state after mutation
    }
  });

  // Handle managing subscription via Stripe Billing Portal
  const manageSubscription = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please log in to manage your subscription');

      const response = await fetch('/api/manage-billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create billing portal session.');
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe Billing Portal
    },
    onError: (error) => {
      console.error('Error managing subscription:', error);
      alert(error.message);
    },
    onSettled: () => {
      setIsLoading(null); // Reset loading state after mutation
    }
  });

  const formatPrice = (amount: number, currency: string, interval?: string) => {
    const price = (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return interval ? `${price}/${interval}` : price;
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

  // Check if the current user is subscribed to any variant of this product
  const isCurrentPlan = (productStripeId: string, priceStripeId: string) => {
    // Check if the current subscription's price_id matches any of the product's variants
    return currentSubscription?.price_id === priceStripeId;
  };

  if (productsLoading) {
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
                      Currently subscribed
                    </h3>
                    <p className="text-green-300">
                      Active until {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="success" className="bg-green-500/20 text-green-300">
                    Active
                  </Badge>
                </div>
                <div className="mt-4 text-right">
                  <Button
                    onClick={() => manageSubscription.mutate()}
                    disabled={manageSubscription.isPending}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    {manageSubscription.isPending ? 'Loading...' : 'Manage Subscription'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            // Render a card for each product
            <Card 
              key={product.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                // Check if any variant of this product is the current plan
                product.product_variants.some(variant => isCurrentPlan(product.stripe_product_id, variant.stripe_price_id))
                  ? 'ring-2 ring-yellow-500 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5' 
                  : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700/50 hover:to-slate-800/50'
              } border-slate-700`}
            >
              {/* Plan Icon & Popular Badge */}
              <div className="absolute top-4 right-4">
                {product.name.toLowerCase().includes('premium') && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Most Popular
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getPlanColor(product.name)}`}>
                    {getPlanIcon(product.name)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white font-['Cinzel']">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-1">
                      {product.description}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Render each variant (price option) for the product */}
                {product.product_variants.map((variant) => (
                  <div key={variant.id} className="text-center mb-4">
                    <span className="text-4xl font-bold text-white">
                      {formatPrice(variant.unit_amount, variant.currency, variant.recurring_interval)}
                    </span>
                    <p className="text-gray-400 text-sm">{variant.name}</p> {/* Display variant name */}
                  </div>
                ))}
              </CardHeader>

              <CardContent className="pt-0">
                {/* Features - Assuming features are part of the product description or metadata */}
                {/* You might need to adjust this part based on where your features are stored */}
                <div className="space-y-3 mb-8">
                  {/* Placeholder for features, adapt as needed */}
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 leading-relaxed">Access to exclusive content</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 leading-relaxed">Priority support</span>
                  </div>
                  {/* Add more features based on your product data */}
                </div>

                {/* CTA Button for each variant */}
                {product.product_variants.map((variant) => (
                  <Button
                    key={variant.id}
                    onClick={() => {
                      setIsLoading(variant.stripe_price_id); // Use price ID for loading state
                      createSubscription.mutate(variant.stripe_price_id);
                    }}
                    disabled={isCurrentPlan(product.stripe_product_id, variant.stripe_price_id) || isLoading !== null}
                    className={`w-full py-3 text-lg font-semibold transition-all duration-300 mb-2 ${
                      isCurrentPlan(product.stripe_product_id, variant.stripe_price_id)
                        ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                        : `bg-gradient-to-r ${getPlanColor(product.name)} hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5`
                    }`}
                  >
                    {isLoading === variant.stripe_price_id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrentPlan(product.stripe_product_id, variant.stripe_price_id) ? (
                      'Current Plan'
                    ) : (
                      `Choose ${variant.name} Plan`
                    )}
                  </Button>
                ))}

                {product.product_variants.some(variant => isCurrentPlan(product.stripe_product_id, variant.stripe_price_id)) && (
                  <p className="text-center text-sm text-green-300 mt-2">
                    You're currently subscribed to a variant of this plan
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
