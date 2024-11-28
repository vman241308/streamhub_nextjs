import fs from 'fs'
import path from 'path'
import { DatabaseManager } from '../DatabaseManager'

export async function runMigrations() {
  const db = DatabaseManager.getInstance()
  const migrationsDir = path.join(__dirname)
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    await db.query(sql)
  }
}
