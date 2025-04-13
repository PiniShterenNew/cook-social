'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import ThemeLanguageSettings from '@/components/settings/ThemeLanguageSettings';
import Logo from '@/components/Logo';

export default function NotFound() {
  const { t, isRTL } = useApp();
  
  // מחרוזות תרגום לדף השגיאה בעברית (במקום קודי מערכת גלויים)
  const errorTexts = {
    title: 'העמוד לא נמצא',
    message: 'אופס! נראה שהגעת לעמוד שלא קיים. המתכון שחיפשת ככל הנראה אינו קיים או שהוסר.',
    goHome: 'חזרה לדף הבית',
    searchRecipes: 'חפש מתכונים',
    tryAgain: 'אולי תנסה לחפש משהו אחר?'
  };
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen bg-white">
      {/* תוכן העמוד */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
        {/* איור של סיר ריק או כלי מטבח */}
        <div className="relative w-48 h-48 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* איור של סיר עם סימן שאלה */}
            <div className="w-40 h-40 rounded-b-[80px] border-8 border-[#2A363B] relative">
              {/* ידיות הסיר */}
              <div className="absolute -right-6 top-10 w-5 h-16 rounded-full border-8 border-[#2A363B]"></div>
              <div className="absolute -left-6 top-10 w-5 h-16 rounded-full border-8 border-[#2A363B]"></div>
              
              {/* סימן שאלה בתוך הסיר */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[#FF6B6B] text-6xl font-black">?</div>
              </div>
            </div>
            
            {/* אדים מעל הסיר */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-2 rtl:space-x-reverse opacity-70">
              <div className="w-4 h-10 bg-[#F0F0F0] rounded-full animate-float"></div>
              <div className="w-3 h-8 bg-[#F0F0F0] rounded-full animate-float" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-5 h-12 bg-[#F0F0F0] rounded-full animate-float" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>
        
        <h1 className="text-9xl font-bold text-[#FF6B6B] animate-pulse">404</h1>
        <h2 className="text-3xl font-semibold text-[#2A363B] mt-4 mb-2">
          {t('error.page_not_found') || errorTexts.title}
        </h2>
        <p className="text-[#757575] mb-6 max-w-md text-lg">
          {t('error.page_not_found_message') || errorTexts.message}
        </p>
        
        <p className="text-[#2A363B] italic mb-8">
          {t('error.try_again') || errorTexts.tryAgain}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/feed" 
            className="px-8 py-3 bg-[#FF6B6B] text-white rounded-full font-medium hover:bg-[#FF5252] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            {t('error.go_home') || errorTexts.goHome}
          </Link>
          <Link 
            href="/search" 
            className="px-8 py-3 bg-white border-2 border-[#FF6B6B] text-[#FF6B6B] rounded-full font-medium hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {t('error.search_recipes') || errorTexts.searchRecipes}
          </Link>
        </div>
      </div>
      
      {/* Footer - יוצג כעת בגרסה המינימלית בזכות הלוגיקה החדשה */}
    </div>
  );
}
