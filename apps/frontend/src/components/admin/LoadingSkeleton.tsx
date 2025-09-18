import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

function Skeleton({ className = '', width = 'w-full', height = 'h-4', rounded = false }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${width} ${height} ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
    ></div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton width="w-24" height="h-4" className="mb-2" />
            <Skeleton width="w-16" height="h-8" className="mb-2" />
            <Skeleton width="w-32" height="h-4" />
          </div>
          <Skeleton width="w-12" height="h-12" rounded />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton height="h-4" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="animate-pulse">
          <Skeleton width="w-32" height="h-6" />
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <Skeleton height="h-4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, index) => (
              <TableRowSkeleton key={index} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="animate-pulse">
        <Skeleton width="w-3/4" height="h-6" className="mb-4" />
        <div className="space-y-3">
          <Skeleton />
          <Skeleton width="w-5/6" />
          <Skeleton width="w-4/6" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="animate-pulse">
          <Skeleton width="w-32" height="h-6" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 animate-pulse">
              <Skeleton width="w-10" height="h-10" rounded />
              <div className="flex-1 space-y-2">
                <Skeleton width="w-3/4" />
                <Skeleton width="w-1/2" height="h-3" />
              </div>
              <Skeleton width="w-16" height="h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="animate-pulse">
          <Skeleton width="w-64" height="h-8" className="mb-2" />
          <Skeleton width="w-96" height="h-4" />
        </div>
        <Skeleton width="w-32" height="h-6" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Full width card */}
      <CardSkeleton />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="animate-pulse space-y-6">
        {/* Form header */}
        <div>
          <Skeleton width="w-48" height="h-6" className="mb-2" />
          <Skeleton width="w-96" height="h-4" />
        </div>
        
        {/* Form fields */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton width="w-24" height="h-4" className="mb-2" />
              <Skeleton height="h-10" />
            </div>
          ))}
        </div>
        
        {/* Form actions */}
        <div className="flex space-x-4">
          <Skeleton width="w-24" height="h-10" />
          <Skeleton width="w-20" height="h-10" />
        </div>
      </div>
    </div>
  );
}

// Generic loading component with spinner
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${sizeClasses[size]} ${className}`}></div>
  );
}

export function CenteredLoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

export default Skeleton;