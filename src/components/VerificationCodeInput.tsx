import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

interface VerificationCodeInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  error?: boolean;
}

const VerificationCodeInput = ({
  length = 4,
  onComplete,
  error = false,
}: VerificationCodeInputProps) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { isRTL } = useApp();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (code.every((digit) => digit !== '') && onComplete) {
      onComplete(code.join(''));
    }
  }, [code, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Update the code array
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto focus next input if this one is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to previous input on backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Move focus between inputs with arrow keys - with RTL support
    if (isRTL) {
      // In RTL, arrow keys are reversed
      if (e.key === 'ArrowLeft' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else {
      // Standard LTR behavior
      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split('');
    const newCode = [...code];
    
    digits.forEach((digit, idx) => {
      if (idx < length) {
        newCode[idx] = digit;
      }
    });
    
    setCode(newCode);
    
    // Focus last filled input or next empty one
    const lastIndex = Math.min(digits.length, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  const getInputsOrder = () => {
    // Create an array of indices and reverse it for RTL
    const indices = Array.from({ length }, (_, i) => i);
    return isRTL ? indices.reverse() : indices;
  };

  return (
    <div className="flex justify-center gap-3">
      {getInputsOrder().map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          className={`
            w-[50px] h-[60px] md:w-[60px] md:h-[70px] text-center text-[24px] md:text-[28px] font-bold rounded-[12px]
            ${code[index] ? 'bg-[#F8F8F8] border-2 border-[#FF6B6B]' : 'bg-white border-2 border-[#E0E0E0]'}
            ${error ? 'border-[#FF4757] animate-shake' : ''}
            focus:border-[#FF6B6B] focus:outline-none transition-colors
            hover:border-[#FF9999]
          `}
          value={code[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`Verification code digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default VerificationCodeInput;
