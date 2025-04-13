import { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  outline?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({
  children,
  onClick,
  disabled = false,
  primary = true,
  outline = false,
  className = '',
  type = 'button',
  size = 'md',
}: ButtonProps) => {
  const { isRTL } = useApp();
  
  // Base style includes responsive height based on size
  const sizeClasses = {
    sm: 'h-[40px] text-sm md:h-[45px]',
    md: 'h-[55px] text-lg md:h-[60px]',
    lg: 'h-[60px] text-xl md:h-[65px]',
  };
  
  const baseStyle = `w-full ${sizeClasses[size]} font-bold rounded-[30px] transition-all duration-200 focus:outline-none active:scale-[0.98]`;
  
  // Use direct color values as per the fixed Tailwind configuration
  const primaryStyle = primary && !outline 
    ? 'bg-[#FF6B6B] text-white hover:bg-[#E55A5A]' 
    : '';
  
  const outlineStyle = outline 
    ? 'bg-white border-2 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FFEBEB]' 
    : '';
  
  const disabledStyle = disabled 
    ? 'bg-[#E0E0E0] text-[#A0A0A0] cursor-not-allowed opacity-70' 
    : '';
  
  // Add RTL-specific padding for button content if needed
  const rtlStyle = isRTL ? 'rtl:space-x-reverse' : '';

  return (
    <button
      type={type}
      className={`${baseStyle} ${primaryStyle} ${outlineStyle} ${disabledStyle} ${rtlStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
