import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | string;
  trend?: number;
  icon: React.ElementType;
  color?: string;
  format?: 'number' | 'currency' | 'percentage';
  subtitle?: string;
  loading?: boolean;
}

export function KpiCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  color = 'from-blue-500 to-blue-600', 
  format = 'number',
  subtitle,
  loading = false
}: KpiCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (loading) return '--';
    
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendColor = (trend?: number) => {
    if (!trend || loading) return 'text-gray-500';
    return trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500';
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend || loading) return Minus;
    return trend > 0 ? TrendingUp : TrendingDown;
  };

  const TrendIcon = getTrendIcon(trend);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          
          <div className="mb-3">
            <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
              {formatValue(value)}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          {trend !== undefined && !loading && (
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="font-medium">{Math.abs(trend)}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Alternative compact version
export function KpiCardCompact({ 
  title, 
  value, 
  icon: Icon, 
  color = 'from-blue-500 to-blue-600',
  format = 'number',
  loading = false
}: Omit<KpiCardProps, 'trend' | 'subtitle'>) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (loading) return '--';
    
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-14"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-lg font-bold text-gray-900">
            {formatValue(value)}
          </p>
        </div>
      </div>
    </div>
  );
}