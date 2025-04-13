'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function DynamicNavigation() {
  const pathname = usePathname();
  
  // רשימת נתיבים בהם לא נציג את התפריט התחתון
  const excludedPaths = [
    '/', // רק עמוד הפתיחה (splash)
    '/auth/welcome',
    '/auth/login',
    '/auth/verify',
    '/auth/profile-setup',
    '/auth/interests',
    '/404',
  ];
  
  // בדיקה אם הנתיב הנוכחי הוא אחד מהנתיבים שלא צריך להציג בהם תפריט תחתון
  // שים לב: `/feed` לא כלול ברשימה הזו, לכן הוא צריך להציג את התפריט
  const shouldHideNavigation = excludedPaths.includes(pathname) || 
                              (pathname.startsWith('/auth/') && !pathname.includes('/feed'));
  
  // אם צריך להסתיר את התפריט התחתון, לא מחזירים כלום
  if (shouldHideNavigation) {
    return null;
  }
  
  // אחרת, מציגים את התפריט התחתון הרגיל
  return <Navigation />;
}