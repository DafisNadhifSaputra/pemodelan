import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

// Error boundary component for lazy loading
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyLoadWrapper Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full text-red-500 dark:text-red-400">
          Error loading component
        </div>
      );
    }

    return this.props.children;
  }
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
    <LazyErrorBoundary fallback={fallback || defaultFallback}>
      <Suspense fallback={fallback || defaultFallback}>
        <div className="animate-fade-in">
          {children}
        </div>
      </Suspense>
    </LazyErrorBoundary>
  );
};

export default LazyLoadWrapper;
