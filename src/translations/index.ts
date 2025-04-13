import { TranslationsConfig } from '@/lib/i18n';
import { heTranslations } from './he';
import { enTranslations } from './en';

/**
 * Export all translations
 */
export const translations: TranslationsConfig = {
  he: heTranslations,
  en: enTranslations,
};
