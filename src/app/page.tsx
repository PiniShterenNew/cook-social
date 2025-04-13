'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { t, isRTL } = useApp();
  const [loading, setLoading] = useState(true);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    // Minimum and maximum display times
    const minDisplayTime = 2000; // 2 seconds
    const maxDisplayTime = 5000; // 5 seconds
    const loadingTextDelay = 3000; // Show "טוען..." after 3 seconds (reduced from 5)
    
    let loadingTimeout: NodeJS.Timeout;
    let loadingTextTimeout: NodeJS.Timeout;
    let animationTimeout: NodeJS.Timeout;
    
    // Start measuring app loading
    const startTime = Date.now();
    
    // Function to check if user is logged in with real auth implementation
    const checkUserAuth = async () => {
      try {
        // Check localStorage first for quick response
        const token = localStorage.getItem('userToken');
        if (!token) return false;
        
        // Verify token is valid with API endpoint
        const response = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          // Use a shorter timeout for splash screen
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.isValid;
        }
        
        return false;
      } catch (error) {
        console.error("Auth verification error:", error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
          setNetworkError(true);
        }
        // Fallback to localStorage token only if network fails
        return !!localStorage.getItem('userToken');
      }
    };
    
    // Function to handle navigation after splash screen
    const handleNavigation = (isAuthenticated: boolean) => {
      if (isAuthenticated) {
        // Navigate to social feed if user is logged in
        router.push("/feed");
      } else {
        // Navigate to welcome screen if user is not logged in
        router.push("/auth/welcome");
      }
    };
    
    // Function to start exit animation
    const prepareExit = () => {
      setAnimationComplete(true);
      
      // Wait for animation to complete before navigating
      animationTimeout = setTimeout(async () => {
        try {
          // Perform auth check during animation
          const isAuthenticated = await checkUserAuth();
          setLoading(false);
          handleNavigation(isAuthenticated);
        } catch (error) {
          console.error("Navigation error:", error);
          setLoading(false);
          handleNavigation(false); // Default to welcome screen on error
        }
      }, 800); // Longer animation duration
    };
    
    // Calculate remaining time to ensure minimum display duration
    const completeLoading = async () => {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < minDisplayTime) {
        // If less than minimum time has passed, wait until minimum time
        loadingTimeout = setTimeout(prepareExit, minDisplayTime - elapsedTime);
      } else {
        // Minimum time has already passed, proceed immediately
        prepareExit();
      }
    };
    
    // Show loading text if loading takes too long
    loadingTextTimeout = setTimeout(() => {
      setShowLoadingText(true);
    }, loadingTextDelay);
    
    // Set maximum display time
    loadingTimeout = setTimeout(completeLoading, maxDisplayTime);
    
    // Attempt to pre-load user authentication during splash
    const preloadAuth = async () => {
      try {
        // Start pre-fetching some key resources
        const preloadResources = [
          fetch('/api/categories', { signal: AbortSignal.timeout(2000) }).catch(() => {}),
          fetch('/api/featured-recipes', { signal: AbortSignal.timeout(2000) }).catch(() => {})
        ];
        
        // Wait for preloads to complete
        await Promise.all(preloadResources);
        
        completeLoading();
      } catch (error) {
        console.error("Preload error:", error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
          setNetworkError(true);
        }
        completeLoading();
      }
    };
    
    // Start preloading
    preloadAuth();
    
    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(loadingTextTimeout);
      clearTimeout(animationTimeout);
    };
  }, [router]);

  if (!loading) return null; // Don't render anything during navigation

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Background image with gradient overlay */}
      <motion.div 
        className="absolute inset-0 z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url('/images/food-background.jpg')`,
            filter: 'blur(3px)',
            transform: 'scale(1.1)' // Slightly scale up to ensure coverage despite blur
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#00000099] via-[#ffffff50] to-white"></div>
      </motion.div>
      
      <motion.div 
        className="flex flex-col items-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: animationComplete ? 0 : 1, 
          y: animationComplete ? -20 : 0
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeInOut"
        }}
      >
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Logo size={120} variant="full" />
        </motion.div>
        
        {/* App Name */}
        <motion.h1 
          className="mt-[15px] text-[32px] font-extrabold text-[#2A363B]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          Cooksy
        </motion.h1>
        
        {/* App Slogan */}
        <motion.p 
          className="mt-[8px] text-[18px] text-[#2A363B] text-center max-w-xs px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {t('app.slogan') || 'הבית שלך לבישול – עם השראה, קהילה וכלים'}
        </motion.p>
        
        {/* Tagline */}
        <motion.p 
          className="mt-[10px] text-[16px] text-[#757575] text-center max-w-md px-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          {t('app.tagline') || 'גלה מתכונים, שתף יצירות ותצטרף לקהילת הבישול הגדולה בישראל'}
        </motion.p>
      </motion.div>
      
      {/* Loading Animation */}
      <div className="absolute bottom-[40px] flex flex-col items-center z-10">
        {networkError ? (
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-2 text-sm font-medium text-[#2A363B]">
              {t('app.network.error') || 'בעיית חיבור לרשת'}
            </p>
            <motion.button 
              className="mt-2 text-sm font-medium text-[#FF6B6B] hover:text-[#FF5252]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
            >
              {t('app.network.retry') || 'נסה שוב'}
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="w-[30px] h-[30px] rounded-full border-3 border-[#FF6B6B] border-t-transparent animate-spin shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Loading Text (shown after delay) */}
            {showLoadingText && (
              <motion.p 
                className="mt-3 text-sm font-medium text-[#2A363B]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {t('app.loading') || 'טוען...'}
              </motion.p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
