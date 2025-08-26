import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 4, viewMode = 'grid' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`${
        viewMode === 'grid'
          ? 'bg-background-light/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden'
          : 'bg-background-light/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30'
      }`}
    >
      {/* Cover Image Skeleton */}
      <div className="h-64 bg-gradient-to-r from-border/20 to-border/40 skeleton"></div>
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-border/20 rounded skeleton mb-3"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-border/20 rounded skeleton"></div>
          <div className="h-4 bg-border/20 rounded skeleton w-3/4"></div>
          <div className="h-4 bg-border/20 rounded skeleton w-1/2"></div>
        </div>
        
        {/* Formats Skeleton */}
        <div className="mb-4">
          <div className="h-4 bg-border/20 rounded skeleton w-24 mb-2"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-border/20 rounded-full skeleton w-16"></div>
            <div className="h-6 bg-border/20 rounded-full skeleton w-20"></div>
          </div>
        </div>
        
        {/* Price Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-border/20 rounded skeleton w-20 mb-2"></div>
          <div className="h-4 bg-border/20 rounded skeleton w-32"></div>
        </div>
        
        {/* Button Skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-border/20 rounded-xl skeleton"></div>
          <div className="h-10 bg-border/20 rounded-xl skeleton"></div>
        </div>
      </div>
    </div>
  ));

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }
    >
      {skeletons}
    </div>
  );
};

export default LoadingSkeleton;
