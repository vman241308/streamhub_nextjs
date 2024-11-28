import { BaseRepository } from './BaseRepository'
import { StoredCredentials } from '@/types/database'

export class CredentialsRepository extends BaseRepository {
  static async save(
    username: string, 
    password: string, 
    serverId: number
  ): Promise<void> {
    try {
      await this.query(
        `INSERT INTO credentials (username, password, server_id) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         password = VALUES(password)`,
        [username, password, serverId]
      )
    } catch (error) {
      console.error('Failed to save credentials:', error)
      throw new Error('Database error while saving credentials')
    }
  }

  static async findCredentials(
    username: string, 
    password: string, 
    serverId: number
  ): Promise<StoredCredentials | null> {
    try {
      const [credentials] = await this.query<[StoredCredentials | null]>(
        `SELECT 
          id, server_id as serverId, username, password, 
          created_at, updated_at
        FROM credentials 
        WHERE username = ? 
        AND password = ? 
        AND server_id = ?`,
        [username, password, serverId]
      )
      return credentials
    } catch (error) {
      console.error('Failed to find credentials:', error)
      throw new Error('Database error while finding credentials')
    }
  }

  static async getCredentials(
    serverId: number, 
    username: string
  ): Promise<StoredCredentials | null> {
    try {
      const [credentials] = await this.query<[StoredCredentials | null]>(
        `SELECT 
          id, server_id as serverId, username, password, 
          created_at, updated_at
        FROM credentials 
        WHERE server_id = ? 
        AND username = ?`,
        [serverId, username]
      )
      return credentials
    } catch (error) {
      console.error('Failed to get credentials:', error)
      throw new Error('Database error while fetching credentials')
    }
  }

  static async clearSession(serverId: number, username: string): Promise<void> {
    try {
      await this.query(
        'UPDATE credentials SET updated_at = CURRENT_TIMESTAMP WHERE server_id = ? AND username = ?',
        [serverId, username]
      )
    } catch (error) {
      console.error('Failed to clear session:', error)
      throw new Error('Database error while clearing session')
    }
  }
}