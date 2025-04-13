'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function DynamicHeader() {
  const pathname = usePathname();
  
  // רשימת נתיבים בהם לא נציג את ההדר
  const excludedPaths = [
    '/', // רק עמוד הפתיחה (splash)
    '/auth/welcome',
    '/auth/login',
    '/auth/verify',
    '/auth/profile-setup',
    '/auth/interests',
    '/404',
  ];
  
  // בדיקה אם הנתיב הנוכחי הוא אחד מהנתיבים שלא צריך להציג בהם הדר
  // שים לב: `/feed` לא כלול ברשימה הזו, לכן הוא צריך להציג את ההדר
  const shouldHideHeader = excludedPaths.includes(pathname) || 
                           (pathname.startsWith('/auth/') && !pathname.includes('/feed'));
  
  // אם צריך להסתיר את ההדר, לא מחזירים כלום
  if (shouldHideHeader) {
    return null;
  }
  
  // אחרת, מציגים את ההדר הרגיל
  return <Header />;
}