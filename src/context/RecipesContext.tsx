'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define recipe types
interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface RecipeStep {
  id: string;
  order: number;
  description: string;
  imageUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  categories: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

// Define recipes context type
interface RecipesContextType {
  recipes: Recipe[];
  featuredRecipes: Recipe[];
  isLoading: boolean;
  getRecipeById: (id: string) => Recipe | undefined;
  getRecipesByAuthor: (authorId: string) => Recipe[];
  getRecipesByCategory: (category: string) => Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Recipe>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
  searchRecipes: (query: string) => Recipe[];
}

// Create context with default values
const RecipesContext = createContext<RecipesContextType>({
  recipes: [],
  featuredRecipes: [],
  isLoading: true,
  getRecipeById: () => undefined,
  getRecipesByAuthor: () => [],
  getRecipesByCategory: () => [],
  addRecipe: async () => ({ 
    id: '', title: '', description: '', imageUrl: '', authorId: '', authorName: '', 
    prepTime: 0, cookTime: 0, servings: 0, difficulty: 'easy', categories: [], 
    ingredients: [], steps: [], likes: 0, comments: 0, createdAt: '', updatedAt: '' 
  }),
  updateRecipe: async () => ({ 
    id: '', title: '', description: '', imageUrl: '', authorId: '', authorName: '', 
    prepTime: 0, cookTime: 0, servings: 0, difficulty: 'easy', categories: [], 
    ingredients: [], steps: [], likes: 0, comments: 0, createdAt: '', updatedAt: '' 
  }),
  deleteRecipe: async () => {},
  searchRecipes: () => [],
});

// Custom hook to use the recipes context
export const useRecipes = () => useContext(RecipesContext);

// Provider component
interface RecipesProviderProps {
  children: ReactNode;
}

// Mock data for initial recipes
const initialRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    title: 'חומוס ביתי מושלם',
    description: 'חומוס קרמי וטעים בהכנה ביתית פשוטה. מושלם לארוחת בוקר ישראלית אותנטית.',
    imageUrl: 'https://placehold.co/600x400/orange/white?text=HUMMUS',
    authorId: 'user-1',
    authorName: 'שף ישראלי',
    authorImage: 'https://placehold.co/100/orange/white?text=CHEF',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    categories: ['ישראלי', 'צמחוני', 'ללא גלוטן'],
    ingredients: [
      { id: 'ing-1', name: 'גרגירי חומוס מבושלים', amount: '400', unit: 'גרם' },
      { id: 'ing-2', name: 'טחינה גולמית', amount: '60', unit: 'גרם' },
      { id: 'ing-3', name: 'מיץ לימון', amount: '2', unit: 'כפות' },
      { id: 'ing-4', name: 'שמן זית', amount: '2', unit: 'כפות' },
      { id: 'ing-5', name: 'שן שום', amount: '1', unit: 'יחידה' },
      { id: 'ing-6', name: 'מלח', amount: '1/2', unit: 'כפית' },
      { id: 'ing-7', name: 'כמון', amount: '1/2', unit: 'כפית' },
    ],
    steps: [
      { id: 'step-1', order: 1, description: 'שטפו היטב את גרגירי החומוס במים קרים.' },
      { id: 'step-2', order: 2, description: 'הכניסו את כל המרכיבים למעבד מזון וטחנו עד לקבלת מרקם חלק וקרמי.' },
      { id: 'step-3', order: 3, description: 'טעמו ותקנו את התיבול לפי הטעם.' },
      { id: 'step-4', order: 4, description: 'העבירו לצלחת הגשה, צרו גומה במרכז, מזגו מעט שמן זית ופזרו פפריקה ופטרוזיליה.' },
    ],
    likes: 120,
    comments: 18,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'recipe-2',
    title: 'שקשוקה קלאסית',
    description: 'שקשוקה עשירה ומתובלת כמו שרק סבתא יודעת להכין. פשוטה להכנה ומושלמת לכל שעה ביום.',
    imageUrl: 'https://placehold.co/600x400/red/white?text=SHAKSHUKA',
    authorId: 'user-2',
    authorName: 'מיכל האופה',
    authorImage: 'https://placehold.co/100/pink/white?text=MICHAL',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'easy',
    categories: ['ישראלי', 'ארוחת בוקר', 'צמחוני'],
    ingredients: [
      { id: 'ing-1', name: 'עגבניות בשלות', amount: '6', unit: 'יחידות' },
      { id: 'ing-2', name: 'פלפל אדום', amount: '1', unit: 'יחידה' },
      { id: 'ing-3', name: 'שני שום', amount: '2', unit: 'יחידות' },
      { id: 'ing-4', name: 'פפריקה מתוקה', amount: '1', unit: 'כפית' },
      { id: 'ing-5', name: 'כמון', amount: '1/2', unit: 'כפית' },
      { id: 'ing-6', name: 'ביצים', amount: '4', unit: 'יחידות' },
      { id: 'ing-7', name: 'מלח ופלפל', amount: '', unit: 'לפי הטעם' },
    ],
    steps: [
      { id: 'step-1', order: 1, description: 'קצצו את העגבניות והפלפל לקוביות קטנות, וכתשו את השום.' },
      { id: 'step-2', order: 2, description: 'חממו שמן זית במחבת, טגנו את השום והפלפל כדקה.' },
      { id: 'step-3', order: 3, description: 'הוסיפו את העגבניות והתבלינים, בשלו על אש קטנה כ-10 דקות.' },
      { id: 'step-4', order: 4, description: 'צרו גומות ברוטב ושברו ביצה לכל גומה, בשלו כ-5 דקות עד שהביצים מוכנות.' },
    ],
    likes: 85,
    comments: 12,
    createdAt: '2024-02-20T08:15:00Z',
    updatedAt: '2024-02-20T08:15:00Z',
  },
];

