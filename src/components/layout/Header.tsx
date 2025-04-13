'use client';

import React from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useApp } from '@/context/AppContext';
import { Moon, Sun, Bell } from 'lucide-react';

const Header = () => {
  const { t, isRTL, theme, toggleTheme } = useApp();
  
  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-20 ${isRTL ? 'text-right' : 'text-left'} w-full`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - מיושר לימין בעברית ולשמאל באנגלית */}
          <div className={`${isRTL ? 'order-1' : 'order-0'}`}>
            <Link href="/feed" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xl font-bold text-[#2A363B]`}>{t('app.name')}</span>
            </Link>
          </div>
          
          {/* Search and Actions - מיושר לשמאל בעברית ולימין באנגלית */}
          <div className={`flex items-center gap-4 ${isRTL ? 'order-0' : 'order-1'}`}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-gray-500 hover:text-[#FF6B6B] transition-colors"
              aria-label={theme === 'light' ? t('settings.theme.dark') : t('settings.theme.light')}
            >
              {theme === 'light' ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </button>
            
            {/* Notifications */}
            <button 
              className="text-gray-500 hover:text-[#FF6B6B] relative transition-colors"
              aria-label={t('settings.notifications')}
            >
              <Bell className="h-6 w-6" />
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