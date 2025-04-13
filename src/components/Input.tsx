import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  dir?: 'rtl' | 'ltr';
  suffixElement?: ReactNode;
  prefixElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', dir = 'rtl', suffixElement, prefixElement, ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label className="block text-[14px] font-medium text-[#757575] mb-2 text-right" dir={dir}>
            {label}
          </label>
        )}
        <div className="relative">
          {prefixElement && (
            <div className={`absolute top-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} h-full flex items-center px-4`}>
              {prefixElement}
            </div>
          )}
          <input
            ref={ref}
            dir={dir}
            className={`h-[55px] px-4 rounded-[12px] border-2 border-[#E0E0E0] bg-white w-full focus:border-[#FF6B6B] outline-none font-normal text-base ${
              error ? 'border-[#FF4757]' : ''
            } ${prefixElement ? (dir === 'rtl' ? 'pr-12' : 'pl-12') : ''} ${suffixElement ? (dir === 'rtl' ? 'pl-12' : 'pr-12') : ''}`}
            {...props}
          />
          {suffixElement && (
            <div className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} h-full flex items-center px-4`}>
              {suffixElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-[12px] text-[#FF4757] text-right" dir={dir}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
