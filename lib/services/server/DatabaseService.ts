import { DatabaseManager } from '@/lib/database/DatabaseManager'
import { runMigrations } from '@/lib/database/migrations'

export class DatabaseService {
  static async initialize(): Promise<void> {
    const db = DatabaseManager.getInstance()
    await db.initializeTables()
    await runMigrations()
  }

  static async query<T>(sql: string, params?: any[]): Promise<T> {
    const db = DatabaseManager.getInstance()
    return await db.query<T>(sql, params)
  }

  static async getConnection() {
    const db = DatabaseManager.getInstance()
    return await db.getConnection()
  }

  static async end(): Promise<void> {
    const db = DatabaseManager.getInstance()
    await db.end()
  }
}