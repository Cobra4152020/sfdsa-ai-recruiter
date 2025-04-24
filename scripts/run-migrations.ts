import fs from "fs"
import path from "path"
import { getServiceSupabase } from "../lib/supabase-client"

async function runMigrations() {
  try {
    console.log("Starting database migrations...")

    // Get the Supabase client with service role
    const supabase = getServiceSupabase()

    // Create migrations table if it doesn't exist
    const { error: tableError } = await supabase.rpc("create_migrations_table_if_not_exists")

    if (tableError) {
      // If the RPC doesn't exist, create the table directly
      const { error: createTableError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      if (createTableError) {
        throw new Error(`Failed to create migrations table: ${createTableError.message}`)
      }
    }

    // Get list of applied migrations
    const { data: appliedMigrations, error: migrationError } = await supabase.from("migrations").select("name")

    if (migrationError) {
      throw new Error(`Failed to get applied migrations: ${migrationError.message}`)
    }

    const appliedMigrationNames = new Set(appliedMigrations?.map((m) => m.name) || [])

    // Get list of migration files
    const migrationsDir = path.join(process.cwd(), "supabase", "migrations")
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort() // Sort to ensure migrations run in order

    // Run each migration that hasn't been applied yet
    for (const file of migrationFiles) {
      if (!appliedMigrationNames.has(file)) {
        console.log(`Applying migration: ${file}`)

        // Read migration file
        const migration = fs.readFileSync(path.join(migrationsDir, file), "utf8")

        // Run migration in a transaction
        const { error } = await supabase.query(`
          BEGIN;
          ${migration}
          COMMIT;
        `)

        if (error) {
          // Rollback on error
          await supabase.query("ROLLBACK;")
          throw new Error(`Failed to apply migration ${file}: ${error.message}`)
        }

        // Record successful migration
        const { error: recordError } = await supabase.from("migrations").insert({ name: file })

        if (recordError) {
          throw new Error(`Failed to record migration ${file}: ${recordError.message}`)
        }

        console.log(`Successfully applied migration: ${file}`)
      } else {
        console.log(`Skipping already applied migration: ${file}`)
      }
    }

    console.log("All migrations completed successfully")
  } catch (error) {
    console.error("Migration error:", error)
    process.exit(1)
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
}

export default runMigrations
