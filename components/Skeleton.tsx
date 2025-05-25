import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'text', 
  width = '100%', 
  height = '1rem',
  className = '' 
}) => {
  const baseClasses = "bg-slate-200 dark:bg-slate-700 animate-pulse";
  
  const variantClasses = {
    text: "rounded-md",
    rectangular: "rounded-lg",
    circular: "rounded-full"
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Preset skeletons untuk komponen umum
export const ChartSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    <div className="flex justify-between items-center">
      <Skeleton width="40%" height="24px" />
      <Skeleton variant="rectangular" width="80px" height="32px" />
    </div>
    <Skeleton variant="rectangular" width="100%" height="300px" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width="60%" height="16px" />
          <Skeleton width="80%" height="20px" />
        </div>
      ))}
    </div>
  </div>
);

export const ModalSkeleton: React.FC = () => (
  <div className="space-y-4 p-6">
    <div className="flex justify-between items-center">
      <Skeleton width="50%" height="28px" />
      <Skeleton variant="circular" width="32px" height="32px" />
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width={`${60 + Math.random() * 30}%`} height="16px" />
          <Skeleton width={`${40 + Math.random() * 40}%`} height="16px" />
        </div>
      ))}
    </div>
  </div>
);

export const ParameterSkeleton: React.FC = () => (
  <div className="space-y-6 p-4">
    <Skeleton width="40%" height="24px" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton width="60%" height="16px" />
        <div className="flex items-center space-x-3">
          <Skeleton width="100%" height="8px" className="flex-1" />
          <Skeleton variant="rectangular" width="80px" height="36px" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
