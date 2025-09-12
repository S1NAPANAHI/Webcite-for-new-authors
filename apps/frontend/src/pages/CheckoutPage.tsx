import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@zoroaster/shared'; // Assuming supabase is used for auth
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './CheckoutPage.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

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

interface UserProfile {
  full_name: string;
  email: string;
  // Add other relevant user profile fields here, e.g., address
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const [priceId, setPriceId] = useState<string | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !plan || !priceId) {
      // Stripe.js has not yet loaded. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Failed to create payment method.');
        setProcessing(false);
        return;
      }

      // Send paymentMethod.id and priceId to your backend to create the subscription
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        throw new Error('User not authenticated.');
      }

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId: priceId,
        }),
      });

      const subscriptionData = await response.json();

      if (!response.ok) {
        throw new Error(subscriptionData.error || 'Failed to create subscription.');
      }

      // Handle successful subscription (e.g., redirect to success page)
      window.location.href = '/subscription-success';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const fetchCheckoutData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('priceId');
        if (!id) {
          setError('No priceId provided in URL.');
          setLoading(false);
          return;
        }
        setPriceId(id);

        // Fetch user profile
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('User not authenticated.');
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email') // Select relevant fields
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw new Error(profileError.message);
        }
        setUserProfile(profileData);

        // Fetch plan details from a new API endpoint
        // For now, still using mock data, but this is where the fetch would go
        const mockPlans: SubscriptionPlan[] = [
          {
            id: 'price_1S2L8JQv3TvmaocsYofzFKgm',
            name: 'Monthly Membership',
            price: 9.99,
            interval: 'month',
            features: [],
            paypalPlanId: 'prod_SyHh0v9pcletkx',
            highlight: 'Perfect for new readers'
          },
          {
            id: 'price_1S2L95Qv3TvmaocsN5zRIEXO',
            name: 'Annual Membership',
            price: 99.99,
            interval: 'year',
            features: [],
            paypalPlanId: 'prod_SyHiFk24bHGA2U',
            highlight: 'Best value - Save $19.89'
          }
        ];
        const selectedPlan = mockPlans.find(p => p.id === id);
        if (selectedPlan) {
          setPlan(selectedPlan);
        } else {
          setError('Subscription plan not found.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [location.search]);

  if (loading) {
    return <div className="container">Loading checkout details...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  if (!plan) {
    return <div className="container">No subscription plan selected.</div>;
  }

  const subtotal = plan.price;
  const shipping = 0; // Subscriptions typically don't have shipping
  const taxRate = 0.05; // Example tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="checkout-card">
      <div className="progress">
        <div className="progress-bar"></div>
      </div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="Your full name" value={userProfile?.full_name || ''} readOnly />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="you @example.com" value={userProfile?.email || ''} readOnly />

        {/* Address field is not directly available from userProfile, keeping it as placeholder for now */}
        <label htmlFor="address">Address</label>
        <input type="text" id="address" placeholder="Street, City, ZIP" />

        <label>Card Details</label>
        <CardElement options={{ style: { base: { color: '#ffffff', '::placeholder': { color: '#aab7c4' } } } }} />

        <div className="order-summary">
            <img src="https://via.placeholder.com/50x50" alt="Product">
            <span>{plan.name}</span>
            <span>${plan.price.toFixed(2)}</span>
        </div>

        <button className="pay-btn" type="submit" disabled={!stripe || !elements || processing}>
          {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>
      </form>
      <div className="trust">
          <i>🔒</i> Secure checkout – 256-bit encryption
      </div>
    </div>
  );
};

export default CheckoutPage;
