'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { i18n, SupportedLanguage } from '@/lib/i18n';

// Define types for theme
type Theme = 'light' | 'dark';

// Define the app context type
interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  isRTL: boolean;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, placeholders?: Record<string, string | number>) => string;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isRTL: true,
  language: 'he',
  setLanguage: () => {},
  t: (key) => key,
});

// Custom hook to use the app context
export const useApp = () => useContext(AppContext);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguageState] = useState<SupportedLanguage>(i18n.getLanguage());
  const isRTL = language === 'he';

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('cooksy_theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    }
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('cooksy_theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Set the language
  const setLanguage = (lang: SupportedLanguage) => {
    i18n.setLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('cooksy_language', lang);
  };

  // Translation function
  const t = (key: string, placeholders?: Record<string, string | number>) => {
    return i18n.translate(key, placeholders);
  };

  // Apply theme class on mount and theme change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply RTL direction on mount and language change
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  // Context value
  const value = {
    theme,
    toggleTheme,
    isRTL,
    language,
    setLanguage,
    t,
  };

  return (
    <AppContext.Provider value={value}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};
