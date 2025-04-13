'use client';

import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { useApp } from '@/context/AppContext';

export default function FeedPage() {
  const router = useRouter();
  const { t } = useApp();
  
  const handleLogout = () => {
    // In a real implementation, this would clear the authentication token
    router.push('/auth/welcome');
  };
  
  return (
    <div dir="rtl" className="flex flex-col min-h-full w-full bg-white">
      {/* Header */}
      <div className="h-[60px] flex items-center justify-between px-4">
        <div className="font-bold text-lg">{t('app.name')}</div>
        <div className="flex items-center gap-2">
          <button className="text-black">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="black"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <Logo size={80} />
        <h1 className="mt-6 text-2xl font-bold text-[#2A363B]">ברוכים הבאים ל-{t('app.name')}!</h1>
        <p className="mt-2 text-[#757575] text-center">
          השלמת בהצלחה את תהליך ההרשמה והאימות.
          <br/>
          כאן יופיע הפיד החברתי עם מתכונים והמלצות.
        </p>
        
        {/* <div className="mt-8 w-full max-w-sm">
          <Button onClick={handleLogout} outline>
            התנתקות
          </Button>
        </div> */}
      </div>
    </div>
  );
}
