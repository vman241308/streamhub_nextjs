import { DatabaseManager } from '@/lib/database/DatabaseManager'

export abstract class BaseRepository {
  protected static db = DatabaseManager.getInstance()

  protected static async query<T>(sql: string, params?: any[]): Promise<T> {
    return await this.db.query<T>(sql, params)
  }
}