'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, users, verificationCodes } from '@/db';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Define user type
interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  interests?: string[];
  createdAt: string;
}

// Define user context type
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => { },
  verifyCode: async () => false,
  register: async () => { },
  updateProfile: async () => { },
  logout: () => { },
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for saved user data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem('cooksy_user');

        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function - simulate API call
  const login = async (phone: string) => {
    setIsLoading(true);

    try {
      // יצירת קוד אימות חד-פעמי
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

      // חישוב זמן תפוגה (10 דקות מעכשיו)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      // שמירת הקוד במסד הנתונים
      await db.insert(verificationCodes).values({
        id: uuidv4(),
        phone: phone,
        code: verificationCode,
        expiresAt: expiresAt.toISOString(),
        used: false,
        createdAt: new Date().toISOString(),
      });

      // בפרויקט אמיתי, כאן היית שולח SMS, אבל לצורך הדגמה אנחנו נשתמש בקוד "1234" ב-console
      console.log('Verification code (for demo only):', verificationCode);

      return verificationCode;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code function
  const verifyCode = async (code: string, phone?: string, email?: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // חיפוש קוד האימות במסד הנתונים
      const codeQuery = phone
        ? eq(verificationCodes.phone, phone)
        : eq(verificationCodes.email, email || '');

      const validCode = await db.query.verificationCodes.findFirst({
        where: and(
          codeQuery,
          eq(verificationCodes.code, code),
          eq(verificationCodes.used, false),
        ),
      });

      // בדיקה אם הקוד תקף
      if (!validCode) {
        throw new Error('Invalid or expired verification code');
      }

      // בדיקה אם הקוד פג תוקף
      const now = new Date();
      const expiresAt = new Date(validCode.expiresAt);
      if (now > expiresAt) {
        throw new Error('Verification code has expired');
      }

      // סימון הקוד כשימוש
      await db
        .update(verificationCodes)
        .set({ used: true })
        .where(eq(verificationCodes.id, validCode.id));

      // בדיקה אם המשתמש קיים
      const existingUser = phone
        ? await db.query.users.findFirst({
          where: eq(users.phone, phone),
        })
        : await db.query.users.findFirst({
          where: eq(users.email, email || ''),
        });

      if (existingUser) {
        // משתמש קיים, מחזירים אותו
        setUser(existingUser);
        return false;
      }

      // משתמש חדש, מחזירים שצריך להשלים רישום
      return true;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: Partial<User>) => {
    setIsLoading(true);

    try {
      // קבלת הטלפון מהאחסון הזמני
      const phone = userData.phone || '';

      // יצירת ID חדש
      const userId = uuidv4();

      // יצירת המשתמש במסד הנתונים
      const now = new Date().toISOString();
      await db.insert(users).values({
        id: userId,
        name: userData.name || 'משתמש חדש',
        username: userData.username || `user${Date.now()}`,
        phone,
        email: userData.email || null,
        profileImage: userData.profileImage || null,
        bio: userData.bio || null,
        createdAt: now,
        updatedAt: now,
      });

      // אם יש תחומי עניין, הוסף אותם
      if (userData.interests && userData.interests.length > 0) {
        const interestsToInsert = userData.interests.map(interest => ({
          id: uuidv4(),
          userId,
          interest,
        }));

        await db.insert(userInterests).values(interestsToInsert);
      }

      // קבל את המשתמש המלא
      const newUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
          interests: true,
        },
      });

      // עדכן את המצב
      setUser(newUser || null);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);

    try {
      // Ensure we have a user
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user data
      const updatedUser = {
        ...user,
        ...userData,
      };

      // Save to localStorage
      localStorage.setItem('cooksy_user', JSON.stringify(updatedUser));

      // Update state
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('cooksy_user');
    localStorage.removeItem('cooksy_temp_phone');

    // Clear user state
    setUser(null);
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    verifyCode,
    register,
    updateProfile,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
