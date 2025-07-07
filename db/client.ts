import { drizzle } from "drizzle-orm/singlestore";
import pg from "pg";
import * as schema from './schema.ts';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });