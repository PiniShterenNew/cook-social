'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/context/AppContext';

const Header = () => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t, isRTL, theme, toggleTheme } = useApp();
  
  // Skip header on authentication pages and error pages
  if (
    pathname === '/' || 
    pathname === '/auth/welcome' || 
    pathname.startsWith('/auth/') ||
    pathname === '/404' ||
    pathname.includes('not-found')
  ) {
    return null;
  }
  
  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xl font-bold text-[#2A363B]`}>{t('app.name')}</span>
          </Link>
          
          {/* Desktop Navigation Links - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/feed" className={`${pathname === '/feed' ? 'text-[#FF6B6B]' : 'text-gray-600'} hover:text-[#FF6B6B] transition-colors`}>
              {t('nav.home')}
            </Link>
            <Link href="/search" className={`${pathname === '/search' ? 'text-[#FF6B6B]' : 'text-gray-600'} hover:text-[#FF6B6B] transition-colors`}>
              {t('nav.search')}
            </Link>
            <Link href="/recipes/new" className={`${pathname === '/recipes/new' ? 'text-[#FF6B6B]' : 'text-gray-600'} hover:text-[#FF6B6B] transition-colors`}>
              {t('nav.add')}
            </Link>
            <Link href="/saved" className={`${pathname === '/saved' ? 'text-[#FF6B6B]' : 'text-gray-600'} hover:text-[#FF6B6B] transition-colors`}>
              {t('nav.saved')}
            </Link>
          </div>
          
          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-gray-500 hover:text-[#FF6B6B] transition-colors"
              aria-label={theme === 'light' ? t('settings.theme.dark') : t('settings.theme.light')}
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            {isSearchOpen ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('nav.search') + '...'}
                  className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 rounded-full border border-gray-300 focus:outline-none focus:border-[#FF6B6B] w-64`}
                />
                <button 
                  className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2`}
                  onClick={() => setIsSearchOpen(false)}
                  aria-label={t('nav.close')}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                className="text-gray-500 hover:text-[#FF6B6B] transition-colors"
                onClick={() => setIsSearchOpen(true)}
                aria-label={t('nav.search')}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
            )}
            
            {/* Notifications */}
            <button 
              className="text-gray-500 hover:text-[#FF6B6B] relative transition-colors"
              aria-label={t('settings.notifications')}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* User Profile - Desktop only */}
            <Link href="/profile" className="hidden md:flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {/* If user has profile image */}
                <span className="text-gray-600 font-bold text-sm">U</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
