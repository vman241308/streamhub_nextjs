import { BaseRepository } from './BaseRepository'
import { Channel } from '@/types/xtream'

export class ChannelRepository extends BaseRepository {
  static async getAll(serverId: number): Promise<Channel[]> {
    try {
      return await this.query<Channel[]>(
        `SELECT 
          stream_id, name, stream_type, stream_icon,
          epg_channel_id, category_id, tv_archive, tv_archive_duration,
          is_adult, custom_sid, direct_source
        FROM channels 
        WHERE server_id = ?
        ORDER BY name ASC`,
        [serverId]
      )
    } catch (error) {
      console.error('Failed to get all channels:', error)
      throw new Error('Database error while fetching channels')
    }
  }

  static async getByCategory(serverId: number, categoryId?: string): Promise<Channel[]> {
    try {
      const baseQuery = `
        SELECT 
          stream_id, name, stream_type, stream_icon,
          epg_channel_id, category_id, tv_archive, tv_archive_duration,
          is_adult, custom_sid, direct_source
        FROM channels 
        WHERE server_id = ?
      `

      const params: any[] = [serverId]
      let finalQuery = baseQuery

      if (categoryId) {
        finalQuery += ' AND category_id = ?'
        params.push(categoryId)
      }

      finalQuery += ' ORDER BY name ASC'

      return await this.query<Channel[]>(finalQuery, params)
    } catch (error) {
      console.error('Failed to get channels by category:', error)
      throw new Error('Database error while fetching channels by category')
    }
  }

  static async search(serverId: number, query: string): Promise<Channel[]> {
    try {
      const results = await this.query<any[]>(
        `SELECT 
          c.stream_id, c.name, c.stream_type, c.stream_icon,
          c.epg_channel_id, c.category_id, c.tv_archive, c.tv_archive_duration,
          c.is_adult, c.custom_sid, c.direct_source,
          cat.name as category_name,
          cat.badges as category_badges
        FROM channels c
        LEFT JOIN categories cat ON c.category_id = cat.category_id AND c.server_id = cat.server_id
        WHERE c.server_id = ? 
        AND c.name LIKE ?
        ORDER BY c.name ASC 
        LIMIT 20`,
        [serverId, `%${query}%`]
      )

      // MySQL automatically parses JSON columns, so we can return the results directly
      return results
    } catch (error) {
      console.error('Failed to search channels:', error)
      throw new Error('Database error while searching channels')
    }
  }

  static async saveBatch(channels: Channel[], serverId: number): Promise<void> {
    try {
      const BATCH_SIZE = 250
      for (let i = 0; i < channels.length; i += BATCH_SIZE) {
        const batch = channels.slice(i, i + BATCH_SIZE)
        const placeholders = batch.map(() => 
          '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?), ?, ?, ?)'
        ).join(',')
        
        const values = batch.flatMap(channel => [
          serverId,
          channel.stream_id,
          channel.num || null,
          channel.name.replace(/['"]/g, ''),
          channel.stream_type,
          channel.stream_icon || '',
          channel.epg_channel_id || '',
          channel.category_id,
          channel.tv_archive ? 1 : 0,
          channel.tv_archive_duration || 0,
          channel.added,
          channel.is_adult ? 1 : 0,
          channel.custom_sid || null,
          channel.direct_source || ''
        ])

        await this.query(
          `INSERT INTO channels (
            server_id, stream_id, num, name, stream_type, stream_icon,
            epg_channel_id, category_id, tv_archive, tv_archive_duration,
            added, is_adult, custom_sid, direct_source
          )
          VALUES ${placeholders}
          ON DUPLICATE KEY UPDATE
            num = VALUES(num),
            name = VALUES(name),
            stream_type = VALUES(stream_type),
            stream_icon = VALUES(stream_icon),
            epg_channel_id = VALUES(epg_channel_id),
            category_id = VALUES(category_id),
            tv_archive = VALUES(tv_archive),
            tv_archive_duration = VALUES(tv_archive_duration),
            added = VALUES(added),
            is_adult = VALUES(is_adult),
            custom_sid = VALUES(custom_sid),
            direct_source = VALUES(direct_source)`,
          values
        )
      }
    } catch (error) {
      console.error('Failed to save channels batch:', error)
      throw new Error('Database error while saving channels batch')
    }
  }
}