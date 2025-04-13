// src/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { resolve } from 'path';

// פונקציה ליצירת חיבור למסד הנתונים
export function createDb() {
  try {
    const sqlite = new Database(resolve(process.cwd(), 'cooksy.db'));
    return drizzle(sqlite, { schema });
  } catch (error) {
    console.error('Error creating database connection:', error);
    throw error;
  }
}

// מייצא מופע יחיד של מסד הנתונים
export const db = createDb();

// ייצוא של סכמות
export * from './schema';