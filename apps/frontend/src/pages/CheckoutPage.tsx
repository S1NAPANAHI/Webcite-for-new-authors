import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { buildApiUrl, logApiConfig } from '../lib/config';
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
}

interface CreditCardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

const CheckoutForm: React.FC = () => {
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const [priceId, setPriceId] = useState<string | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  
  // Credit card animation states
  const [cardData, setCardData] = useState<CreditCardData>({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentCardBackground] = useState(Math.floor(Math.random() * 25) + 1);

  // Log API configuration on component mount for debugging
  useEffect(() => {
    logApiConfig();
  }, []);

  // Detect card type based on number
  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    if (/^6011/.test(num)) return 'discover';
    if (/^9792/.test(num)) return 'troy';
    return 'visa'; // default
  };

  // Format card number with spaces
  const formatCardNumber = (number: string) => {
    const cardType = getCardType(number);
    const cleaned = number.replace(/\s/g, '');
    if (cardType === 'amex') {
      return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  };

  const maskCardNumber = (number: string) => {
    if (!number) return '#### #### #### ####';
    const cardType = getCardType(number);
    if (cardType === 'amex') {
      return number.split('').map((char, index) => {
        if (index > 4 && index < 14 && char !== ' ') return '*';
        return char;
      }).join('');
    }
    return number.split('').map((char, index) => {
      if (index > 4 && index < 15 && char !== ' ') return '*';
      return char;
    }).join('');
  };

  const handleCardNumberChange = (event: any) => {
    if (event.complete && event.value) {
      const formatted = formatCardNumber(event.value);
      setCardData(prev => ({ ...prev, number: formatted }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !plan || !priceId) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      console.log('Starting payment process...');
      
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        throw new Error('Card number element not found');
      }

      console.log('Creating payment method...');
      
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: cardData.name || userProfile?.full_name || '',
          email: userProfile?.email || '',
        },
      });

      if (paymentMethodError) {
        console.error('Payment method creation failed:', paymentMethodError);
        setError(paymentMethodError.message || 'Failed to create payment method.');
        setProcessing(false);
        return;
      }

      console.log('Payment method created:', paymentMethod.id);

      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        console.error('Authentication error:', authError);
        throw new Error('User not authenticated. Please log in and try again.');
      }

      console.log('User authenticated, creating subscription...');

      // Use the centralized API configuration
      const requestUrl = buildApiUrl('stripe/create-subscription');
      
      console.log('API Configuration Debug:');
      logApiConfig();
      console.log('Request URL:', requestUrl);
      
      console.log('Request payload:', {
        paymentMethodId: paymentMethod.id,
        priceId: priceId,
      });

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId: priceId,
        }),
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Server returned non-JSON response: ${textResponse || 'Empty response'}`);
      }

      let subscriptionData;
      try {
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        if (!responseText) {
          throw new Error('Empty response from server');
        }
        
        subscriptionData = JSON.parse(responseText);
        console.log('Parsed subscription data:', subscriptionData);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        console.error('API error response:', subscriptionData);
        throw new Error(subscriptionData.error || `Server error: ${response.status}`);
      }

      // Check if subscription was created successfully
      if (!subscriptionData.success && !subscriptionData.subscriptionId) {
        console.error('Subscription creation failed:', subscriptionData);
        throw new Error('Subscription creation failed');
      }

      console.log('Subscription created successfully:', subscriptionData.subscriptionId);
      
      // Redirect to success page
      window.location.href = '/subscription-success';

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
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

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('User not authenticated.');
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.warn('Profile fetch error (using fallback):', profileError);
          // Use user email as fallback
          setUserProfile({
            full_name: user.user_metadata?.full_name || '',
            email: user.email || ''
          });
          setCardData(prev => ({ ...prev, name: user.user_metadata?.full_name || '' }));
        } else {
          setUserProfile(profileData);
          setCardData(prev => ({ ...prev, name: profileData.full_name || '' }));
        }

        // Mock plans - replace with actual API call
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
        console.error('Checkout data fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [location.search]);

  if (loading) {
    return (
      <div className="wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <div className="error-container">
          <h2>Checkout Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.href = '/subscriptions';
            }}
            className="card-form__button"
            style={{ maxWidth: '200px', marginTop: '20px' }}
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="wrapper">
        <div className="error-container">
          <h2>No Plan Selected</h2>
          <p>No subscription plan selected.</p>
          <button 
            onClick={() => window.location.href = '/subscriptions'}
            className="card-form__button"
            style={{ maxWidth: '200px', marginTop: '20px' }}
          >
            Choose a Plan
          </button>
        </div>
      </div>
    );
  }

  const subtotal = plan.price;
  const shipping = 0;
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="wrapper">
      <div className="card-form">
        {/* Animated Credit Card */}
        <div className="card-list">
          <div className={`card-item ${isCardFlipped ? '-active' : ''}`}>
            {/* Card Front */}
            <div className="card-item__side -front">
              <div className={`card-item__focus ${focusedField ? '-active' : ''}`} />
              <div className="card-item__cover">
                <div className="card-item__bg" style={{
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                  width: '100%',
                  height: '100%'
                }}></div>
              </div>
              <div className="card-item__wrapper">
                <div className="card-item__top">
                  <div className="card-item__chip" style={{
                    width: '60px',
                    height: '45px',
                    background: 'linear-gradient(135deg, #c9aa53, #f4e4a6)',
                    borderRadius: '8px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#8b7914',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>CHIP</div>
                  </div>
                  <div className="card-item__type">
                    <div style={{
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>{getCardType(cardData.number)}</div>
                  </div>
                </div>
                <div className="card-item__number">
                  {maskCardNumber(cardData.number)}
                </div>
                <div className="card-item__content">
                  <div className="card-item__info">
                    <div className="card-item__holder">Card Holder</div>
                    <div className="card-item__name">
                      {cardData.name || 'Full Name'}
                    </div>
                  </div>
                  <div className="card-item__date">
                    <div className="card-item__dateTitle">Expires</div>
                    <div className="card-item__dateItem">
                      {cardData.expiry || 'MM/YY'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Card Back */}
            <div className="card-item__side -back">
              <div className="card-item__cover">
                <div className="card-item__bg" style={{
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                  width: '100%',
                  height: '100%'
                }}></div>
              </div>
              <div className="card-item__band" />
              <div className="card-item__cvv">
                <div className="card-item__cvvTitle">CVV</div>
                <div className="card-item__cvvBand">
                  {cardData.cvv.split('').map((_, index) => (
                    <span key={index}>*</span>
                  ))}
                </div>
                <div className="card-item__type">
                  <div style={{
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    opacity: 0.7
                  }}>{getCardType(cardData.number)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card-form__inner">
          <div className="checkout-header">
            <h1>Complete Your Order</h1>
            <div className="order-summary">
              <div className="plan-info">
                <h3>{plan.name}</h3>
                <p>{plan.highlight}</p>
              </div>
              <div className="plan-price">${plan.price.toFixed(2)}</div>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{
              background: '#ffe6e6',
              color: '#d63031',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fab1a0'
            }}>
              <strong>Payment Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="card-input">
              <label htmlFor="cardNumber" className="card-input__label">Card Number</label>
              <div className="card-input__wrapper">
                <CardNumberElement
                  id="cardNumber"
                  className="card-input__input"
                  onChange={handleCardNumberChange}
                  onFocus={() => setFocusedField('cardNumber')}
                  onBlur={() => setFocusedField(null)}
                  options={{
                    style: {
                      base: {
                        fontSize: '18px',
                        color: '#1a3b5d',
                        fontFamily: '"Source Sans Pro", sans-serif',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#fa755a',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="card-input">
              <label htmlFor="cardName" className="card-input__label">Card Holder</label>
              <input
                type="text"
                id="cardName"
                className="card-input__input"
                value={cardData.name}
                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                onFocus={() => setFocusedField('cardName')}
                onBlur={() => setFocusedField(null)}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="card-form__row">
              <div className="card-form__col">
                <div className="card-input">
                  <label htmlFor="cardExpiry" className="card-input__label">Expiration Date</label>
                  <div className="card-input__wrapper">
                    <CardExpiryElement
                      id="cardExpiry"
                      className="card-input__input"
                      onChange={(event) => {
                        if (event.complete && event.value) {
                          const expiry = `${event.value.month?.toString().padStart(2, '0')}/${event.value.year?.toString().slice(2)}`;
                          setCardData(prev => ({ ...prev, expiry }));
                        }
                      }}
                      onFocus={() => setFocusedField('cardDate')}
                      onBlur={() => setFocusedField(null)}
                      options={{
                        style: {
                          base: {
                            fontSize: '18px',
                            color: '#1a3b5d',
                            fontFamily: '"Source Sans Pro", sans-serif',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#fa755a',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="card-form__col -cvv">
                <div className="card-input">
                  <label htmlFor="cardCvv" className="card-input__label">CVV</label>
                  <div className="card-input__wrapper">
                    <CardCvcElement
                      id="cardCvv"
                      className="card-input__input"
                      onChange={(event) => {
                        if (event.complete) {
                          setCardData(prev => ({ ...prev, cvv: '***' }));
                        }
                      }}
                      onFocus={() => {
                        setFocusedField('cardCvv');
                        setIsCardFlipped(true);
                      }}
                      onBlur={() => {
                        setFocusedField(null);
                        setIsCardFlipped(false);
                      }}
                      options={{
                        style: {
                          base: {
                            fontSize: '18px',
                            color: '#1a3b5d',
                            fontFamily: '"Source Sans Pro", sans-serif',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#fa755a',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-summary">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-line total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="card-form__button" type="submit" disabled={!stripe || !elements || processing}>
              {processing ? (
                <span>
                  <div className="button-spinner"></div>
                  Processing Payment...
                </span>
              ) : (
                `Complete Payment • $${total.toFixed(2)}`
              )}
            </button>
          </form>

          <div className="trust-badges">
            <div className="trust-item">
              🔒 SSL Secured
            </div>
            <div className="trust-item">
              💳 256-bit Encryption
            </div>
            <div className="trust-item">
              ⚡ Instant Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;