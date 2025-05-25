import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = true,
  icon 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-slate-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white dark:bg-slate-800 animate-slide-up">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
