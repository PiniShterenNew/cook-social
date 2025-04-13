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