import React from 'react';
import { useLoading } from '../contexts/LoadingContext';

interface LoadingProgressBarProps {
  className?: string;
}

const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({ className = '' }) => {
  const { isLoading, loadingProgress } = useLoading();

  if (!isLoading || loadingProgress >= 100) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <div className="absolute top-1 left-4 text-xs text-gray-600 dark:text-gray-400">
        Loading... {Math.round(loadingProgress)}%
      </div>
    </div>
  );
};

export default LoadingProgressBar;
