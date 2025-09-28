import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden border-b border-slate-700/50 pb-16">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-slate-800 rounded-lg mr-4 animate-pulse" />
            <div className="h-12 w-80 bg-slate-800 rounded-lg animate-pulse" />
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-8 w-96 bg-slate-800 rounded-lg mx-auto animate-pulse" />
            <div className="h-6 w-full max-w-2xl bg-slate-800 rounded-lg mx-auto animate-pulse" />
            <div className="h-6 w-full max-w-xl bg-slate-800 rounded-lg mx-auto animate-pulse" />
          </div>

          <div className="flex justify-center space-x-8 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-slate-800 rounded animate-pulse" />
                <div className="w-20 h-4 bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="container mx-auto px-4">
        <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 h-12 bg-slate-800 rounded-xl animate-pulse" />
            <div className="w-40 h-12 bg-slate-800 rounded-xl animate-pulse" />
            <div className="w-48 h-12 bg-slate-800 rounded-xl animate-pulse" />
            <div className="w-24 h-12 bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Results info skeleton */}
        <div className="h-6 w-48 bg-slate-800 rounded animate-pulse mb-6" />

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-slate-800 rounded-lg mb-4" />
      
      {/* Content skeleton */}
      <div className="space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-4 h-4 bg-slate-800 rounded" />
            ))}
          </div>
          <div className="w-8 h-4 bg-slate-800 rounded" />
        </div>

        {/* Price */}
        <div className="h-6 w-20 bg-slate-800 rounded" />

        {/* Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-slate-800 rounded-lg" />
            <div className="flex-1 h-9 bg-slate-800 rounded-lg" />
          </div>
          <div className="w-full h-9 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
};