'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import VerificationCodeInput from '@/components/VerificationCodeInput';
import { useApp } from '@/context/AppContext';
import ThemeLanguageSettings from '@/components/settings/ThemeLanguageSettings';

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const email = searchParams.get('email') || '';
  const mode = searchParams.get('mode') || 'login';
  const isRegister = mode === 'register';
  const isEmailVerification = !!email;
  const { t, isRTL } = useApp();

  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [codeSent, setCodeSent] = useState(true); // Track if code was sent
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [autoDetectingCode, setAutoDetectingCode] = useState(false);
  const [smsPermissionRequested, setSmsPermissionRequested] = useState(false);
  
  // References for SMS detection
  const smsDetectionTimeout = useRef<NodeJS.Timeout | null>(null);

  // Format contact info for display
  const formatPhoneForDisplay = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    
    // Assume the phone number is in the format 05XXXXXXXX
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format as 05X-XXX-XXXX
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // If 9 digits (missing the leading zero)
    if (cleaned.length === 9) {
      return `0${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
    }
    
    return phoneNumber;
  };
  
  // Format email with masking for privacy
  const formatEmailForDisplay = (emailAddress: string) => {
    if (!emailAddress) return '';
    
    const [username, domain] = emailAddress.split('@');
    if (!username || !domain) return emailAddress;
    
    // Show first 2 characters and last character of username, mask the rest
    const maskedUsername = username.length <= 4 
      ? username.charAt(0) + '***' 
      : username.slice(0, 2) + '***' + username.slice(-1);
    
    return `${maskedUsername}@${domain}`;
  };

  // Simulate initial SMS sending with a toast/notification when component mounts
  useEffect(() => {
    const contactMethod = isEmailVerification ? 'email' : 'SMS';
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 animate-slideInDown';
    notification.textContent = isRTL 
      ? `קוד אימות נשלח ל${contactMethod} שלך` 
      : `Verification code sent to your ${contactMethod}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
    
    setCodeSent(true);
    
    // Simulate attempt to automatically detect SMS code (mobile browsers only)
    if (!isEmailVerification && typeof window !== 'undefined' && 'OTPCredential' in window) {
      requestSMSPermission();
    }
  }, []);
  
  // Function to request SMS detection permission
  const requestSMSPermission = async () => {
    if (smsPermissionRequested) return;
    
    try {
      // This is a browser API that may not be available everywhere
      // @ts-ignore - TypeScript doesn't know about this API yet
      if (navigator.credentials && navigator.credentials.get) {
        setSmsPermissionRequested(true);
        setAutoDetectingCode(true);
        
        // Simulate delay for auto-detection
        smsDetectionTimeout.current = setTimeout(() => {
          // For demo purposes, auto-fill with 1234
          handleAutoDetectedCode('1234');
        }, 3000);
        
        // In a real implementation, you'd use:
        /*
        const credential = await navigator.credentials.get({
          otp: { transport: ['sms'] },
          signal: AbortSignal.timeout(30000)
        });
        
        if (credential && credential.code) {
          handleAutoDetectedCode(credential.code);
        }
        */
      }
    } catch (error) {
      console.error('SMS detection error:', error);
      setAutoDetectingCode(false);
    }
  };
  
  // Handle auto-detected code
  const handleAutoDetectedCode = (detectedCode: string) => {
    setCode(detectedCode);
    setIsValid(detectedCode.length === 4);
    setAutoDetectingCode(false);
    
    // Show notification for demo purposes
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 animate-slideInDown';
    notification.textContent = isRTL 
      ? 'קוד אומת אוטומטית!' 
      : 'Code auto-detected!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 2000);
  };

  // Set up the timer for resending code
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (smsDetectionTimeout.current) {
        clearTimeout(smsDetectionTimeout.current);
      }
    };
  }, []);

  // Format time left for display (MM:SS)
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle code input
  const handleCodeComplete = (completeCode: string) => {
    setCode(completeCode);
    setIsValid(completeCode.length === 4);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isValid || isLoading) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call to verify the code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, 1234 is correct, anything else is wrong
      const isCorrectCode = code === '1234';
      
      if (isCorrectCode) {
        // Show success animation
        setShowSuccessAnimation(true);
        
        // Wait for animation before proceeding
        setTimeout(() => {
          // Determine next step based on authentication flow
          if (isRegister) {
            // If new user registration, go to profile setup
            router.push('/auth/profile-setup');
          } else {
            // If existing user, check if they have already set up a profile
            const hasProfile = Math.random() > 0.3; // Simulate 70% chance of having profile
            
            if (hasProfile) {
              // User already has a profile, go to feed
              localStorage.setItem('userToken', 'demo-token-' + Date.now());
              router.push('/feed');
            } else {
              // User needs to set up profile
              router.push('/auth/profile-setup?returning=true');
            }
          }
        }, 1000);
      } else {
        // Show error for invalid code
        throw new Error(isRTL ? 'קוד שגוי. נסה שוב.' : 'Invalid code. Please try again.');
      }
    } catch (error: any) {
      // Handle errors
      setError(error.message || (isRTL ? 'שגיאה באימות. נסה שוב.' : 'Verification error. Please try again.'));
      setShowSuccessAnimation(false);
      
      // Simulate device vibration for error feedback on mobile devices
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (!canResend) {
      return;
    }
    
    setIsLoading(true);
    setCanResend(false);
    setError('');
    
    try {
      // Simulate API call to resend code
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Reset the timer
      setTimeLeft(180);
      
      // Show success toast
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 animate-slideInDown';
      notification.textContent = isRTL 
        ? 'קוד אימות חדש נשלח!' 
        : 'New verification code sent!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
      
      // If on a mobile device with SMS detection capabilities, try to detect again
      if (!isEmailVerification && typeof window !== 'undefined' && 'OTPCredential' in window) {
        setSmsPermissionRequested(false);
        requestSMSPermission();
      }
    } catch (error) {
      setError(isRTL ? 'שגיאה בשליחת הקוד. נסה שוב.' : 'Error sending code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-full bg-white w-full">
      {/* Status Bar Background */}
      <div className="h-[40px] bg-[#FF6B6B]"></div>
      
      {/* Theme & Language Settings */}
      <div className="absolute top-[50px] right-[20px] z-10">
        <ThemeLanguageSettings />
      </div>
      
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white/90 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content with Padding */}
      <div className="flex flex-col flex-1 px-[30px] md:max-w-[500px] md:mx-auto md:w-full">
        {/* Logo */}
        <motion.div
          className="flex justify-center mt-[40px] md:mt-[60px]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size={80} className="md:w-[100px] md:h-[100px]" />
        </motion.div>
        
        {/* Title */}
        <motion.h1 
          className="mt-[30px] text-[24px] md:text-[28px] font-bold text-[#2A363B] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t('auth.verify.title') || 'אימות קוד'}
        </motion.h1>
        
        {/* Description */}
        <motion.div 
          className="mt-[15px] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-[16px] md:text-[18px] text-[#757575]">
            {isEmailVerification 
              ? (t('auth.verify.sent.email') || 'שלחנו קוד אימות לאימייל:')
              : (t('auth.verify.sent') || 'שלחנו קוד אימות ל:')}
          </p>
          <p className="text-[16px] md:text-[18px] font-bold text-[#2A363B] mt-[5px]">
            {isEmailVerification 
              ? formatEmailForDisplay(email)
              : formatPhoneForDisplay(phone)}
          </p>
        </motion.div>
        
        {/* Auto-Detecting SMS Code Indicator */}
        <AnimatePresence>
          {autoDetectingCode && (
            <motion.div 
              className="mt-[10px] flex items-center justify-center space-x-2 rtl:space-x-reverse"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-[#FF6B6B] border-t-transparent animate-spin"></div>
              <p className="text-[14px] text-[#757575]">
                {t('auth.verify.detecting') || 'מזהה קוד SMS אוטומטית...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* SMS Status - Visible to show SMS was "sent" for demo */}
        {codeSent && !autoDetectingCode && (
          <motion.div 
            className="mt-[10px] text-center text-[14px] text-green-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isRTL ? 'קוד אימות נשלח בהצלחה! (1234 לצורכי הדגמה)' : 'Verification code sent successfully! (1234 for demo)'}
          </motion.div>
        )}
        
        {/* Verification Form */}
        <motion.div 
          className="mt-[40px] md:mt-[50px] md:bg-[#F8F8F8] md:p-8 md:rounded-[20px] md:shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* Code Input */}
            <VerificationCodeInput 
              onComplete={handleCodeComplete}
              error={!!error}
            />
            
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.p 
                  className="mt-[10px] text-[14px] text-[#FF4757] bg-red-50 px-4 py-2 rounded-lg w-full text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            
            {/* Resend Timer */}
            <p className="mt-[30px] text-[14px] text-[#757575]">
              {t('auth.verify.resend') || 'לא קיבלת? ניתן לשלוח שוב בעוד'} {formatTimeLeft()}
            </p>
            
            {/* Resend Button */}
            <motion.button
              type="button"
              className={`mt-[10px] text-[16px] font-bold ${canResend ? 'text-[#FF6B6B] hover:text-[#FF5252]' : 'text-[#AAAAAA]'} transition-colors`}
              onClick={handleResendCode}
              disabled={!canResend}
              whileHover={canResend ? { scale: 1.05 } : {}}
              whileTap={canResend ? { scale: 0.95 } : {}}
            >
              {t('auth.verify.new') || 'שלח קוד חדש'}
            </motion.button>
            
            {/* Verify Button */}
            <motion.div 
              className="mt-[40px] w-full max-w-[400px]"
              whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
              whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
            >
              <Button
                type="submit"
                primary
                disabled={!isValid || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                    {isRTL ? 'מאמת...' : 'Verifying...'}
                  </div>
                ) : t('auth.verify.button') || 'אמת קוד'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
        
        {/* Support Link */}
        <motion.div 
          className="mt-auto mb-[20px] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-[14px] text-[#757575]">
            {t('auth.verify.support') || 'נתקלת בבעיה?'}
            <Link href="/support" className={`text-[#FF6B6B] font-bold ${isRTL ? 'mr-1' : 'ml-1'} hover:underline`}>
              {isRTL ? 'צור קשר עם התמיכה' : 'Contact support'}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
