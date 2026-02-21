import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
const connectionString = process.env.DATABASE_URL || '';

// Prevent crashes during Vercel Preview builds where DATABASE_URL might be missing
let client;

if (typeof window === 'undefined' && connectionString) {
  client = postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: 'prefer',
  });
} else {
  // Dummy client for build-time static analysis or client-side imports
  client = postgres('postgresql://dummy:dummy@localhost:5432/dummy', { max: 1 });
}

export const db = drizzle(client, { schema });
