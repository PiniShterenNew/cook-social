// src/db/migrate.ts
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createDb } from './index';
import { resolve } from 'path';
import fs from 'fs';

// פונקציה לביצוע מיגרציות
async function main() {
  // ודא שתיקיית המיגרציות קיימת
  const migrationsFolder = resolve(process.cwd(), 'src/db/migrations');
  if (!fs.existsSync(migrationsFolder)) {
    fs.mkdirSync(migrationsFolder, { recursive: true });
  }
  
  try {
    const db = createDb();
    
    console.log('Running migrations...');
    migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

main();