'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import Button from '@/components/Button';

// Define interest categories
const interestCategories = [
  {
    id: 'cuisine',
    title: 'מטבחים',
    items: [
      { id: 'israeli', label: 'ישראלי' },
      { id: 'italian', label: 'איטלקי' },
      { id: 'asian', label: 'אסייתי' },
      { id: 'mediterranean', label: 'ים תיכוני' },
      { id: 'american', label: 'אמריקאי' },
      { id: 'mexican', label: 'מקסיקני' },
      { id: 'french', label: 'צרפתי' },
      { id: 'indian', label: 'הודי' },
    ],
  },
  {
    id: 'dietary',
    title: 'סגנונות תזונה',
    items: [
      { id: 'vegetarian', label: 'צמחוני' },
      { id: 'vegan', label: 'טבעוני' },
      { id: 'gluten_free', label: 'ללא גלוטן' },
      { id: 'keto', label: 'קטו' },
      { id: 'low_carb', label: 'דל פחמימות' },
      { id: 'paleo', label: 'פליאו' },
      { id: 'kosher', label: 'כשר' },
    ],
  },
  {
    id: 'meal_type',
    title: 'סוגי ארוחות',
    items: [
      { id: 'breakfast', label: 'ארוחת בוקר' },
      { id: 'lunch', label: 'ארוחת צהריים' },
      { id: 'dinner', label: 'ארוחת ערב' },
      { id: 'desserts', label: 'קינוחים' },
      { id: 'snacks', label: 'חטיפים' },
      { id: 'salads', label: 'סלטים' },
      { id: 'soups', label: 'מרקים' },
      { id: 'bread', label: 'מאפים ולחמים' },
    ],
  },
  {
    id: 'cooking_method',
    title: 'שיטות בישול',
    items: [
      { id: 'quick_easy', label: 'מהיר וקל' },
      { id: 'slow_cooking', label: 'בישול איטי' },
      { id: 'baking', label: 'אפייה' },
      { id: 'grilling', label: 'גריל' },
      { id: 'sous_vide', label: 'סו ויד' },
      { id: 'pressure_cooking', label: 'סיר לחץ' },
      { id: 'air_fryer', label: 'אייר פרייר' },
    ],
  },
];

export default function InterestsPage() {
  const router = useRouter();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toggle interest selection
  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };
  
  // Check if an interest is selected
  const isInterestSelected = (interestId: string) => {
    return selectedInterests.includes(interestId);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to save interests
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to the feed page
      router.push('/feed');
    } catch (error) {
      alert('אירעה שגיאה בשמירת תחומי העניין, אנא נסה שוב');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle skip button
  const handleSkip = () => {
    router.push('/feed');
  };

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-white">
      {/* Status Bar Background */}
      <div className="h-[40px] bg-[#FF6B6B]"></div>
      
      {/* Header */}
      <div className="px-[30px] py-[20px] flex justify-between items-center">
        <BackButton />
        
        {/* Step Indicator */}
        <div className="flex gap-[8px]">
          <div className="w-[8px] h-[8px] rounded-full bg-[#2ED573]"></div>
          <div className="w-[8px] h-[8px] rounded-full bg-[#2ED573]"></div>
          <div className="w-[8px] h-[8px] rounded-full bg-[#FF6B6B]"></div>
        </div>
        
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="text-[14px] font-bold text-[#FF6B6B]"
        >
          דלג
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 px-[30px]">
        {/* Page Title */}
        <h1 className="text-[24px] font-bold text-[#2A363B] mt-[20px]">
          תחומי עניין בבישול
        </h1>
        
        <p className="text-[16px] text-[#757575] mt-[10px]">
          בחר את תחומי העניין שלך כדי שנוכל להתאים לך את התוכן המתאים ביותר
        </p>
        
        {/* Interests Categories */}
        <div className="mt-[30px] flex-1 overflow-y-auto">
          {interestCategories.map(category => (
            <div key={category.id} className="mb-[25px]">
              <h2 className="text-[18px] font-bold text-[#2A363B] mb-[15px]">
                {category.title}
              </h2>
              
              <div className="flex flex-wrap gap-[10px]">
                {category.items.map(interest => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`
                      px-[20px] py-[10px] rounded-full text-[14px] font-medium 
                      ${isInterestSelected(interest.id) 
                        ? 'bg-[#FF6B6B] text-white' 
                        : 'bg-[#F8F8F8] text-[#757575] border border-[#E0E0E0]'}
                      transition-colors
                    `}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Selected Count */}
        <div className="mt-[10px] mb-[15px] text-center">
          <p className="text-[14px] text-[#757575]">
            נבחרו {selectedInterests.length} נושאים
          </p>
        </div>
        
        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedInterests.length === 0}
          className="mb-[20px]"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              שומר...
            </div>
          ) : 'המשך'}
        </Button>
      </div>
    </div>
  );
}
