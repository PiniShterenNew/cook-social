/**
 * Internationalization Service
 * 
 * שירות תרגום לתמיכה בעברית ואנגלית
 * Translation service for Hebrew and English support
 */

// Define the supported languages
export type SupportedLanguage = 'he' | 'en';

// Dictionary type for translations
export type TranslationDictionary = {
  [key: string]: string;
};

// Translations configuration
export type TranslationsConfig = {
  [key in SupportedLanguage]: TranslationDictionary;
};

// Import translations from separate files
import { translations } from '@/translations';

// Translation service class
export class I18nService {
  private static instance: I18nService;
  private currentLanguage: SupportedLanguage = 'he'; // Default language is Hebrew

  // Singleton pattern
  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  // Constructor
  constructor() {
    // Initialize language from localStorage if available
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('cooksy_language') as SupportedLanguage;
      if (savedLanguage && (savedLanguage === 'he' || savedLanguage === 'en')) {
        this.currentLanguage = savedLanguage;
      }
    }
  }

  // Get the current language
  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  // Set the current language
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cooksy_language', language);
    }
    
    // Set document direction
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }

  // Translate a key
  translate(key: string, placeholders?: Record<string, string | number>): string {
    // Get the translation from the current language
    const translation = translations[this.currentLanguage][key] || key;
    
    // Replace placeholders if provided
    if (placeholders) {
      return Object.entries(placeholders).reduce((result, [placeholder, value]) => {
        return result.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(value));
      }, translation);
    }
    
    return translation;
  }

  // Shorthand method for translate
  t(key: string, placeholders?: Record<string, string | number>): string {
    return this.translate(key, placeholders);
  }
}

// Export default instance
export const i18n = I18nService.getInstance();

// React hook for translations
export function useTranslation() {
  return {
    t: (key: string, placeholders?: Record<string, string | number>): string => {
      return i18n.translate(key, placeholders);
    },
    language: i18n.getLanguage(),
    setLanguage: (language: SupportedLanguage): void => {
      i18n.setLanguage(language);
    }
  };
}
