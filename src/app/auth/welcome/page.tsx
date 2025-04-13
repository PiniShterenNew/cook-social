'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { div } from 'framer-motion/client';

// Testimonial/tip data for carousel
const testimonials = [
  {
    id: 1,
    text: 'הכנתי את הלזניה מהמתכון באפליקציה והמשפחה שלי פשוט התמוגגה!',
    author: 'אורית, ירושלים',
    stars: 5
  },
  {
    id: 2,
    text: 'הרעיונות לארוחות מהירות בימי חול ממש הצילו אותי כשחזרתי מאוחר מהעבודה.',
    author: 'יעל, תל אביב',
    stars: 5
  },
  {
    id: 3,
    text: 'אני לא הכי טוב במטבח, אבל עם ההדרכות בוידאו אפילו אני הצלחתי להכין תבשילים מרשימים!',
    author: 'עומר, חיפה',
    stars: 4
  }
];

// Food tips for carousel
const tips = [
  {
    id: 1,
    text: 'המלח את הירקות שלך לפני הטיגון כדי להוציא את הלחות ולקבל טקסטורה פריכה.',
    icon: '🥬'
  },
  {
    id: 2,
    text: 'חמם את התבלינים שלך במחבת יבשה לפני השימוש כדי לשחרר את הארומה שלהם.',
    icon: '🌶️'
  },
  {
    id: 3,
    text: 'אל תגדוש את המחבת בזמן טיגון. שמור על מרווח בין המרכיבים לקבלת תוצאות טובות יותר.',
    icon: '🍳'
  }
];

export default function WelcomePage() {
  const { t, isRTL } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideType, setSlideType] = useState<'testimonial' | 'tip'>('testimonial');
  const slides = slideType === 'testimonial' ? testimonials : tips;

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      // Switch between tip and testimonial
      if (currentSlide >= slides.length - 1) {
        setSlideType(prev => prev === 'testimonial' ? 'tip' : 'testimonial');
        setCurrentSlide(0);
      } else {
        setCurrentSlide(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length, slideType]);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Render stars for testimonials
  const renderStars = (count: number) => {
    return (
      <div className="flex mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < count ? 'text-[#FFD700]' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Status Bar Background */}
      <div className="h-[40px] bg-[#FF6B6B] sm:h-0 sm:bg-transparent"></div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-between flex-1">
        {/* Top Section with Background Image */}
        <div className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            {/* High quality food image */}
            <motion.div
              className="w-full h-full bg-cover bg-center"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              style={{
                backgroundImage: "url('/images/welcome-food.jpg')"
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-[#00000050] to-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
          </div>

          {/* Floating food icons animation */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {['🍕', '🥗', '🍲', '🥘', '🍱', '🧁', '🥐', '🥪'].map((emoji, index) => (
              <motion.div
                key={index}
                className="absolute text-3xl"
                initial={{
                  x: Math.random() * 100 - 50,
                  y: -50,
                  opacity: 0,
                  rotate: Math.random() * 60 - 30
                }}
                animate={{
                  y: window.innerHeight + 50,
                  opacity: [0, 1, 1, 0],
                  rotate: Math.random() * 360 - 180
                }}
                transition={{
                  duration: 15 + Math.random() * 20,
                  repeat: Infinity,
                  delay: index * 2,
                  ease: "linear"
                }}
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </div>
        {/* Logo and Text */}
        <motion.div
          className="flex flex-col items-center -mt-20 z-10 px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Logo size={80} />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="mt-[15px] text-[28px] font-extrabold text-[#2A363B]"
          >
            {t('auth.welcome') || 'ברוכים הבאים!'}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-[10px] text-[16px] text-[#757575] text-center max-w-[85%]"
          >
            {t('auth.welcome.subtitle') || 'התחברו לגלות מתכונים מדהימים, לשתף את היצירות שלכם ולהצטרף לקהילת בישול תוססת!'}
          </motion.p>
        </motion.div>
        {/* Testimonials/Tips Carousel */}
        <motion.div
          variants={itemVariants}
          className="mt-[25px] w-full max-w-sm bg-[#F8F8F8] rounded-xl shadow-sm p-4"
        >
          <div className="relative overflow-hidden w-full">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-[#2A363B]">
                {slideType === 'testimonial' ? 'מה המשתמשים אומרים' : 'טיפים למטבח'}
              </h3>
              <div className="flex space-x-1 rtl:space-x-reverse">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-[#FF6B6B] w-4' : 'bg-gray-300'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Slide content */}
            <motion.div
              key={`${slideType}-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {slideType === 'testimonial' ? (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-[15px] text-[#555] mb-2">"{testimonials[currentSlide].text}"</p>
                  <div className="flex justify-between items-center">
                    <p className="text-[13px] font-medium text-[#2A363B]">{testimonials[currentSlide].author}</p>
                    {renderStars(testimonials[currentSlide].stars)}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3 shadow-sm flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="text-[28px]">{tips[currentSlide].icon}</div>
                  <p className="text-[15px] text-[#555]">{tips[currentSlide].text}</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
        {/* Action Buttons */}
        <motion.div
          className="flex flex-col w-[30%] items-center mt-auto mb-[30px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="/auth/login?mode=login" className="w-full">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button primary>{t('auth.login') || 'התחברות'}</Button>
            </motion.div>
          </Link>

          <Link href="/auth/login?mode=register" className="w-full mt-[15px]">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button outline>{t('auth.register') || 'הרשמה'}</Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Terms and Conditions */}
        <motion.p
          className="text-[12px] text-[#757575] text-center mb-[30px] px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {t('auth.terms') || 'בהמשך, אתם מסכימים לתנאי השימוש ולמדיניות הפרטיות שלנו'}
        </motion.p>
      </div>
    </div>
  );
}
