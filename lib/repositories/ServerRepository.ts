import { BaseRepository } from './BaseRepository'
import { ServerInfo } from '@/types/database'

export class ServerRepository extends BaseRepository {
  static async getById(id: number): Promise<ServerInfo | null> {
    try {
      const [result] = await this.query<[ServerInfo | null]>(
        `SELECT 
          s.id,
          s.url,
          (SELECT COUNT(*) FROM categories WHERE server_id = s.id) as categoryCount,
          (SELECT COUNT(*) FROM channels WHERE server_id = s.id) as channelCount,
          s.last_sync as lastSync
        FROM servers s
        WHERE s.id = ?`,
        [id]
      )
      return result
    } catch (error) {
      console.error('Failed to get server by ID:', error)
      throw new Error('Database error while fetching server')
    }
  }

  static async getByUrl(url: string): Promise<ServerInfo | null> {
    try {
      const [result] = await this.query<[ServerInfo | null]>(
        `SELECT 
          s.id,
          s.url,
          (SELECT COUNT(*) FROM categories WHERE server_id = s.id) as categoryCount,
          (SELECT COUNT(*) FROM channels WHERE server_id = s.id) as channelCount,
          s.last_sync as lastSync
        FROM servers s
        WHERE s.url = ?`,
        [url]
      )
      return result
    } catch (error) {
      console.error('Failed to get server by URL:', error)
      throw new Error('Database error while fetching server')
    }
  }

  static async createOrUpdate(url: string): Promise<number> {
    try {
      await this.query(
        `INSERT INTO servers (url) 
         VALUES (?) 
         ON DUPLICATE KEY UPDATE 
         last_sync = CURRENT_TIMESTAMP`,
        [url]
      )

      const [server] = await this.query<[{ id: number }]>(
        'SELECT id FROM servers WHERE url = ?',
        [url]
      )

      if (!server) {
        throw new Error('Failed to create/update server')
      }

      return server.id
    } catch (error) {
      console.error('Failed to create/update server:', error)
      throw new Error('Database error while creating/updating server')
    }
  }

  static async updateSyncTimestamp(serverId: number): Promise<void> {
    try {
      await this.query(
        'UPDATE servers SET last_sync = CURRENT_TIMESTAMP WHERE id = ?',
        [serverId]
      )
    } catch (error) {
      console.error('Failed to update sync timestamp:', error)
      throw new Error('Database error while updating sync timestamp')
    }
  }
}