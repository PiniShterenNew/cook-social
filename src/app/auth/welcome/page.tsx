'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { useApp } from '@/context/AppContext';

// Testimonial data with enhanced styling
const testimonials = [
  {
    id: 1,
    text: "מצאתי כאן מתכונים מדהימים שהפכו את ארוחות המשפחה שלנו לחוויה אמיתית!",
    author: "מיכל, תל אביב",
    style: "bg-orange-50 border-orange-200",
    icon: "🍽️",
    position: { desktop: { top: '20%', left: '20%' } }
  },
  {
    id: 2,
    text: "הקהילה כאן מדהימה, קיבלתי המון עצות וטיפים שעזרו לי להשתפר בבישול.",
    author: "דני, חיפה",
    style: "bg-blue-50 border-blue-200",
    icon: "👨‍🍳",
    position: { desktop: { top: '39%', left: '10%' } }
  },
  {
    id: 3,
    text: "האפליקציה הזו שינתה את הדרך שבה אני מתכננת את התפריט השבועי שלי.",
    author: "רונית, ירושלים",
    style: "bg-green-50 border-green-200",
    icon: "📱",
    position: { desktop: { top: '58%', left: '20%' } }
  }
];

// Kitchen tips data with enhanced styling
const kitchenTips = [
  {
    id: 1,
    text: "הוסיפו מעט מלח לקפה שלכם לפני הבישול כדי להפחית את המרירות.",
    icon: "☕",
    style: "bg-red-50 border-red-200",
    position: { desktop: { top: '20%', right: '15%' } }
  },
  {
    id: 2,
    text: "חממו לימון במיקרוגל למשך 15 שניות לפני סחיטה לקבלת יותר מיץ.",
    icon: "🍋",
    style: "bg-yellow-50 border-yellow-200",
    position: { desktop: { top: '50%', right: '10%' } }
  },
  {
    id: 3,
    text: "השתמשו בקרח כדי להסיר עודף שומן ממרקים ותבשילים.",
    icon: "🍲",
    style: "bg-teal-50 border-teal-200",
    position: { desktop: { top: '35%', right: '5%' } }
  }
];

// All content items combined for mobile carousel
const allContentItems = [...testimonials, ...kitchenTips];

export default function WelcomePage() {
  const { t, isRTL } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  // Check if mobile based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Auto-rotate slides for mobile carousel
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % allContentItems.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMobile]);

  // For desktop: staggered appearance of items
  useEffect(() => {
    if (!isMobile) {
      // Initially show nothing
      setVisibleItems([]);

      // Then gradually show items with delays
      const allItems = [...testimonials.map(t => t.id), ...kitchenTips.map(t => t.id)];
      const randomizedItems = [...allItems].sort(() => Math.random() - 0.5);

      randomizedItems.forEach((id, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, id]);
        }, 1000 + (index * 600)); // Slightly faster staggered appearance
      });
    }
  }, [isMobile]);

  // Determine if an item should be visible on desktop
  const isItemVisible = (id: number) => {
    return visibleItems.includes(id);
  };

  // Handle manual navigation for mobile carousel
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

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-full w-full justify-center items-center bg-white overflow-hidden">
      {/* Background gradient and color */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F5] to-white z-0"></div>

      {/* Status Bar Background */}
      <div className="h-[40px] bg-[#FF6B6B] sm:h-0 sm:bg-transparent z-10"></div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full relative z-10 gap-20">
        {/* Logo and Text */}
        <motion.div
          className="flex flex-col items-center mt-4 md:mt-10 z-20 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Logo size={isMobile ? 70 : 90} />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="mt-[10px] text-[26px] md:text-[32px] font-extrabold text-[#2A363B]"
          >
            {t('auth.welcome') || 'ברוכים הבאים ל-Cooksy'}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-[6px] text-[15px] md:text-[17px] text-[#757575] text-center max-w-[90%] md:max-w-[500px]"
          >
            {t('auth.welcome.subtitle') || 'הצטרפו לקהילת הבישול הגדולה בישראל וגלו מתכונים מדהימים'}
          </motion.p>
        </motion.div>

        {/* Content area - different for mobile and desktop */}
        {isMobile ? (
          /* Mobile: Unified Carousel (more compact) */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-full h-[100px] max-w-xs px-4"
          >
            <div className="relative overflow-hidden w-full">
              {/* Current Content Item */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl p-3 border shadow-md ${allContentItems[currentSlide].style
                    }`}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-2 rtl:ml-2 rtl:mr-0">
                      {allContentItems[currentSlide].icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-[#2A363B] text-sm">
                        {allContentItems[currentSlide].text}
                      </p>
                      {'author' in allContentItems[currentSlide] && (
                        <p className="text-[#757575] text-xs text-left rtl:text-right mt-1">
                          - {(allContentItems[currentSlide] as any).author}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Content Indicator Dots */}
              <div className="flex justify-center mt-4 space-x-1 rtl:space-x-reverse">
                {allContentItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-[#FF6B6B] w-4' : 'bg-gray-300'
                      }`}
                    aria-label={`עבור לפריט ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Desktop: Centered scattered items */
          <div className="absolute w-full h-screen">
            {/* Testimonials */}
            {testimonials.map((testimonial) => (
              <AnimatePresence key={`testimonial-${testimonial.id}`}>
                {isItemVisible(testimonial.id) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      duration: 0.6
                    }}
                    className={`absolute max-w-[250px] rounded-xl p-3 shadow-md border ${testimonial.style} transform z-20`}
                    style={testimonial.position.desktop}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-2 rtl:ml-2 rtl:mr-0">
                        {testimonial.icon}
                      </span>
                      <div>
                        <p className="text-[#2A363B] text-sm mb-1">"{testimonial.text}"</p>
                        <p className="text-[#757575] text-xs text-left rtl:text-right">
                          - {testimonial.author}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}

            {/* Kitchen Tips */}
            {kitchenTips.map((tip) => (
              <AnimatePresence key={`tip-${tip.id}`}>
                {isItemVisible(tip.id) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      duration: 0.6
                    }}
                    className={`absolute max-w-[250px] rounded-xl p-3 shadow-md border ${tip.style} transform z-20`}
                    style={tip.position.desktop}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-2 rtl:ml-2 rtl:mr-0">{tip.icon}</span>
                      <p className="text-[#2A363B] text-sm flex-1">{tip.text}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        )}

        <div>
          {/* Action Buttons */}
          <motion.div
            className="flex flex-col w-full max-w-xs items-center mt-auto mb-[30px] px-5"
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
            className="text-[12px] text-[#757575] text-center mb-[20px] px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {t('auth.terms') || 'בהמשך, אתם מסכימים לתנאי השימוש ולמדיניות הפרטיות שלנו'}
          </motion.p>
        </div>
      </div>
    </div>
  );
}