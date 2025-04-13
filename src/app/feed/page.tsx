'use client';

import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Button from '@/components/Button';

export default function FeedPage() {
  const router = useRouter();
  
  const handleLogout = () => {
    // In a real implementation, this would clear the authentication token
    router.push('/auth/welcome');
  };
  
  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="h-[60px] bg-[#FF6B6B] flex items-center justify-between px-4">
        <div className="text-white font-bold text-lg">Cooksy</div>
        <div className="flex items-center gap-2">
          <button className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="white"/>
            </svg>
          </button>
          <button className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <Logo size={80} />
        <h1 className="mt-6 text-2xl font-bold text-[#2A363B]">ברוכים הבאים ל-Cooksy!</h1>
        <p className="mt-2 text-[#757575] text-center">
          השלמת בהצלחה את תהליך ההרשמה והאימות.
          <br/>
          כאן יופיע הפיד החברתי עם מתכונים והמלצות.
        </p>
        
        <div className="mt-8 w-full max-w-sm">
          <Button onClick={handleLogout} outline>
            התנתקות
          </Button>
        </div>
      </div>
    </div>
  );
}
