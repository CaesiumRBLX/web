import "dotenv/config"
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, queryClient } from '../src/lib/server/db';

console.log("Migrating DB..")

await migrate(db, { migrationsFolder: "./drizzle/migrations" })

console.log("Migrated! Closing...")

queryClient.end()
	.then(() => {
		console.log("Done")
		process.exit(0)
	})