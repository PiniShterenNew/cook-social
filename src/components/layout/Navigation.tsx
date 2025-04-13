'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const Navigation = () => {
  const pathname = usePathname();
  const { t, isRTL } = useApp();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  // Skip navigation on authentication pages and error pages
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
    <nav className={`fixed bottom-0 md:bottom-auto md:top-16 left-0 right-0 bg-white border-t md:border-t-0 md:border-b border-gray-200 z-10 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="container mx-auto">
        <div className="flex justify-around items-center h-16">
          {/* Home */}
          <Link href="/feed" className={`flex flex-col md:flex-row md:gap-2 items-center justify-center ${isActive('/feed') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            <span className="text-xs md:text-sm mt-1 md:mt-0">{t('nav.home')}</span>
          </Link>
          
          {/* Search */}
          <Link href="/search" className={`flex flex-col md:flex-row md:gap-2 items-center justify-center ${isActive('/search') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
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
            <span className="text-xs md:text-sm mt-1 md:mt-0">{t('nav.search')}</span>
          </Link>
          
          {/* Add Recipe - mobile only */}
          <div className="relative md:hidden">
            <Link href="/recipes/new" className="flex flex-col items-center justify-center text-white absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-[#FF6B6B] p-3 rounded-full shadow-lg">
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
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
              </div>
              <span className="text-xs mt-1 text-gray-500">{t('nav.add')}</span>
            </Link>
          </div>
          
          {/* Add Recipe - desktop only */}
          <Link href="/recipes/new" className={`hidden md:flex md:flex-row md:gap-2 items-center justify-center ${isActive('/recipes/new') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
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
                d="M12 4v16m8-8H4" 
              />
            </svg>
            <span className="text-sm">{t('nav.add')}</span>
          </Link>
          
          {/* Saved */}
          <Link href="/saved" className={`flex flex-col md:flex-row md:gap-2 items-center justify-center ${isActive('/saved') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
              />
            </svg>
            <span className="text-xs md:text-sm mt-1 md:mt-0">{t('nav.saved')}</span>
          </Link>
          
          {/* Profile */}
          <Link href="/profile" className={`flex flex-col md:flex-row md:gap-2 items-center justify-center ${isActive('/profile') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            <span className="text-xs md:text-sm mt-1 md:mt-0">{t('nav.profile')}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
