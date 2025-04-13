/**
 * Local Database Service
 * 
 * שירות מסד נתונים מקומי המשתמש ב-localStorage כדי לאחסן נתונים
 * Simple database service using localStorage for persistent storage
 */

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  interests?: string[];
  createdAt: string;
  updatedAt: string;
  language: 'he' | 'en'; // User's preferred language
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
  ingredients: {
    id: string;
    name: string;
    amount: string;
    unit: string;
  }[];
  steps: {
    id: string;
    order: number;
    description: string;
    imageUrl?: string;
  }[];
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  translations?: {
    en?: {
      title: string;
      description: string;
      ingredients: {
        id: string;
        name: string;
        amount: string;
        unit: string;
      }[];
      steps: {
        id: string;
        order: number;
        description: string;
      }[];
    }
  };
}

// Sample initial data
const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'שף ישראלי',
    username: 'israeli_chef',
    email: 'chef@cooksy.co.il',
    phone: '+972501234567',
    profileImage: 'https://placehold.co/100/orange/white?text=CHEF',
    bio: 'שף מקצועי עם ניסיון של 15 שנה במטבח הישראלי והים תיכוני',
    interests: ['ישראלי', 'ים תיכוני', 'אפייה'],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    language: 'he'
  },
  {
    id: 'user-2',
    name: 'מיכל האופה',
    username: 'michal_baker',
    email: 'michal@cooksy.co.il',
    phone: '+972502345678',
    profileImage: 'https://placehold.co/100/pink/white?text=MICHAL',
    bio: 'אופה ביתית, מומחית לעוגות וקינוחים',
    interests: ['אפייה', 'קינוחים', 'עוגות'],
    createdAt: '2024-01-02T11:00:00Z',
    updatedAt: '2024-01-02T11:00:00Z',
    language: 'he'
  }
];

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
    translations: {
      en: {
        title: 'Perfect Homemade Hummus',
        description: 'Creamy and delicious homemade hummus. Perfect for an authentic Israeli breakfast.',
        ingredients: [
          { id: 'ing-1', name: 'Cooked chickpeas', amount: '400', unit: 'g' },
          { id: 'ing-2', name: 'Raw tahini', amount: '60', unit: 'g' },
          { id: 'ing-3', name: 'Lemon juice', amount: '2', unit: 'tbsp' },
          { id: 'ing-4', name: 'Olive oil', amount: '2', unit: 'tbsp' },
          { id: 'ing-5', name: 'Garlic clove', amount: '1', unit: 'unit' },
          { id: 'ing-6', name: 'Salt', amount: '1/2', unit: 'tsp' },
          { id: 'ing-7', name: 'Cumin', amount: '1/2', unit: 'tsp' },
        ],
        steps: [
          { id: 'step-1', order: 1, description: 'Thoroughly rinse the chickpeas in cold water.' },
          { id: 'step-2', order: 2, description: 'Place all ingredients in a food processor and blend until smooth and creamy.' },
          { id: 'step-3', order: 3, description: 'Taste and adjust seasoning as needed.' },
          { id: 'step-4', order: 4, description: 'Transfer to a serving plate, create a well in the center, drizzle with olive oil and sprinkle with paprika and parsley.' },
        ]
      }
    }
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
    translations: {
      en: {
        title: 'Classic Shakshuka',
        description: 'Rich and flavorful shakshuka just like grandma used to make. Simple to prepare and perfect for any time of day.',
        ingredients: [
          { id: 'ing-1', name: 'Ripe tomatoes', amount: '6', unit: 'units' },
          { id: 'ing-2', name: 'Red bell pepper', amount: '1', unit: 'unit' },
          { id: 'ing-3', name: 'Garlic cloves', amount: '2', unit: 'units' },
          { id: 'ing-4', name: 'Sweet paprika', amount: '1', unit: 'tsp' },
          { id: 'ing-5', name: 'Cumin', amount: '1/2', unit: 'tsp' },
          { id: 'ing-6', name: 'Eggs', amount: '4', unit: 'units' },
          { id: 'ing-7', name: 'Salt and pepper', amount: '', unit: 'to taste' },
        ],
        steps: [
          { id: 'step-1', order: 1, description: 'Dice the tomatoes and bell pepper into small cubes, and crush the garlic.' },
          { id: 'step-2', order: 2, description: 'Heat olive oil in a pan, sauté the garlic and bell pepper for about a minute.' },
          { id: 'step-3', order: 3, description: 'Add the tomatoes and spices, simmer on low heat for about 10 minutes.' },
          { id: 'step-4', order: 4, description: 'Create wells in the sauce and crack an egg into each well, cook for about 5 minutes until the eggs are done.' },
        ]
      }
    }
  }
];

