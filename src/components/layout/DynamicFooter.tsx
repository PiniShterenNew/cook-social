'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function DynamicFooter() {
  const pathname = usePathname();
  
  // רשימת נתיבים שבהם נרצה להציג גרסה מינימלית של הפוטר
  const minimalFooterPaths = [
    '/auth/verify',
    '/404',
  ];
  
  // רשימת נתיבים בהם לא נציג פוטר בכלל
  const noFooterPaths = [
    '/', // מסך פתיחה
    '/feed', // עמוד הפיד הראשי - לא צריך פוטר כי יש תפריט תחתון
    '/search',
    '/saved', 
    '/profile',
    '/recipes/new'
  ];
  
  // בדיקה אם הנתיב הנוכחי הוא אחד מהנתיבים שלא צריך להציג בהם פוטר
  const shouldHideFooter = noFooterPaths.includes(pathname) || pathname.startsWith('/feed');
  
  // בדיקה אם הנתיב הנוכחי הוא אחד מהנתיבים שצריך להציג בהם פוטר מינימלי
  const isMinimalFooter = minimalFooterPaths.includes(pathname);
  
  // בדיקה אם מדובר בעמוד אימות
  const isAuthPage = pathname.startsWith('/auth/') && !pathname.includes('/feed');
  
  // אם צריך להסתיר את הפוטר לחלוטין
  if (shouldHideFooter) {
    return null;
  }
  
  // מעבירים את המצב הנוכחי כפרופס לקומפוננט הפוטר
  return <Footer isMinimal={isMinimalFooter} isAuthPage={isAuthPage} />;
}