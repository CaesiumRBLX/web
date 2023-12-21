import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "$drizzle/schema"
import postgres from 'postgres';

// for query purposes
export const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });