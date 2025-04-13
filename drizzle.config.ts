import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './cooksy.db' // או השם שבחרת למסד הנתונים
  }
} satisfies Config;