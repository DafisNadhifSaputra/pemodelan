import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ 
  children, 
  fallback,
  className = ""
}) => {
  const defaultFallback = (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-32 mx-auto animate-pulse"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-24 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <div className="animate-fade-in">
        {children}
      </div>
    </Suspense>
  );
};

export default LazyLoadWrapper;
