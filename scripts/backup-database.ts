import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execAsync = promisify(exec)

async function backupDatabase() {
  try {
    console.log("Starting database backup...")

    // Get environment variables
    const dbUrl = process.env.POSTGRES_URL

    if (!dbUrl) {
      throw new Error("Missing database connection URL")
    }

    // Parse connection string to get credentials
    const url = new URL(dbUrl)
    const host = url.hostname
    const port = url.port || "5432"
    const database = url.pathname.substring(1)
    const username = url.username
    const password = url.password

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(process.cwd(), "backups")
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true })
    }

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFile = path.join(backupsDir, `backup-${timestamp}.sql`)

    // Set environment variables for pg_dump
    const env = {
      ...process.env,
      PGPASSWORD: password,
    }

    // Run pg_dump command
    const { stdout, stderr } = await execAsync(
      `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -f ${backupFile}`,
      { env },
    )

    if (stderr && !stderr.includes("warning")) {
      throw new Error(`pg_dump error: ${stderr}`)
    }

    console.log(`Database backup completed successfully: ${backupFile}`)

    // Clean up old backups (keep last 10)
    const backupFiles = fs
      .readdirSync(backupsDir)
      .filter((file) => file.startsWith("backup-") && file.endsWith(".sql"))
      .sort()
      .reverse()

    if (backupFiles.length > 10) {
      const filesToDelete = backupFiles.slice(10)
      for (const file of filesToDelete) {
        fs.unlinkSync(path.join(backupsDir, file))
        console.log(`Deleted old backup: ${file}`)
      }
    }

    return backupFile
  } catch (error) {
    console.error("Backup error:", error)
    throw error
  }
}

// Run backup if this file is executed directly
if (require.main === module) {
  backupDatabase()
    .then((backupFile) => {
      console.log(`Backup completed: ${backupFile}`)
      process.exit(0)
    })
    .catch((error) => {
      console.error("Backup failed:", error)
      process.exit(1)
    })
}

export default backupDatabase
