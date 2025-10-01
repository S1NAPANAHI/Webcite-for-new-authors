import React from 'react';
import { ArrowRight, BookOpen, Star, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UIHomePageProps {
  data?: any;
  loading?: boolean;
  error?: any;
}

export const UIHomePage: React.FC<UIHomePageProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homepage content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Content Loading Error</h3>
          <p className="text-red-600 text-sm">There was an issue loading homepage content. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/starry-bg.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Welcome to <span className="text-amber-600 dark:text-amber-400">Zoroastervers</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Discover the ancient wisdom of Zoroastrianism and its profound impact on modern thought, 
            philosophy, and spiritual understanding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/blog"
              className="px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              Explore Articles
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-amber-600 text-amber-600 dark:text-amber-400 font-semibold rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Join the Community
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with fellow seekers, scholars, and practitioners from around the world
          </p>
          <Link
            to="/community"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Explore Community
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sacred Texts & Teachings
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore the profound wisdom of the Avesta, Gathas, and other sacred Zoroastrian texts
          </p>
          <Link
            to="/texts"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Browse Texts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UIHomePage;