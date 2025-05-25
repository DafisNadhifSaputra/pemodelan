import React, { createContext, useContext, useState } from 'react';

interface LoadingState {
  isLoading: boolean;
  loadedComponents: Set<string>;
  failedComponents: Set<string>;
  loadingProgress: number;
}

interface LoadingContextType extends LoadingState {
  startLoading: () => void;
  finishLoading: () => void;
  markFailed: () => void;
  reset: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
  totalComponents?: number;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ 
  children, 
  totalComponents = 10 
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadedComponents: new Set(),
    failedComponents: new Set(),
    loadingProgress: 0
  });
  const startLoading = () => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: true
    }));
  };

  const finishLoading = () => {
    setLoadingState(prev => {
      const newLoaded = new Set(prev.loadedComponents);
      
      const progress = (newLoaded.size / totalComponents) * 100;
      const isComplete = newLoaded.size >= totalComponents;
      
      return {
        ...prev,
        loadedComponents: newLoaded,
        isLoading: !isComplete,
        loadingProgress: Math.min(progress, 100)
      };
    });
  };
  const markFailed = () => {
    setLoadingState(prev => {
      const newFailed = new Set(prev.failedComponents);
      
      return {
        ...prev,
        failedComponents: newFailed
      };
    });
  };

  const reset = () => {
    setLoadingState({
      isLoading: false,
      loadedComponents: new Set(),
      failedComponents: new Set(),
      loadingProgress: 0
    });
  };

  return (
    <LoadingContext.Provider value={{
      ...loadingState,
      startLoading,
      finishLoading,
      markFailed,
      reset
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Loading Progress Bar Component
export const LoadingProgressBar: React.FC = () => {
  const { isLoading, loadingProgress } = useLoading();

  if (!isLoading && loadingProgress >= 100) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-slate-200 dark:bg-slate-700">
        <div 
          className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      {isLoading && (
        <div className="absolute top-1 right-4 text-xs text-slate-600 dark:text-slate-400">
          {Math.round(loadingProgress)}%
        </div>
      )}
    </div>
  );
};
