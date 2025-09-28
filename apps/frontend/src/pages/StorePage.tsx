import React from 'react';
import { Search, Grid, List, ShoppingCart, Star, Eye, Book, Scroll, Crown, Sparkles } from 'lucide-react';

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section - Persian Mythology Themed */}
      <div className="relative overflow-hidden border-b border-amber-500/20">
        {/* Sacred Fire Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-radial from-amber-500/30 to-transparent rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-radial from-red-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-gradient-radial from-amber-400/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-amber-500/25">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              Sacred Treasury
            </h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-slate-200 mb-4 font-light">
              <span className="text-amber-400">Zoroasterverse</span> Digital Collection
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Discover epic tales of <span className="text-amber-400">ancient wisdom</span>, 
              cosmic adventures, and the eternal battle between <span className="text-red-400">light</span> and <span className="text-slate-400">darkness</span>.
              Immerse yourself in Persian mythology brought to life through modern storytelling.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mt-8 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Book className="w-4 h-4" />
              <span>8 Products</span>
            </div>
            <div className="flex items-center space-x-2">
              <Scroll className="w-4 h-4" />
              <span>Digital Library</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Premium Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-500/25">
            <Crown className="w-12 h-12 text-white" />
          </div>
          
          <h3 className="text-3xl font-bold text-slate-200 mb-4">Sacred Treasury Opening Soon</h3>
          
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're preparing an extraordinary collection of Persian mythology books, guides, and digital treasures. 
            The sacred fires are being lit, and the ancient wisdom is being compiled for your journey.
          </p>
          
          {/* Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Sample Product Cards */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all duration-300 group">
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center border border-slate-600/50">
                <Book className="w-12 h-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-300">
                    <Book className="w-3 h-3" />
                    Book
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 text-red-300">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-100">Fire Temple Chronicles</h4>
                <p className="text-sm text-slate-400">Epic fantasy novel</p>
                <div className="text-xl font-bold text-amber-400">$12.99</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all duration-300 group">
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center border border-slate-600/50">
                <Scroll className="w-12 h-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 text-amber-300">
                    <Scroll className="w-3 h-3" />
                    Guide
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-100">Zoroastrian Wisdom</h4>
                <p className="text-sm text-slate-400">Modern guide to ancient teachings</p>
                <div className="text-xl font-bold text-amber-400">$7.99</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all duration-300 group">
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center border border-slate-600/50">
                <Crown className="w-12 h-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300">
                    <Crown className="w-3 h-3" />
                    Bundle
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-300">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-100">Complete Collection</h4>
                <p className="text-sm text-slate-400">Everything + bonus content</p>
                <div className="text-xl font-bold text-amber-400">$29.99</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all duration-300 group">
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center border border-slate-600/50">
                <Book className="w-12 h-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 text-emerald-300">
                    Free
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-100">Sample Chapter</h4>
                <p className="text-sm text-slate-400">Discover the Zoroasterverse</p>
                <div className="text-xl font-bold text-emerald-400">Free</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-amber-400 text-lg font-medium mb-2">
              🔥 May the Sacred Fire Light Your Path 🔥
            </p>
            <p className="text-slate-500 text-sm">
              "Good Thoughts, Good Words, Good Deeds" - Zarathustra
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}