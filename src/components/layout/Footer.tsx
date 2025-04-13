'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Instagram, Facebook, Twitter } from 'lucide-react';

interface FooterProps {
  isMinimal?: boolean;
  isAuthPage?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isMinimal = false, isAuthPage = false }) => {
  const { t, isRTL } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check user authentication status on client side
  useEffect(() => {
    // Here we would check if the user is authenticated
    // For now, we'll use a simple check for a user token in localStorage
    const userToken = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    setIsLoggedIn(!!userToken);
  }, []);
  
  // For error pages or minimal display
  if (isMinimal) {
    return (
      <footer className="bg-white pt-2 pb-2 text-center">
        <p className="text-gray-500 text-sm">
          {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
        </p>
      </footer>
    );
  }
  
  // For logged in users, show a simpler version without redundant links
  if (isLoggedIn && !isAuthPage) {
    return (
      <footer className="bg-white pt-4 pb-4 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            {/* Copyright */}
            <div className="w-full text-center md:text-start mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
              </p>
            </div>
            
            {/* Links for logged in users */}
            <div className="w-full md:w-auto">
              <ul className="flex flex-wrap justify-center md:justify-end space-x-4 rtl:space-x-reverse">
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-[#FF6B6B]">
                    {t('footer.help')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-[#FF6B6B]">
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-[#FF6B6B]">
                    {t('footer.privacy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  // For login and welcome pages, show simplified footer
  if (isAuthPage) {
    return (
      <footer className="bg-white pt-4 pb-4 z-10">
        <div className="container mx-auto px-4">
          {/* Social Media */}
          <div className="flex justify-center space-x-6 rtl:space-x-reverse mb-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF6B6B]">
              <Instagram size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF6B6B]">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF6B6B]">
              <Twitter size={24} />
            </a>
          </div>
          
          {/* Terms & Privacy */}
          <div className="text-center mb-4">
            <ul className="flex justify-center space-x-4 rtl:space-x-reverse">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
  // Default full footer for logged out users and general pages
  return (
    <footer className="bg-white pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* About Section */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-[#2A363B] font-semibold mb-4">
              {t('footer.about')}
            </h3>
            <ul>
              <li className="mb-2">
                <Link href="/about" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.about.us')}
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/blog" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.blog')}
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/help" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.help')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Help & Support */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-[#2A363B] font-semibold mb-4">
              {t('footer.support')}
            </h3>
            <ul>
              <li className="mb-2">
                <Link href="/faq" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.faq')}
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.contact')}
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/terms" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#FF6B6B]">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h3 className="text-[#2A363B] font-semibold mb-4">Social</h3>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF6B6B]">
                <Instagram size={24} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF6B6B]">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF6B6B]">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;