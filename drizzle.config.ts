import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./drizzle/schema.ts",
	out: "./drizzle/migrations",
	driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!
	}
} satisfies Config;
