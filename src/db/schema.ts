// src/db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// סכמת משתמשים
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email'),
  phone: text('phone'),
  profileImage: text('profile_image'),
  bio: text('bio'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  language: text('language', { enum: ['he', 'en'] }).default('he'),
});

// סכמת תחומי עניין של משתמשים
export const userInterests = sqliteTable('user_interests', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  interest: text('interest').notNull(),
});

// סכמת מתכונים
export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  authorId: text('author_id').notNull().references(() => users.id),
  prepTime: integer('prep_time').default(0),
  cookTime: integer('cook_time').default(0),
  servings: integer('servings').default(1),
  difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }).default('medium'),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// סכמת קטגוריות מתכונים
export const recipeCategories = sqliteTable('recipe_categories', {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
});

// סכמת מרכיבים למתכונים
export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  amount: text('amount'),
  unit: text('unit'),
});

// סכמת שלבי הכנה למתכונים
export const recipeSteps = sqliteTable('recipe_steps', {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
});

// סכמת מתכונים שמורים
export const savedRecipes = sqliteTable('saved_recipes', {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull(),
});

// סכמת קודי אימות
export const verificationCodes = sqliteTable('verification_codes', {
  id: text('id').primaryKey(),
  phone: text('phone'),
  email: text('email'),
  code: text('code').notNull(),
  expiresAt: text('expires_at').notNull(),
  used: integer('used', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

// הגדרת קשרים
export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  savedRecipes: many(savedRecipes),
  interests: many(userInterests),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  author: one(users, {
    fields: [recipes.authorId],
    references: [users.id],
  }),
  categories: many(recipeCategories),
  ingredients: many(recipeIngredients),
  steps: many(recipeSteps),
  savedBy: many(savedRecipes),
}));