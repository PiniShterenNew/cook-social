import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className = '' }: BackButtonProps) => {
  const router = useRouter();
  const { isRTL } = useApp();

  return (
    <button
      onClick={() => router.back()}
      className={`h-[40px] w-[40px] rounded-full bg-[#F8F8F8] flex items-center justify-center ${className}`}
      aria-label="חזור אחורה"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="#2A363B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isRTL ? "transform rotate-180" : ""}
        />
      </svg>
    </button>
  );
};

export default BackButton;
