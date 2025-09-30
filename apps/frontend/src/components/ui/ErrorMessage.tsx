import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'cosmic';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Error',
  onRetry,
  className = '',
  variant = 'cosmic'
}) => {
  const baseClasses = variant === 'cosmic' 
    ? 'bg-red-900/20 border-red-500/30 backdrop-blur-sm'
    : 'bg-red-50 border-red-200';
  
  const textClasses = variant === 'cosmic'
    ? 'text-red-300'
    : 'text-red-800';
    
  const titleClasses = variant === 'cosmic'
    ? 'text-red-200'
    : 'text-red-900';

  return (
    <div className={`
      border rounded-xl p-6 ${baseClasses} ${className}
    `} role="alert">
      <div className="flex items-start">
        {/* Error Icon */}
        <div className={`flex-shrink-0 mr-4 ${variant === 'cosmic' ? 'text-red-400' : 'text-red-600'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${titleClasses}`}>
            {title}
          </h3>
          <p className={`${textClasses} leading-relaxed`}>
            {message}
          </p>
          
          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className={`
                mt-4 px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${variant === 'cosmic' 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50' 
                  : 'bg-red-600 text-white hover:bg-red-700'
                }
                flex items-center space-x-2 hover:scale-105 active:scale-95
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Specialized cosmic error for timeline failures
export const CosmicTimelineError: React.FC<{ error: string; onRetry?: () => void }> = ({ 
  error, 
  onRetry 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Cosmic Error Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto border-4 border-red-500/30 rounded-full relative">
            <div className="absolute inset-2 border-2 border-red-400/50 rounded-full">
              <div className="absolute inset-2 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {/* Broken orbit effect */}
            <div className="absolute -inset-4 border border-red-500/20 rounded-full border-dashed animate-spin" style={{ animationDuration: '8s' }}></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-red-300 mb-4">Cosmic Disruption Detected</h2>
        <p className="text-red-200/80 mb-6 leading-relaxed">
          The timeline has encountered a temporal anomaly. {error}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Restore Timeline</span>
          </button>
        )}
      </div>
    </div>
  );
};