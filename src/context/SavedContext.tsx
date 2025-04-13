'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Recipe, useRecipes } from './RecipesContext';
import { useUser } from './UserContext';

// Define saved context type
interface SavedContextType {
  savedRecipes: string[];
  isSaved: (recipeId: string) => boolean;
  saveRecipe: (recipeId: string) => Promise<void>;
  unsaveRecipe: (recipeId: string) => Promise<void>;
  getSavedRecipes: () => Recipe[];
}

// Create context with default values
const SavedContext = createContext<SavedContextType>({
  savedRecipes: [],
  isSaved: () => false,
  saveRecipe: async () => {},
  unsaveRecipe: async () => {},
  getSavedRecipes: () => [],
});

// Custom hook to use the saved context
export const useSaved = () => useContext(SavedContext);

// Provider component
interface SavedProviderProps {
  children: ReactNode;
}

export const SavedProvider = ({ children }: SavedProviderProps) => {
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const { user } = useUser();
  const { recipes } = useRecipes();

  // Load saved recipes on mount or user change
  useEffect(() => {
    const loadSavedRecipes = () => {
      try {
        if (user) {
          // In a real app, this would be user-specific
          const saved = localStorage.getItem(`cooksy_saved_${user.id}`);
          if (saved) {
            setSavedRecipes(JSON.parse(saved));
          }
        } else {
          // Clear saved recipes when no user is logged in
          setSavedRecipes([]);
        }
      } catch (error) {
        console.error('Error loading saved recipes:', error);
        setSavedRecipes([]);
      }
    };
    
    loadSavedRecipes();
  }, [user]);

  // Check if a recipe is saved
  const isSaved = (recipeId: string) => {
    return savedRecipes.includes(recipeId);
  };

  // Save a recipe
  const saveRecipe = async (recipeId: string) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to save recipes');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add to saved recipes if not already saved
      if (!isSaved(recipeId)) {
        const updated = [...savedRecipes, recipeId];
        setSavedRecipes(updated);
        
        // Save to localStorage
        localStorage.setItem(`cooksy_saved_${user.id}`, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  };

  // Unsave a recipe
  const unsaveRecipe = async (recipeId: string) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to unsave recipes');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from saved recipes
      const updated = savedRecipes.filter(id => id !== recipeId);
      setSavedRecipes(updated);
      
      // Save to localStorage
      localStorage.setItem(`cooksy_saved_${user.id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error unsaving recipe:', error);
      throw error;
    }
  };

  // Get full recipes for saved recipe IDs
  const getSavedRecipes = () => {
    return recipes.filter(recipe => savedRecipes.includes(recipe.id));
  };

  // Context value
  const value = {
    savedRecipes,
    isSaved,
    saveRecipe,
    unsaveRecipe,
    getSavedRecipes,
  };

  return (
    <SavedContext.Provider value={value}>
      {children}
    </SavedContext.Provider>
  );
};
