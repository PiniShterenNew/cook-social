'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage, t } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F8F8F8] border border-[#E0E0E0] hover:bg-[#F0F0F0] transition-colors"
        aria-label={t('settings.language')}
      >
        <span className={`text-sm font-medium ${language === 'he' ? 'font-bold text-[#FF6B6B]' : 'text-[#757575]'}`}>
          עב
        </span>
        <span className="mx-1 text-[#CCCCCC]">|</span>
        <span className={`text-sm font-medium ${language === 'en' ? 'font-bold text-[#FF6B6B]' : 'text-[#757575]'}`}>
          EN
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
