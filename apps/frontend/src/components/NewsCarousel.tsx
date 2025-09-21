import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Eye, Calendar, User, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  slug: string;
  tags?: string[];
}

interface NewsCarouselProps {
  posts: BlogPost[];
}

export default function NewsCarousel({ posts }: NewsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || posts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posts.length);
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying, posts.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!posts.length) {
    return (
      <div className="w-full h-[600px] bg-muted/20 rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground">No news available</p>
      </div>
    );
  }

  const currentPost = posts[currentSlide];

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentPost.featured_image || '/api/placeholder/1200/600'}
          alt={currentPost.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 lg:p-12">
        <div className="max-w-4xl">
          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {currentPost.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Headline */}
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {currentPost.title}
          </h2>

          {/* Meta Information */}
          <div className="flex items-center gap-6 mb-4 text-white/80">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{currentPost.author || 'Zoroastervers'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(currentPost.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            {currentPost.views && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{currentPost.views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-2xl">
            {currentPost.excerpt || currentPost.content.substring(0, 200) + '...'}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Read More Button */}
            <Link
              to={`/blog/${currentPost.slug}`}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              <Play className="w-4 h-4" />
              Read Story
            </Link>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{currentPost.likes_count || 0}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{currentPost.comments_count || 0}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {posts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Progress Bar */}
      {isAutoPlaying && posts.length > 1 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{
              width: '100%',
              animation: 'progress 6s linear infinite'
            }}
          />
        </div>
      )}

      {/* CSS for progress bar animation */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}