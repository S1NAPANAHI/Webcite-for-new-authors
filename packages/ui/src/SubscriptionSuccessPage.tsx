import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, BookOpen, Users, Star, ArrowRight, Crown } from 'lucide-react';

export const SubscriptionSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = searchParams.get('session_id');
    setSessionId(session);
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Success Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to the Zoroasterverse!
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Your subscription is now active. You're ready to dive into the world of episodic storytelling 
              and join our community of readers.
            </p>
            
            {sessionId && (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-8 inline-block">
                <p className="text-gray-300 text-sm">
                  Session ID: <span className="font-mono text-green-400">{sessionId}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What's Next Section */}
      <div className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            What Happens Next?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Access Your Library</h3>
              <p className="text-gray-300">
                Visit your library to read all available chapters and exclusive content.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-300">
                You'll receive notifications when new chapters are ready to read.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Join the Community</h3>
              <p className="text-gray-300">
                Connect with fellow readers and discuss theories in our community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Get Started Right Away
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              to="/library"
              className="bg-purple-600 hover:bg-purple-700 text-white p-8 rounded-2xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Visit Your Library</h3>
                  <p className="text-purple-100 mb-6">
                    Access all available chapters and start reading immediately.
                  </p>
                </div>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            
            <Link
              to="/account"
              className="bg-gray-700 hover:bg-gray-600 text-white p-8 rounded-2xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Manage Subscription</h3>
                  <p className="text-gray-300 mb-6">
                    View your subscription details and manage your account.
                  </p>
                </div>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome Bonus Section */}
      <div className="py-20 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Welcome Bonus Unlocked!
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              As a new subscriber, you now have access to exclusive content including:
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Behind the Scenes</h3>
                <p className="text-gray-300">Author notes, character development insights, and world-building details.</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Community Access</h3>
                <p className="text-gray-300">Join discussions, share theories, and connect with fellow readers.</p>
              </div>
            </div>
            <Link
              to="/library"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              Explore Your Library
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Questions or Need Help?
          </h3>
          <p className="text-gray-300 mb-6">
            Our support team is here to help you get the most out of your subscription.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/account"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