// Database service class
export class LocalDB {
  private static instance: LocalDB;

  // Singleton pattern
  public static getInstance(): LocalDB {
    if (!LocalDB.instance) {
      LocalDB.instance = new LocalDB();
    }
    return LocalDB.instance;
  }

  // Initialize database with sample data if empty
  constructor() {
    this.initializeDB();
  }

  // Set up initial data if database is empty
  private initializeDB() {
    if (!localStorage.getItem('cooksy_users')) {
      localStorage.setItem('cooksy_users', JSON.stringify(initialUsers));
    }
    
    if (!localStorage.getItem('cooksy_recipes')) {
      localStorage.setItem('cooksy_recipes', JSON.stringify(initialRecipes));
    }
  }

  // User methods
  async getUsers(): Promise<User[]> {
    const users = localStorage.getItem('cooksy_users');
    return users ? JSON.parse(users) : [];
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.phone === phone) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = await this.getUsers();
    
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('cooksy_users', JSON.stringify(users));
    
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const users = await this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    const updatedUser: User = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    
    users[userIndex] = updatedUser;
    localStorage.setItem('cooksy_users', JSON.stringify(users));
    
    return updatedUser;
  }

  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    const recipes = localStorage.getItem('cooksy_recipes');
    return recipes ? JSON.parse(recipes) : [];
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    const recipes = await this.getRecipes();
    return recipes.find(recipe => recipe.id === id) || null;
  }

  async getRecipesByAuthor(authorId: string): Promise<Recipe[]> {
    const recipes = await this.getRecipes();
    return recipes.filter(recipe => recipe.authorId === authorId);
  }

  async createRecipe(recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const recipes = await this.getRecipes();
    
    const newRecipe: Recipe = {
      ...recipeData,
      id: `recipe-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    recipes.push(newRecipe);
    localStorage.setItem('cooksy_recipes', JSON.stringify(recipes));
    
    return newRecipe;
  }

  async updateRecipe(id: string, recipeData: Partial<Recipe>): Promise<Recipe | null> {
    const recipes = await this.getRecipes();
    const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
    
    if (recipeIndex === -1) {
      return null;
    }
    
    const updatedRecipe: Recipe = {
      ...recipes[recipeIndex],
      ...recipeData,
      updatedAt: new Date().toISOString(),
    };
    
    recipes[recipeIndex] = updatedRecipe;
    localStorage.setItem('cooksy_recipes', JSON.stringify(recipes));
    
    return updatedRecipe;
  }

  async deleteRecipe(id: string): Promise<boolean> {
    const recipes = await this.getRecipes();
    const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
    
    if (filteredRecipes.length === recipes.length) {
      return false; // Recipe not found
    }
    
    localStorage.setItem('cooksy_recipes', JSON.stringify(filteredRecipes));
    return true;
  }

  // Saved recipes methods
  async getSavedRecipes(userId: string): Promise<string[]> {
    const savedRecipes = localStorage.getItem(`cooksy_saved_${userId}`);
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  }

  async saveRecipe(userId: string, recipeId: string): Promise<string[]> {
    const savedRecipes = await this.getSavedRecipes(userId);
    
    if (!savedRecipes.includes(recipeId)) {
      savedRecipes.push(recipeId);
      localStorage.setItem(`cooksy_saved_${userId}`, JSON.stringify(savedRecipes));
    }
    
    return savedRecipes;
  }

  async unsaveRecipe(userId: string, recipeId: string): Promise<string[]> {
    const savedRecipes = await this.getSavedRecipes(userId);
    const updatedSavedRecipes = savedRecipes.filter(id => id !== recipeId);
    
    localStorage.setItem(`cooksy_saved_${userId}`, JSON.stringify(updatedSavedRecipes));
    
    return updatedSavedRecipes;
  }

  // Clear database (for testing/development)
  async clearDB() {
    localStorage.removeItem('cooksy_users');
    localStorage.removeItem('cooksy_recipes');
    
    // Clear all saved recipes entries
    const users = await this.getUsers();
    users.forEach(user => {
      localStorage.removeItem(`cooksy_saved_${user.id}`);
    });
    
    // Reinitialize with default data
    this.initializeDB();
  }
}

// Export default instance
export const db = LocalDB.getInstance();
