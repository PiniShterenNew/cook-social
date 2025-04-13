'use client';

import { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useApp } from '@/context/AppContext';
import ThemeLanguageSettings from '@/components/settings/ThemeLanguageSettings';

// מוק של שמות משתמש תפוסים לצורך הדגמה
const takenUsernames = ['chef_yossi', 'cook_master', 'foodlover', 'chef_cohen', 'baker123'];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { t, isRTL } = useApp();
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  
  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
  });
  
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // טיימר לבדיקת שם משתמש
  const usernameCheckTimer = useRef<NodeJS.Timeout | null>(null);
  
  // בדיקת זמינות שם משתמש בזמן הקלדה
  useEffect(() => {
    if (username.trim().length < 3) {
      setIsUsernameAvailable(null);
      setSuggestedUsernames([]);
      return;
    }
    
    // נקה טיימר קודם אם קיים
    if (usernameCheckTimer.current) {
      clearTimeout(usernameCheckTimer.current);
    }
    
    // הגדר טיימר חדש להשהיית הבדיקה בזמן הקלדה
    setUsernameChecking(true);
    usernameCheckTimer.current = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 600);
    
    return () => {
      if (usernameCheckTimer.current) {
        clearTimeout(usernameCheckTimer.current);
      }
    };
  }, [username]);
  
  // פונקציה לבדיקת זמינות שם משתמש (סימולציה)
  const checkUsernameAvailability = (username: string) => {
    // בדיקת תקינות בסיסית
    if (username.includes(' ')) {
      setErrors(prev => ({ ...prev, username: isRTL ? 'שם משתמש לא יכול להכיל רווחים' : 'Username cannot contain spaces' }));
      setIsUsernameAvailable(false);
      setUsernameChecking(false);
      return;
    }
    
    // סימולציה של בדיקת זמינות מול השרת
    setTimeout(() => {
      const isTaken = takenUsernames.includes(username);
      setIsUsernameAvailable(!isTaken);
      setUsernameChecking(false);
      
      // אם השם תפוס, הצע אלטרנטיבות
      if (isTaken) {
        generateSuggestedUsernames(username);
        setErrors(prev => ({ ...prev, username: isRTL ? 'שם המשתמש כבר תפוס' : 'Username is already taken' }));
      } else {
        setSuggestedUsernames([]);
        setErrors(prev => ({ ...prev, username: '' }));
      }
    }, 800);
  };
  
  // יצירת הצעות לשמות משתמש חלופיים
  const generateSuggestedUsernames = (username: string) => {
    const suggestions = [
      `${username}${Math.floor(Math.random() * 100)}`,
      `${username}_${Math.floor(Math.random() * 100)}`,
      `the_${username}`,
      `${username}_chef`,
      `cooking_with_${username}`
    ].filter(suggestion => !takenUsernames.includes(suggestion));
    
    setSuggestedUsernames(suggestions.slice(0, 3));
  };
  
  // טיפול בבחירת שם משתמש מוצע
  const selectSuggestedUsername = (suggestedUsername: string) => {
    setUsername(suggestedUsername);
    setIsUsernameAvailable(true);
    setSuggestedUsernames([]);
    setErrors(prev => ({ ...prev, username: '' }));
  };

  // טיפול בהעלאת תמונת פרופיל
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // יצירת תצוגה מקדימה של התמונה
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
        // פתיחת מצב עריכת תמונה
        setIsEditingImage(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // טיפול בשינוי מיקום התמונה (עריכה)
  const handleImageDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isEditingImage) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // מגע
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // עכבר
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // עדכון מיקום התמונה
    setImagePosition(prev => ({
      x: prev.x + clientX / 100,
      y: prev.y + clientY / 100
    }));
  };
  
  // שינוי מידת הזום של התמונה
  const handleImageZoom = (zoomIn: boolean) => {
    setImageScale(prev => {
      const newScale = zoomIn ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(newScale, 2)); // הגבל בין 0.5 ל-2
    });
  };
  
  // סיום עריכת התמונה
  const finishImageEditing = () => {
    setIsEditingImage(false);
  };

  // וידוא תקינות הטופס
  const validateForm = () => {
    const newErrors = {
      fullName: '',
      username: '',
    };
    
    let isValid = true;
    
    if (!fullName.trim()) {
      newErrors.fullName = isRTL ? 'שם מלא הוא שדה חובה' : 'Full name is required';
      isValid = false;
    }
    
    if (!username.trim()) {
      newErrors.username = isRTL ? 'שם משתמש הוא שדה חובה' : 'Username is required';
      isValid = false;
    } else if (username.trim().includes(' ')) {
      newErrors.username = isRTL ? 'שם משתמש לא יכול להכיל רווחים' : 'Username cannot contain spaces';
      isValid = false;
    } else if (isUsernameAvailable === false) {
      newErrors.username = isRTL ? 'שם המשתמש כבר תפוס' : 'Username is already taken';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // טיפול בשליחת הטופס
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // סימולציה של שמירת פרופיל ב-API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // הצגת התראת הצלחה
      showNotification(
        isRTL ? 'הפרופיל נשמר בהצלחה!' : 'Profile saved successfully!',
        'success'
      );
      
      // ניווט לדף בחירת תחומי עניין
      setTimeout(() => {
        router.push('/auth/interests');
      }, 1500);
    } catch (error) {
      showNotification(
        isRTL ? 'אירעה שגיאה בשמירת הפרופיל, אנא נסה שוב' : 'An error occurred while saving your profile, please try again',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // פונקציה להצגת התראות
  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${isRTL ? 'left-4 right-auto' : ''} ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white p-4 rounded-lg shadow-lg z-50 animate-slideInDown`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  // טיפול בכפתור הדילוג
  const handleSkip = () => {
    router.push('/auth/interests');
  };

  // חישוב אחוז השלמת הפרופיל
  const calculateCompletionPercentage = () => {
    let completed = 0;
    let total = 3; // Name, username, profile pic
    
    if (fullName.trim()) completed++;
    if (username.trim() && isUsernameAvailable) completed++;
    if (profileImagePreview) completed++;
    
    return Math.round((completed / total) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();
  
  // רשימת קישורים לתגיות עניין נפוצות
  const popularInterests = [
    { id: 'italian', label: 'איטלקי' },
    { id: 'desserts', label: 'קינוחים' },
    { id: 'baking', label: 'אפייה' },
    { id: 'quick_meals', label: 'ארוחות מהירות' },
    { id: 'vegan', label: 'טבעוני' }
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen bg-white">
      {/* Status Bar Background */}
      <div className="h-[40px] bg-[#FF6B6B]"></div>
      
      {/* Header */}
      <div className="px-[30px] py-[20px] flex justify-between items-center">
        <BackButton />
        
        {/* Step Indicator */}
        <div className="flex gap-[8px]">
          <div className="w-[8px] h-[8px] rounded-full bg-[#2ED573]"></div>
          <div className="w-[8px] h-[8px] rounded-full bg-[#E0E0E0]"></div>
          <div className="w-[8px] h-[8px] rounded-full bg-[#E0E0E0]"></div>
        </div>
        
        {/* Theme & Language */}
        <div className="flex items-center gap-3">
          <ThemeLanguageSettings variant="minimal" />
          <button
            onClick={handleSkip}
            className="text-[14px] font-bold text-[#FF6B6B]"
          >
            {t('profile.skip') || 'דלג'}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-[30px] pt-0">
        {/* Page Title */}
        <div className="mb-[30px]">
          <h1 className="text-[28px] font-bold text-[#2A363B]">
            {t('profile.create') || 'יצירת פרופיל'}
          </h1>
          <p className="text-[16px] text-[#757575] mt-[10px]">
            {t('profile.subtitle') || 'ספר לנו קצת על עצמך'}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-[#FF6B6B]">
                  {completionPercentage}% {t('profile.completed') || 'הושלם'}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[#F0F0F0]">
              <div 
                style={{ width: `${completionPercentage}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#FF6B6B] transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
        
        {/* Image Editor Modal */}
        {isEditingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">{t('profile.edit.image') || 'ערוך תמונת פרופיל'}</h2>
              
              <div className="relative w-full h-[250px] mb-4 overflow-hidden rounded-lg">
                <div 
                  className="absolute inset-0 cursor-move"
                  style={{ 
                    backgroundImage: `url(${profileImagePreview})`,
                    backgroundSize: `${imageScale * 100}%`,
                    backgroundPosition: `${50 + imagePosition.x}% ${50 + imagePosition.y}%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                  onMouseMove={handleImageDrag}
                  onTouchMove={handleImageDrag}
                ></div>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <button 
                  onClick={() => handleImageZoom(false)}
                  className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center mr-4"
                >
                  <span className="text-xl">-</span>
                </button>
                <div className="text-sm text-[#757575] w-20 text-center">
                  {t('profile.zoom') || 'זום'}
                </div>
                <button 
                  onClick={() => handleImageZoom(true)}
                  className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center ml-4"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => {
                    setProfileImagePreview(null);
                    setProfileImage(null);
                    setIsEditingImage(false);
                  }}
                  className="px-4 py-2 bg-[#F0F0F0] text-[#2A363B] rounded-md"
                >
                  {t('profile.cancel') || 'ביטול'}
                </button>
                <button 
                  onClick={finishImageEditing}
                  className="px-4 py-2 bg-[#FF6B6B] text-white rounded-md"
                >
                  {t('profile.save') || 'שמור'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center md:col-span-2 mb-[30px]">
            <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-[#F0F0F0] rounded-full flex items-center justify-center">
                {profileImagePreview ? (
                  <Image 
                    src={profileImagePreview}
                    alt="Profile Preview"
                    width={150}
                    height={150}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#757575"/>
                  </svg>
                )}
              </div>
              
              {/* Add Button */}
              <label 
                htmlFor="profile-image-upload" 
                className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-[40px] h-[40px] bg-[#FF6B6B] border-2 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FF5252] transition-colors shadow-md`}
              >
                {profileImagePreview ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white"/>
                  </svg>
                )}
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            
            <p className="text-[14px] text-[#757575] mt-[15px]">
              {t('profile.add.image') || 'הוסף תמונת פרופיל'}
            </p>
          </div>
          
          {/* Full Name Input */}
          <div className="md:col-span-1">
            <Input
              label={t('profile.name') || 'שם מלא'}
              placeholder={isRTL ? "ישראל ישראלי" : "John Doe"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              error={errors.fullName}
              className="mb-[20px]"
            />
          </div>
          
          {/* Username Input with Availability Check */}
          <div className="md:col-span-1 relative">
            <Input
              label={t('profile.username') || 'שם משתמש'}
              placeholder={isRTL ? "israel_cook" : "john_cook"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              error={errors.username}
              className="mb-[20px]"
              suffixElement={
                usernameChecking ? (
                  <div className="w-5 h-5 border-2 border-[#FF6B6B] border-t-transparent rounded-full animate-spin"></div>
                ) : username.trim().length >= 3 && isUsernameAvailable !== null ? (
                  isUsernameAvailable ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )
                ) : null
              }
            />
            
            {/* Suggested Usernames */}
            {suggestedUsernames.length > 0 && (
              <div className="mt-1 mb-4 bg-white rounded-md shadow-sm p-2 border border-[#E0E0E0]">
                <p className="text-xs text-[#757575] mb-2">
                  {t('profile.username.suggestions') || 'שמות משתמש מוצעים:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedUsernames.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestedUsername(suggestion)}
                      className="text-xs bg-[#F8F8F8] text-[#2A363B] px-3 py-1 rounded-full hover:bg-[#FF6B6B] hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Bio Input - Full width on desktop */}
          <div className="mb-[20px] md:col-span-2">
            <label className="block text-[14px] font-medium text-[#757575] mb-2">
              {t('profile.bio') || 'ביוגרפיה'} <span className="text-[#757575]">({t('profile.optional') || 'אופציונלי'})</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('profile.bio.placeholder') || 'ספר על עצמך בקצרה...'}
              className={`h-[100px] md:h-[120px] px-4 py-3 rounded-[12px] border-2 border-[#E0E0E0] bg-white w-full focus:border-[#FF6B6B] outline-none resize-none ${isRTL ? 'text-right' : 'text-left'}`}
              maxLength={150}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <div className={`flex justify-between items-center mt-1`}>
              <p className="text-[12px] text-[#757575]">
                {t('profile.bio.hint') || 'הביוגרפיה שלך תופיע בפרופיל הציבורי שלך'}
              </p>
              <p 
                className={`text-[12px] ${
                  bio.length > 120 ? 'text-[#FF6B6B]' : 'text-[#757575]'
                }`}
              >
                {bio.length}/150
              </p>
            </div>
          </div>
          
          {/* Interest Tags - Quick Selection */}
          <div className="mb-[30px] md:col-span-2">
            <label className="block text-[14px] font-medium text-[#757575] mb-2">
              {t('profile.interests') || 'תחומי עניין'} <span className="text-[#757575]">({t('profile.can_edit_later') || 'ניתן לערוך בהמשך'})</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {popularInterests.map(interest => (
                <div
                  key={interest.id}
                  className="px-3 py-1 bg-[#F8F8F8] text-[#757575] border border-[#E0E0E0] rounded-full text-sm cursor-pointer hover:bg-[#FFEFEF] hover:text-[#FF6B6B] hover:border-[#FFCACA] transition-colors"
                >
                  {interest.label}
                </div>
              ))}
              <div className="px-3 py-1 bg-white text-[#FF6B6B] border border-[#FF6B6B] rounded-full text-sm cursor-pointer hover:bg-[#FFEFEF]">
                + {t('profile.add_more') || 'הוסף עוד'}
              </div>
            </div>
          </div>
          
          {/* Submit Button - Full width on desktop */}
          <div className="md:col-span-2 mt-auto md:mt-4 md:flex md:justify-center">
            <Button
              type="submit"
              primary
              disabled={isSubmitting}
              className="mb-[20px] md:max-w-[400px]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                  {isRTL ? 'שומר...' : 'Saving...'}
                </div>
              ) : t('auth.continue') || 'המשך'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
