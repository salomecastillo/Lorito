import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.js', //schema path 
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
