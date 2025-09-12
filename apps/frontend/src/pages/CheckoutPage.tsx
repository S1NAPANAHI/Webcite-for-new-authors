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
  return (
    <div className="container">
      <div className="card cart">
        <label className="title">CHECKOUT</label>
        <div className="steps">
          <div className="step">
            <div>
              <span>SHIPPING ADDRESS</span>
              <p>{userProfile?.full_name || 'N/A'}</p>
              <p>{userProfile?.email || 'N/A'}</p>
            </div>
            <hr />
            <div>
              <span>SUBSCRIPTION PLAN</span>
              <p>{plan.name} ({plan.interval})</p>
              <p>${plan.price.toFixed(2)}</p>
            </div>
            <hr />
            <div>
              <span>PAYMENT METHOD</span>
              <CardElement options={{ style: { base: { color: '#ffffff' } } }} />
            </div>
            <hr />
            <div className="promo">
              <span>HAVE A PROMO CODE?</span>
              <form className="form">
                <input
                  className="input_field"
                  placeholder="Enter a Promo Code"
                  type="text"
                />
                <button>Apply</button>
              </form>
            </div>
            <hr />
            <div className="payments">
              <span>PAYMENT SUMMARY</span>
              <div className="details">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card checkout">
        <div className="footer">
          <label className="price">${total.toFixed(2)}</label>
          <button className="checkout-btn" onClick={handleSubmit} disabled={!stripe || !elements || processing}>
            {processing ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
