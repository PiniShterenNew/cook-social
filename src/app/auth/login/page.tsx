'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import PhoneInput from '@/components/PhoneInput';
import { useApp } from '@/context/AppContext';
import ThemeLanguageSettings from '@/components/settings/ThemeLanguageSettings';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const isRegister = mode === 'register';
  const { t, isRTL } = useApp();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const socialButtonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  // Validate the form as the user types
  useEffect(() => {
    validateForm();
  }, [phoneNumber, email, password, loginMethod]);

  // Function to validate the form
  const validateForm = () => {
    // Reset previous errors
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    
    if (loginMethod === 'phone') {
      // Basic phone validation (Israeli phone number)
      if (!phoneNumber) {
        setIsValid(false);
        return;
      }
      
      // Remove any non-digit characters
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Check if phone has 9-10 digits (Israeli phone numbers)
      if (cleanPhone.length < 9 || cleanPhone.length > 10) {
        setPhoneError(isRTL ? 'אנא הזן מספר טלפון תקין' : 'Please enter a valid phone number');
        setIsValid(false);
        return;
      }
      
      // Validate Israeli phone prefixes (05X)
      if (!cleanPhone.match(/^0?(5\d{8})$/)) {
        setPhoneError(isRTL ? 'מספר טלפון לא תקין' : 'Invalid phone number');
        setIsValid(false);
        return;
      }
      
      setIsValid(true);
    } else {
      // Email and password validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email) {
        setEmailError(isRTL ? 'אנא הזן כתובת אימייל' : 'Please enter an email address');
        setIsValid(false);
        return;
      }
      
      if (!emailRegex.test(email)) {
        setEmailError(isRTL ? 'כתובת אימייל לא תקינה' : 'Invalid email address');
        setIsValid(false);
        return;
      }
      
      if (!password) {
        setPasswordError(isRTL ? 'אנא הזן סיסמה' : 'Please enter a password');
        setIsValid(false);
        return;
      }
      
      if (isRegister && password.length < 8) {
        setPasswordError(isRTL ? 'הסיסמה חייבת להכיל לפחות 8 תווים' : 'Password must be at least 8 characters');
        setIsValid(false);
        return;
      }
      
      setIsValid(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isValid || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    setShowSuccessAnimation(false);
    
    try {
      // Perform login/register logic based on method and mode
      if (loginMethod === 'phone') {
        // Format the phone number
        const formattedPhone = phoneNumber.replace(/\D/g, '');
        
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // If successful, show success animation then redirect
        setShowSuccessAnimation(true);
        
        setTimeout(() => {
          // Redirect to verification page with phone number in query params
          router.push(`/auth/verify?phone=${formattedPhone}&mode=${mode}`);
        }, 800);
      } else {
        // Email/password authentication
        // Simulate API request with potential failure
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Randomly simulate an error for demo purposes (20% chance)
        if (Math.random() < 0.2) {
          throw new Error(isRegister 
            ? 'This email is already registered. Please login instead.' 
            : 'Invalid email or password. Please try again.'
          );
        }
        
        // If successful and not register mode, show success and redirect to feed
        if (!isRegister) {
          setShowSuccessAnimation(true);
          localStorage.setItem('userToken', 'demo-token-' + Date.now());
          
          setTimeout(() => {
            router.push('/feed');
          }, 800);
        } else {
          // If register, redirect to verification
          router.push(`/auth/verify?email=${encodeURIComponent(email)}&mode=${mode}`);
        }
      }
    } catch (error: any) {
      setGeneralError(error.message || 'An error occurred. Please try again.');
      setShowSuccessAnimation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    try {
      setGeneralError('');
      setIsSubmitting(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show notification for demo purposes
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-[#FF6B6B] text-white p-3 rounded-lg shadow-lg z-50 animate-slideInDown';
      notification.textContent = `${provider} login would be implemented here in production.`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setGeneralError(`Failed to login with ${provider}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle login method
  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
    setIsValid(false);
    setGeneralError('');
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen bg-white">
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
        {/* Header with Back Button */}
        <div className="mt-[20px] flex">
          <BackButton />
        </div>
        
        {/* Logo and App Info */}
        <motion.div
          className="flex flex-col items-center mt-[40px] mb-[20px] md:mt-[60px]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size={80} className="md:w-[100px] md:h-[100px]" />
          <h1 className="mt-[15px] text-[28px] md:text-[32px] font-extrabold text-[#2A363B]">
            {t('app.name')}
          </h1>
          <p className="mt-[5px] text-[14px] md:text-[16px] text-[#757575]">
            {t('app.slogan')}
          </p>
        </motion.div>
        
        {/* Login Form */}
        <motion.div 
          className="flex-1 flex flex-col md:bg-[#F8F8F8] md:p-8 md:rounded-[20px] md:shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.form 
              key={loginMethod}
              onSubmit={handleSubmit} 
              className="flex flex-col"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-[24px] md:text-[26px] font-bold text-[#2A363B] text-center">
                {isRegister ? t('auth.register') : t('auth.login')}
              </h2>
              
              {/* Toggle between phone and email login */}
              <div className="mt-[10px] flex justify-center">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`px-4 py-2 text-sm rounded-md transition-all ${
                      loginMethod === 'phone'
                        ? 'bg-white text-[#2A363B] shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    {t('auth.phone') || 'טלפון'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`px-4 py-2 text-sm rounded-md transition-all ${
                      loginMethod === 'email'
                        ? 'bg-white text-[#2A363B] shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    {t('auth.email') || 'אימייל'}
                  </button>
                </div>
              </div>
              
              {/* General Error Message */}
              {generalError && (
                <motion.div
                  className="mt-[15px] p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[14px]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {generalError}
                </motion.div>
              )}
              
              {/* Phone Input Field */}
              {loginMethod === 'phone' ? (
                <div className="mt-[20px] md:mt-[30px]">
                  <label className="block text-[14px] font-medium text-[#2A363B] mb-[8px]">
                    {t('auth.phone.label')}
                  </label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    error={phoneError}
                    placeholder={t('auth.phone.placeholder') || '050-123-4567'}
                  />
                  {phoneError && (
                    <p className={`mt-[5px] text-[12px] text-[#FF4757] ${isRTL ? 'text-right' : 'text-left'}`}>
                      {phoneError}
                    </p>
                  )}
                  <p className="mt-[10px] text-[12px] text-[#757575]">
                    {t('auth.phone.info')}
                  </p>
                </div>
              ) : (
                <div className="mt-[20px]">
                  {/* Email Input */}
                  <div className="mb-[15px]">
                    <label className="block text-[14px] font-medium text-[#2A363B] mb-[8px]">
                      {t('auth.email.label') || 'כתובת אימייל'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full h-[50px] px-[15px] border ${
                        emailError ? 'border-[#FF4757]' : 'border-[#E0E0E0]'
                      } rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent`}
                      placeholder={t('auth.email.placeholder') || 'your@email.com'}
                    />
                    {emailError && (
                      <p className={`mt-[5px] text-[12px] text-[#FF4757] ${isRTL ? 'text-right' : 'text-left'}`}>
                        {emailError}
                      </p>
                    )}
                  </div>
                  
                  {/* Password Input */}
                  <div>
                    <label className="block text-[14px] font-medium text-[#2A363B] mb-[8px]">
                      {t('auth.password.label') || 'סיסמה'}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full h-[50px] px-[15px] border ${
                        passwordError ? 'border-[#FF4757]' : 'border-[#E0E0E0]'
                      } rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent`}
                      placeholder={t('auth.password.placeholder') || '••••••••'}
                    />
                    {passwordError && (
                      <p className={`mt-[5px] text-[12px] text-[#FF4757] ${isRTL ? 'text-right' : 'text-left'}`}>
                        {passwordError}
                      </p>
                    )}
                    
                    {/* Forgot Password */}
                    {!isRegister && (
                      <div className="mt-[10px] text-right">
                        <Link href="/auth/recover-password" className="text-[12px] text-[#FF6B6B] hover:text-[#FF5252] transition-colors">
                          {t('auth.forgot.password') || 'שכחת סיסמה?'}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <Button
                type="submit"
                primary
                disabled={!isValid || isSubmitting}
                className="mt-[30px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                    {isRTL ? 'מתחבר...' : 'Connecting...'}
                  </div>
                ) : isRegister ? t('auth.register') : t('auth.login')}
              </Button>
              
              {/* Divider */}
              <div className="flex items-center mt-[30px]">
                <div className="flex-1 h-[1px] bg-[#E0E0E0]"></div>
                <span className="mx-[15px] text-[14px] text-[#757575]">{t('auth.or')}</span>
                <div className="flex-1 h-[1px] bg-[#E0E0E0]"></div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="flex justify-center mt-[20px] gap-[15px]">
                {/* Google */}
                <motion.button 
                  type="button"
                  className="w-[55px] h-[55px] md:w-[60px] md:h-[60px] bg-[#F8F8F8] md:bg-white border border-[#E0E0E0] rounded-[12px] flex items-center justify-center transition-all duration-200"
                  variants={socialButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="Google"
                  onClick={() => handleSocialLogin('Google')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
                    <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
                    <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
                    <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
                  </svg>
                </motion.button>
                
                {/* Facebook */}
                <motion.button 
                  type="button"
                  className="w-[55px] h-[55px] md:w-[60px] md:h-[60px] bg-[#F8F8F8] md:bg-white border border-[#E0E0E0] rounded-[12px] flex items-center justify-center transition-all duration-200"
                  variants={socialButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="Facebook"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.9 2H3.1C2.49 2 2 2.49 2 3.1V20.9C2 21.51 2.49 22 3.1 22H12.69V14.23H10.11V11.17H12.69V8.93C12.69 6.33 14.15 5.04 16.47 5.04C17.61 5.04 18.59 5.13 18.87 5.16V7.89H17.31C16.1 7.89 15.86 8.47 15.86 9.31V11.17H18.78L18.38 14.23H15.86V22H20.9C21.51 22 22 21.51 22 20.9V3.1C22 2.49 21.51 2 20.9 2Z" fill="#1877F2"/>
                  </svg>
                </motion.button>
                
                {/* Apple */}
                <motion.button 
                  type="button"
                  className="w-[55px] h-[55px] md:w-[60px] md:h-[60px] bg-[#F8F8F8] md:bg-white border border-[#E0E0E0] rounded-[12px] flex items-center justify-center transition-all duration-200"
                  variants={socialButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="Apple"
                  onClick={() => handleSocialLogin('Apple')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09998 22C7.78998 22.05 6.79998 20.68 5.95998 19.47C4.24998 17 2.93998 12.45 4.69998 9.39C5.56998 7.87 7.12998 6.91 8.81998 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="black"/>
                  </svg>
                </motion.button>
              </div>
            </motion.form>
          </AnimatePresence>
          
          {/* Terms Text */}
          <p className="text-[12px] text-[#757575] text-center mt-auto pt-[30px]">
            {t('auth.terms')}
          </p>
          
          {/* Switch Login/Register */}
          <div className="my-[20px] text-center">
            <p className="text-[14px] text-[#757575]">
              {isRegister ? t('auth.have.account') : t('auth.no.account')} 
              <Link 
                href={isRegister ? '/auth/login?mode=login' : '/auth/login?mode=register'} 
                className={`text-[#FF6B6B] font-bold ${isRTL ? 'mr-1' : 'ml-1'} hover:text-[#FF5252] transition-colors`}
              >
                {isRegister ? t('auth.login') : t('auth.register')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
