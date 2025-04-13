import React, { useState, forwardRef } from 'react';
import { useApp } from '@/context/AppContext';

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ error, className = '', ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const { isRTL } = useApp();

    return (
      <div className={`w-full ${className}`}>
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div
            className={`h-[55px] w-[80px] bg-[#F8F8F8] border-2 border-[#E0E0E0] ${'rounded-l-[12px] border-l-2'
              } flex items-center justify-center text-center ${focused ? 'border-[#FF6B6B]' : ''
              } ${error ? 'border-[#FF4757]' : ''}`}
          >
            <span className="font-normal text-base">+972</span>
          </div>
          <input
            ref={ref}
            dir="ltr"
            className={`h-[55px] px-4 border-2 border-[#E0E0E0] ${'rounded-r-[12px] border-r-2'
              } bg-white flex-1 focus:border-[#FF6B6B] outline-none font-normal text-base ${focused ? 'border-[#FF6B6B]' : ''
              } ${error ? 'border-[#FF4757]' : ''}`}
            type="tel"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="050-123-4567"
            inputMode="numeric"
            {...props}
          />
        </div>
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
