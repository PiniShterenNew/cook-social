import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'simple' | 'full';
  showText?: boolean;
  'aria-label'?: string;
}

const Logo = ({ 
  size = 80, 
  className = '', 
  variant = 'default',
  showText = false,
  'aria-label': ariaLabel = 'לוגו Cooksy'
}: LogoProps) => {
  
  // Calculate text size relative to logo size
  const textSize = Math.floor(size / 3.5);
  
  return (
    <div className={`flex items-center ${className}`} aria-label={ariaLabel}>
      <div 
        className={`relative rounded-full bg-[#FF6B6B] flex items-center justify-center overflow-hidden ${variant === 'full' ? 'shadow-lg' : ''}`}
        style={{ width: size, height: size }}
      >
        {variant === 'simple' ? (
          // Simple variant - just the C letter
          <div className="text-white font-bold" style={{ fontSize: Math.max(textSize, 16) + 'px' }}>C</div>
        ) : (
          // Default or full variant - with smile icon and fork/knife
          <>
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B] to-[#FF5252]"></div>
            
            {/* Smile face */}
            <div className="absolute" style={{ width: size * 0.7, height: size * 0.7 }}>
              <div className="relative w-full h-full">
                {/* Eyes */}
                <div className="absolute bg-white rounded-full" 
                  style={{ 
                    width: size * 0.1, 
                    height: size * 0.1, 
                    top: size * 0.2, 
                    left: size * 0.25 
                  }}></div>
                <div className="absolute bg-white rounded-full" 
                  style={{ 
                    width: size * 0.1, 
                    height: size * 0.1, 
                    top: size * 0.2, 
                    right: size * 0.25 
                  }}></div>
                
                {/* Smile */}
                <div className="absolute bg-transparent border-white border-b-4 rounded-full" 
                  style={{ 
                    width: size * 0.4, 
                    height: size * 0.2, 
                    bottom: size * 0.15,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}></div>
                
                {/* Fork and knife */}
                {variant === 'full' && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="relative" style={{ width: size * 0.6, height: size * 0.3 }}>
                      <div className="absolute bg-white w-[2px] h-[60%] left-[30%] top-[20%] transform -rotate-12"></div>
                      <div className="absolute bg-white w-[2px] h-[60%] right-[30%] top-[20%] transform rotate-12"></div>
                      <div className="absolute bg-white w-[2px] h-[25%] right-[40%] top-[20%] transform rotate-45"></div>
                      <div className="absolute bg-white w-[2px] h-[25%] right-[40%] top-[20%] transform -rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* App name text - shown only when showText is true */}
      {showText && (
        <span 
          className="font-extrabold text-[#2A363B] ml-3 mr-0 rtl:mr-3 rtl:ml-0"
          style={{ fontSize: Math.max(textSize * 1.2, 18) + 'px' }}
        >
          Cooksy
        </span>
      )}
    </div>
  );
};

export default Logo;
