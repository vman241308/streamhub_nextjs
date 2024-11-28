import { BaseRepository } from './BaseRepository'
import { Category, BaseCategory } from '@/types/xtream'
import { StoredCategory, CategoryBadge } from '@/types/database'
import { extractBadges } from '@/lib/utils/badge-extractor'

export class CategoryRepository extends BaseRepository {
  static async getAll(serverId: number): Promise<Category[]> {
    try {
      const categories = await this.query<StoredCategory[]>(
        `SELECT 
          category_id,
          name,
          parent_id,
          badges
        FROM categories 
        WHERE server_id = ?
        ORDER BY name ASC`,
        [serverId]
      )

      return categories.map(cat => ({
        category_id: cat.category_id,
        category_name: cat.name, // Map 'name' to 'category_name'
        parent_id: cat.parent_id,
        badges: cat.badges // MySQL JSON type is automatically parsed
      }))
    } catch (error) {
      console.error('Failed to get categories:', error)
      throw new Error('Database error while fetching categories')
    }
  }

  static async saveBatch(categories: BaseCategory[], serverId: number): Promise<void> {
    try {
      const BATCH_SIZE = 250
      for (let i = 0; i < categories.length; i += BATCH_SIZE) {
        const batch = categories.slice(i, i + BATCH_SIZE)
        const placeholders = batch.map(() => '(?, ?, ?, ?, ?)').join(',')
        
        const values = batch.flatMap(category => {
          const { cleanName, badges } = extractBadges(category.category_name)
          
          return [
            category.category_id,
            cleanName,
            category.parent_id || null,
            badges.length > 0 ? JSON.stringify(badges) : null,
            serverId
          ]
        })

        await this.query(
          `INSERT INTO categories (category_id, name, parent_id, badges, server_id)
           VALUES ${placeholders}
           ON DUPLICATE KEY UPDATE 
           name = VALUES(name),
           parent_id = VALUES(parent_id),
           badges = VALUES(badges)`,
          values
        )
      }
    } catch (error) {
      console.error('Failed to save categories:', error)
      throw new Error('Database error while saving categories')
    }
  }
}