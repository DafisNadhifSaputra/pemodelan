import React, { useEffect, useState } from 'react';

interface PerformanceMonitorProps {
  children: React.ReactNode;
  label?: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  children, 
  label = 'Component' 
}) => {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    
    // Monitor when component becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            const endTime = performance.now();
            setLoadTime(endTime - startTime);
            
            // Log performance metrics in development
            if (process.env.NODE_ENV === 'development') {
              console.log(`🚀 ${label} loaded in ${(endTime - startTime).toFixed(2)}ms`);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`performance-${label.toLowerCase()}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [label, isVisible]);

  return (
    <div 
      id={`performance-${label.toLowerCase()}`}
      className="relative"
    >
      {children}
      
      {/* Development performance indicator */}
      {process.env.NODE_ENV === 'development' && loadTime && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {loadTime.toFixed(0)}ms
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
