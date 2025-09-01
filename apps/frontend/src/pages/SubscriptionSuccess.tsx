import React, { useEffect, useState } from 'react';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { CheckCircle, Crown, ArrowRight, BookOpen, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionData {
  id: string;
  status: string;
  product_title: string;
  amount_cents: number;
  currency: string;
  interval: string;
  current_period_end: string;
}

const SubscriptionSuccess: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId && isAuthenticated) {
      fetchSubscriptionData(sessionId);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchSubscriptionData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }

      const data = await response.json();
      setSubscription(data.subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amountCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your subscription.</p>
          <a
            href="/login"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <a
            href="/subscriptions"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Subscriptions
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Header */}
      <section className="relative bg-gradient-to-br from-green-50 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Welcome to the Zoroasterverse!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your subscription is now active. Get ready to dive into an epic journey of adventure and discovery.
            </p>
          </motion.div>

          {subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-card border rounded-xl p-6 max-w-lg mx-auto mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-semibold">{subscription.product_title}</h3>
              </div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(subscription.amount_cents, subscription.currency)}
                </div>
                <div className="text-muted-foreground">
                  per {subscription.interval}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Next billing: {formatDate(subscription.current_period_end)}</p>
                <p className="mt-1">Status: <span className="text-green-600 font-medium">{subscription.status}</span></p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* What's Next Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What's Next?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <BookOpen className="w-8 h-8 text-primary" />,
                title: 'Start Reading',
                description: 'Access your complete library of chapters and exclusive content.',
                action: { text: 'Go to Library', href: '/library' }
              },
              {
                icon: <Users className="w-8 h-8 text-primary" />,
                title: 'Join the Community',
                description: 'Connect with other readers, share theories, and discuss the latest chapters.',
                action: { text: 'Join Discussions', href: '/community' }
              },
              {
                icon: <Zap className="w-8 h-8 text-primary" />,
                title: 'Manage Subscription',
                description: 'View your billing history, update payment methods, and manage your account.',
                action: { text: 'Account Settings', href: '/account/subscription' }
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="bg-card border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{item.description}</p>
                <a
                  href={item.action.href}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  {item.action.text}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Need Help?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            If you have any questions about your subscription or need assistance accessing content, 
            our support team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/support"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="border border-border hover:border-primary/50 hover:bg-background/50 text-foreground px-6 py-3 rounded-lg transition-all"
            >
              View FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionSuccess;
