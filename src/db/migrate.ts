// src/db/migrate.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { resolve } from 'path';
import fs from 'fs';

// ודא שתיקיית המיגרציות קיימת
const migrationsFolder = resolve(process.cwd(), 'src/db/migrations');
if (!fs.existsSync(migrationsFolder)) {
  console.log(`יוצר תיקיית מיגרציות: ${migrationsFolder}`);
  fs.mkdirSync(migrationsFolder, { recursive: true });
}

// ודא שתיקיית המטא קיימת
const metaFolder = resolve(migrationsFolder, 'meta');
if (!fs.existsSync(metaFolder)) {
  console.log(`יוצר תיקיית מטא: ${metaFolder}`);
  fs.mkdirSync(metaFolder, { recursive: true });
}

// בדוק אם קובץ ה-journal קיים, אם לא - צור אותו ריק
const journalPath = resolve(metaFolder, '_journal.json');
if (!fs.existsSync(journalPath)) {
  console.log(`יוצר קובץ journal: ${journalPath}`);
  fs.writeFileSync(journalPath, JSON.stringify({ entries: [] }));
}

async function main() {
  try {
    console.log('Running migrations...');
    
    // התחבר למסד הנתונים
    const sqlite = new Database('./cooksy.db'); // או השם שבחרת למסד הנתונים
    const db = drizzle(sqlite);
    
    // הרץ את המיגרציות
    await migrate(db, { migrationsFolder });
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

main();