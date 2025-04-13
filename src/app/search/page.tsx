'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';
import ThemeLanguageSettings from '@/components/settings/ThemeLanguageSettings';

// מוק של נתוני מתכונים - במציאות יגיעו מהשרת
const mockRecipes = [
  {
    id: '1',
    title: 'פסטה ברוטב עגבניות',
    image: '/placeholder.jpg',
    author: 'שף ישראלי',
    likes: 127,
    comments: 24,
    cookTime: '25 דק׳',
    difficulty: 'קל',
    tags: ['איטלקי', 'פסטה', 'צמחוני']
  },
  {
    id: '2',
    title: 'חומוס ביתי',
    image: '/placeholder.jpg',
    author: 'שף מקומי',
    likes: 243,
    comments: 43,
    cookTime: '45 דק׳',
    difficulty: 'בינוני',
    tags: ['ישראלי', 'טבעוני', 'מנה עיקרית']
  },
  {
    id: '3',
    title: 'סלט יווני',
    image: '/placeholder.jpg',
    author: 'שפית רותי',
    likes: 98,
    comments: 12,
    cookTime: '15 דק׳',
    difficulty: 'קל',
    tags: ['יווני', 'סלט', 'צמחוני']
  },
  {
    id: '4',
    title: 'עוגת שוקולד',
    image: '/placeholder.jpg',
    author: 'קונדיטור דני',
    likes: 352,
    comments: 56,
    cookTime: '60 דק׳',
    difficulty: 'מורכב',
    tags: ['אפייה', 'קינוחים', 'שוקולד']
  },
];

// קטגוריות חיפוש פופולריות
const popularCategories = [
  { id: 'fast', name: 'מהיר וקל', icon: '⚡' },
  { id: 'desserts', name: 'קינוחים', icon: '🍰' },
  { id: 'israeli', name: 'מטבח ישראלי', icon: '🥙' },
  { id: 'vegetarian', name: 'צמחוני', icon: '🥗' },
  { id: 'baking', name: 'אפייה', icon: '🍞' },
  { id: 'pasta', name: 'פסטה', icon: '🍝' },
];

export default function SearchPage() {
  const { t, isRTL, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockRecipes);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // חיפוש מתכונים לפי מילות מפתח וקטגוריות
  useEffect(() => {
    if (searchQuery.trim() === '' && !selectedCategory) {
      setSearchResults(mockRecipes);
      return;
    }

    setIsSearching(true);

    // סימולציה של חיפוש - במציאות יהיה API call
    const timer = setTimeout(() => {
      let results = [...mockRecipes];
      
      // סינון לפי מילות חיפוש
      if (searchQuery.trim() !== '') {
        results = results.filter(recipe => 
          recipe.title.includes(searchQuery) || 
          recipe.tags.some(tag => tag.includes(searchQuery))
        );
      }
      
      // סינון לפי קטגוריה
      if (selectedCategory) {
        const category = popularCategories.find(cat => cat.id === selectedCategory);
        if (category) {
          results = results.filter(recipe => 
            recipe.tags.some(tag => tag.toLowerCase().includes(category.name.toLowerCase()))
          );
        }
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // טיפול בבחירת קטגוריה
  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // טיפול בניקוי החיפוש
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen bg-white">
      {/* כותרת עליונה */}
      <div className="bg-[#FF6B6B] text-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{t('search.title')}</h1>
          <ThemeLanguageSettings className="text-white" />
        </div>
      </div>
      
      {/* תיבת חיפוש */}
      <div className="p-4 sticky top-16 z-10 bg-white shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full p-3 pr-10 pl-10 rounded-full border-2 border-[#E0E0E0] focus:border-[#FF6B6B] focus:outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* קטגוריות פופולריות */}
      <div className="p-4 bg-white">
        <h2 className="text-lg font-semibold mb-3">{t('search.popular')}</h2>
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {popularCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`
                flex items-center px-4 py-2 rounded-full whitespace-nowrap
                ${selectedCategory === category.id 
                  ? 'bg-[#FF6B6B] text-white' 
                  : 'bg-[#F8F8F8] text-[#757575] border border-[#E0E0E0]'}
              `}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* תוצאות חיפוש */}
      <div className="flex-1 p-4">
        {isSearching ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-2 border-[#FF6B6B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map(recipe => (
              <Link href={`/recipe/${recipe.id}`} key={recipe.id} className="block">
                <div className="border border-[#E0E0E0] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    <div className="flex items-center justify-center h-full text-gray-400">
                      {t('recipe.image')}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-lg">{recipe.title}</h3>
                    <p className="text-[#757575] text-sm mb-2">{recipe.author}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {recipe.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-[#F8F8F8] text-[#757575] px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-[#757575]">
                      <span>{recipe.cookTime}</span>
                      <span>{recipe.difficulty}</span>
                      <span>❤️ {recipe.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-[#757575] mb-2">{t('search.no.results')}</p>
            <button
              onClick={clearSearch}
              className="text-[#FF6B6B] font-semibold"
            >
              {t('search.clear')}
            </button>
          </div>
        )}
      </div>
      
      {/* תפריט תחתון - יכול להיות במרכיב נפרד */}
      <div className="sticky bottom-0 bg-white border-t border-[#E0E0E0] p-3">
        <div className="flex justify-around">
          <Link href="/feed" className="flex flex-col items-center text-[#757575]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span className="text-xs">{t('nav.home')}</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center text-[#FF6B6B]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span className="text-xs">{t('nav.search')}</span>
          </Link>
          <Link href="/add" className="flex flex-col items-center text-[#757575]">
            <div className="w-12 h-12 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white -mt-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
          </Link>
          <Link href="/saved" className="flex flex-col items-center text-[#757575]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
            <span className="text-xs">{t('nav.saved')}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-[#757575]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span className="text-xs">{t('nav.profile')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
