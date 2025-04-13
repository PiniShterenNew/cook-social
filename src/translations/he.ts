import { TranslationDictionary } from '@/lib/i18n';

/**
 * Hebrew translations
 * תרגומים לעברית
 */
export const heTranslations: TranslationDictionary = {
  // General
  'app.name': 'Cooksy',
  'app.slogan': 'הבית שלך לבישול – עם השראה, קהילה וכלים',
  'app.loading': 'טוען...',
  'app.network.error': 'בעיית חיבור לרשת',
  'app.network.retry': 'נסה שוב',
  
  // Navigation
  'nav.home': 'בית',
  'nav.search': 'חיפוש',
  'nav.add': 'הוסף',
  'nav.saved': 'שמורים',
  'nav.profile': 'פרופיל',
  'nav.close': 'סגור',
  
  // Authentication
  'auth.welcome': 'ברוכים הבאים ל-Cooksy',
  'auth.welcome.subtitle': 'הצטרפו לקהילת הבישול הגדולה בישראל וגלו מתכונים מדהימים',
  'auth.login': 'התחברות',
  'auth.register': 'הרשמה',
  'auth.phone': 'מספר טלפון',
  'auth.email': 'אימייל',
  'auth.email.label': 'כתובת אימייל',
  'auth.email.placeholder': 'your@email.com',
  'auth.email.info': 'האימייל שלך ישמש להתחברות',
  'auth.password': 'סיסמה',
  'auth.password.label': 'סיסמה',
  'auth.password.placeholder': '••••••••',
  'auth.forgot.password': 'שכחת סיסמה?',
  'auth.continue': 'המשך',
  'auth.or': 'או הירשם באמצעות',
  'auth.terms': 'בהמשך אתם מאשרים את תנאי השימוש ומדיניות הפרטיות שלנו',
  'auth.have.account': 'כבר יש לך חשבון?',
  'auth.no.account': 'אין לך חשבון?',
  'auth.verify.title': 'אימות מספר טלפון',
  'auth.verify.sent': 'שלחנו קוד אימות למספר',
  'auth.verify.detecting': 'מזהה קוד SMS אוטומטית...',
  'auth.verify.sent.email': 'שלחנו קוד אימות לאימייל:',
  'auth.verify.resend': 'לא קיבלת את הקוד? ניתן לשלוח שוב בעוד',
  'auth.verify.new': 'שלח קוד חדש',
  'auth.verify.button': 'אימות',
  'auth.verify.support': 'נתקלת בבעיה? צור קשר עם התמיכה',
  
  // Profile Setup
  'profile.title': 'יצירת פרופיל',
  'profile.create': 'יצירת פרופיל',
  'profile.completed': 'הושלם',
  'profile.subtitle': 'ספר לנו קצת על עצמך כדי שנוכל להציע לך את החוויה הטובה ביותר',
  'profile.add.image': 'הוסף תמונת פרופיל',
  'profile.edit.image': 'ערוך תמונת פרופיל',
  'profile.name': 'שם מלא',
  'profile.username': 'שם משתמש',
  'profile.username.suggestions': 'שמות משתמש מוצעים:',
  'profile.bio': 'קצת עלי (אופציונלי)',
  'profile.optional': 'אופציונלי',
  'profile.bio.placeholder': 'ספר לנו קצת על עצמך...',
  'profile.bio.hint': 'הביוגרפיה שלך תופיע בפרופיל הציבורי שלך',
  'profile.interests': 'תחומי עניין',
  'profile.can_edit_later': 'ניתן לערוך בהמשך',
  'profile.add_more': 'הוסף עוד',
  'profile.skip': 'דלג',
  'profile.zoom': 'זום',
  'profile.cancel': 'ביטול',
  'profile.save': 'שמור',
  
  // Interests
  'interests.title': 'תחומי עניין בבישול',
  'interests.subtitle': 'בחר את תחומי העניין שלך כדי שנוכל להתאים לך את התוכן המתאים ביותר',
  'interests.selected': 'נבחרו {{count}} נושאים',
  
  // Categories
  'category.cuisine': 'מטבחים',
  'category.dietary': 'סגנונות תזונה',
  'category.meal': 'סוגי ארוחות',
  'category.method': 'שיטות בישול',
  
  // Recipe details
  'recipe.ingredients': 'מצרכים',
  'recipe.steps': 'אופן ההכנה',
  'recipe.prep': 'זמן הכנה',
  'recipe.cook': 'זמן בישול',
  'recipe.servings': 'מנות',
  'recipe.difficulty': 'רמת קושי',
  'recipe.difficulty.easy': 'קלה',
  'recipe.difficulty.medium': 'בינונית',
  'recipe.difficulty.hard': 'מורכבת',
  'recipe.save': 'שמור מתכון',
  'recipe.saved': 'מתכון שמור',
  'recipe.like': 'אהבתי',
  'recipe.comment': 'תגובה',
  'recipe.image': 'תמונת מתכון',
  
  // Feed
  'feed.popular': 'פופולרי',
  'feed.recent': 'חדש',
  'feed.recommended': 'מומלץ עבורך',
  
  // Search
  'search.title': 'חיפוש',
  'search.placeholder': 'חפש מתכונים, משתמשים או תגיות...',
  'search.popular': 'קטגוריות פופולריות',
  'search.no.results': 'לא נמצאו תוצאות מתאימות לחיפוש שלך',
  'search.clear': 'נקה חיפוש',
  
  // Error Page
  'error.page_not_found': 'העמוד לא נמצא',
  'error.page_not_found_message': 'אופס! נראה שהגעת לעמוד שלא קיים. המתכון שחיפשת ככל הנראה אינו קיים או שהוסר.',
  'error.try_again': 'אולי תנסה לחפש משהו אחר?',
  'error.go_home': 'חזרה לדף הבית',
  'error.search_recipes': 'חפש מתכונים',
  
  // Settings
  'settings.title': 'הגדרות',
  'settings.language': 'שפה',
  'settings.language.he': 'עברית',
  'settings.language.en': 'אנגלית',
  'settings.theme': 'מצב תצוגה',
  'settings.theme.light': 'בהיר',
  'settings.theme.dark': 'כהה',
  'settings.notifications': 'התראות',
  'settings.logout': 'התנתקות',
  
  // Footer
  'footer.links': 'קישורים מהירים',
  'footer.about': 'אודות',
  'footer.about.us': 'אודותינו',
  'footer.blog': 'בלוג',
  'footer.faq': 'שאלות נפוצות',
  'footer.recipes': 'מתכונים',
  'footer.community': 'קהילה',
  'footer.help': 'עזרה ותמיכה',
  'footer.support': 'תמיכה',
  'footer.contact': 'צור קשר',
  'footer.terms': 'תנאי שימוש',
  'footer.privacy': 'מדיניות פרטיות',
  'footer.rights': 'כל הזכויות שמורות.',
};
