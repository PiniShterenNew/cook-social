'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

  // Login function - use API route instead of direct DB access
  const login = async (phone: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send verification code');
      }

      // In a real app, this would trigger sending an SMS
      // For demo purposes, the code is logged on the server
      return "1234"; // Demo code for testing
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code function - use API route
  const verifyCode = async (code: string, phone?: string, email?: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, phone, email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify code');
      }

      const data = await response.json();
      
      if (data.user) {
        // User exists, log them in
        setUser(data.user);
        return false; // Not a new user
      }

      // New user, return true to indicate registration needed
      return true;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - use API route
  const register = async (userData: Partial<User>) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register user');
      }

      const data = await response.json();
      setUser(data.user);
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
