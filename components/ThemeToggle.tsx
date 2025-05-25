import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}
      `}
      aria-label="Toggle dark mode"
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
          ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
      <span className={`
        absolute left-1 top-1 text-xs transition-opacity duration-200
        ${isDarkMode ? 'opacity-0' : 'opacity-100'}
      `}>
        ☀️
      </span>
      <span className={`
        absolute right-1 top-1 text-xs transition-opacity duration-200
        ${isDarkMode ? 'opacity-100' : 'opacity-0'}
      `}>
        🌙
      </span>
    </button>
  );
};

export default ThemeToggle;
