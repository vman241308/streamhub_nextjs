import { DatabaseManager } from './DatabaseManager'

// Export a singleton instance
export const db = DatabaseManager.getInstance()

// Export the query helper
export const query = async <T>(sql: string, params?: any[]): Promise<T> => {
  return await db.query<T>(sql, params)
}

// Export initialization
export const initDatabase = async (): Promise<void> => {
  await db.initializeTables()
}
