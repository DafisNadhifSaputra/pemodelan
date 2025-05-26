import React, { useState, useEffect } from 'react';

interface LazyComponentLoaderProps<T = any> {
  loader: () => Promise<{ default: React.ComponentType<T> }>;
  props: T;
  fallback?: React.ReactNode;
  delay?: number;
  retryCount?: number;
}

function LazyComponentLoader<T = any>({
  loader,
  props,
  fallback,
  delay = 0,
  retryCount = 3
}: LazyComponentLoaderProps<T>) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  const loadComponent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Optional delay for testing
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const module = await loader();
      setComponent(() => module.default);    } catch (err) {
      console.error('Failed to load component:', err instanceof Error ? err.message : String(err));
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Retry logic
      if (retryAttempts < retryCount) {
        setTimeout(() => {
          setRetryAttempts(prev => prev + 1);
          loadComponent();
        }, 1000 * (retryAttempts + 1)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComponent();
  }, []);

  if (error && retryAttempts >= retryCount) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          Gagal memuat komponen
        </p>
        <button
          onClick={() => {
            setRetryAttempts(0);
            loadComponent();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (isLoading || !Component) {
    return (
      <div className="animate-fade-in">
        {fallback || (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="animate-fade-in">
      <Component {...(props as any)} />
    </div>
  );
}

export default LazyComponentLoader;
