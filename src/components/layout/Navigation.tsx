'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Home, Search, PlusSquare, Bookmark, User } from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();
  const { t, isRTL } = useApp();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className={`fixed bottom-0 md:bottom-auto md:top-16 left-0 right-0 bg-white border-t md:border-t-0 md:border-b border-gray-200 z-10 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="container mx-auto">
        <div className="flex justify-around items-center h-16">
          {/* Home */}
          <Link href="/feed" className={`flex flex-col md:flex-row md:gap-2 items-center justify-center ${isActive('/feed') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
            <Home className="h-6 w-6" />
            <span className="text-xs md:text-sm mt-1 md:mt-0">{t('nav.home')}</span>
          </Link>
          
          {/* Search */}
          <Link href="/search" className={`flex flex-col md:flex-row md:gap-2 items-center justify-center ${isActive('/search') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
            <Search className="h-6 w-6" />
            <span className="text-xs md:text-sm mt-1 md:mt-0">{t('nav.search')}</span>
          </Link>
          
          {/* Add Recipe - mobile only */}
          <div className="relative md:hidden">
            <Link href="/recipes/new" className="flex flex-col items-center justify-center text-white absolute -top-11 left-1/2 transform -translate-x-1/2">
              <div className="bg-[#FF6B6B] p-3 rounded-full shadow-lg">
                <PlusSquare className="h-6 w-6" />
              </div>
              <span className="text-xs mt-1 text-gray-500">{t('nav.add')}</span>
            </Link>
          </div>
          
          {/* Add Recipe - desktop only */}
          <Link href="/recipes/new" className={`hidden md:flex md:flex-row md:gap-2 items-center justify-center ${isActive('/recipes/new') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
            <PlusSquare className="h-6 w-6" />
            <span className="text-sm">{t('nav.add')}</span>
          </Link>
          
          {/* Saved */}
          <Link href="/saved" className={`flex flex-col md:flex-row md:gap-2 items-center justify-center ${isActive('/saved') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
            <Bookmark className="h-6 w-6" />
            <span className="text-xs md:text-sm mt-1 md:mt-0">{t('nav.saved')}</span>
          </Link>
          
          {/* Profile */}
          <Link href="/profile" className={`flex flex-col md:flex-row md:gap-2 items-center justify-center ${isActive('/profile') ? 'text-[#FF6B6B]' : 'text-gray-500'} hover:text-[#FF6B6B] transition-colors`}>
            <User className="h-6 w-6" />
            <span className="text-xs md:text-sm mt-1 md:mt-0">{t('nav.profile')}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;