export const RecipesProvider = ({ children }: RecipesProviderProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll load from localStorage or use initial data
        const savedRecipes = localStorage.getItem('cooksy_recipes');
        
        if (savedRecipes) {
          const parsedRecipes = JSON.parse(savedRecipes);
          setRecipes(parsedRecipes);
          
          // Set featured recipes (for example, most liked)
          setFeaturedRecipes(parsedRecipes.sort((a: Recipe, b: Recipe) => b.likes - a.likes).slice(0, 3));
        } else {
          // Use initial data if nothing in localStorage
          setRecipes(initialRecipes);
          setFeaturedRecipes(initialRecipes);
          
          // Save initial data to localStorage
          localStorage.setItem('cooksy_recipes', JSON.stringify(initialRecipes));
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
        // Fallback to initial data
        setRecipes(initialRecipes);
        setFeaturedRecipes(initialRecipes);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecipes();
  }, []);

  // Get recipe by ID
  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  // Get recipes by author
  const getRecipesByAuthor = (authorId: string) => {
    return recipes.filter(recipe => recipe.authorId === authorId);
  };

  // Get recipes by category
  const getRecipesByCategory = (category: string) => {
    return recipes.filter(recipe => recipe.categories.includes(category));
  };

  // Add new recipe
  const addRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new recipe with ID and timestamps
      const newRecipe: Recipe = {
        ...recipeData,
        id: `recipe-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Update state
      const updatedRecipes = [...recipes, newRecipe];
      setRecipes(updatedRecipes);
      
      // Update featured recipes if applicable
      updateFeaturedRecipes(updatedRecipes);
      
      // Save to localStorage
      localStorage.setItem('cooksy_recipes', JSON.stringify(updatedRecipes));
      
      return newRecipe;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing recipe
  const updateRecipe = async (id: string, updates: Partial<Recipe>): Promise<Recipe> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the recipe to update
      const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
      
      if (recipeIndex === -1) {
        throw new Error('Recipe not found');
      }
      
      // Update the recipe
      const updatedRecipe: Recipe = {
        ...recipes[recipeIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      // Update state
      const updatedRecipes = [...recipes];
      updatedRecipes[recipeIndex] = updatedRecipe;
      setRecipes(updatedRecipes);
      
      // Update featured recipes if applicable
      updateFeaturedRecipes(updatedRecipes);
      
      // Save to localStorage
      localStorage.setItem('cooksy_recipes', JSON.stringify(updatedRecipes));
      
      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete recipe
  const deleteRecipe = async (id: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the recipe
      const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
      setRecipes(updatedRecipes);
      
      // Update featured recipes if applicable
      updateFeaturedRecipes(updatedRecipes);
      
      // Save to localStorage
      localStorage.setItem('cooksy_recipes', JSON.stringify(updatedRecipes));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Search recipes
  const searchRecipes = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return recipes;
    }
    
    return recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(normalizedQuery) ||
      recipe.description.toLowerCase().includes(normalizedQuery) ||
      recipe.categories.some(category => category.toLowerCase().includes(normalizedQuery)) ||
      recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(normalizedQuery))
    );
  };

  // Helper to update featured recipes
  const updateFeaturedRecipes = (recipesList: Recipe[]) => {
    // For demo, featured recipes are the ones with most likes
    setFeaturedRecipes(recipesList.sort((a, b) => b.likes - a.likes).slice(0, 3));
  };

  // Context value
  const value = {
    recipes,
    featuredRecipes,
    isLoading,
    getRecipeById,
    getRecipesByAuthor,
    getRecipesByCategory,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
  };

  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  );
};
