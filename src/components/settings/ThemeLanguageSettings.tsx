'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

type ThemeLanguageSettingsProps = {
  variant?: 'full' | 'minimal';  // full = with labels, minimal = icons only
  className?: string;
};

const ThemeLanguageSettings: React.FC<ThemeLanguageSettingsProps> = ({ 
  variant = 'minimal',
  className = ''
}) => {
  const { theme, toggleTheme, language, setLanguage, isRTL } = useApp();
  
  // Determine if we should show labels or just icons
  const isFullVariant = variant === 'full';
  
  return (
    <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 ${className}`}>
      {/* Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        className="flex items-center text-gray-600 hover:text-[#FF6B6B] transition-colors"
      >
        {theme === 'light' ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
            {isFullVariant && <span className="ml-2">מצב כהה</span>}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
            </svg>
            {isFullVariant && <span className="ml-2">מצב בהיר</span>}
          </>
        )}
      </button>
      
      {/* Language Toggle */}
      <button
        type="button"
        onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
        aria-label={language === 'he' ? 'Switch to English' : 'עבור לעברית'}
        className="flex items-center text-gray-600 hover:text-[#FF6B6B] transition-colors"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {language === 'he' ? 'EN' : 'עב'}
        </div>
        {isFullVariant && (
          <span className="ml-2">
            {language === 'he' ? 'English' : 'עברית'}
          </span>
        )}
      </button>
    </div>
  );
};

export default ThemeLanguageSettings;
