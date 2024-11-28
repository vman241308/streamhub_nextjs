import { CategoryRepository } from '@/lib/repositories/CategoryRepository'
import { CredentialsRepository } from '@/lib/repositories/CredentialsRepository'
import { ServerRepository } from '@/lib/repositories/ServerRepository'
import { XtreamCategoryService } from '@/lib/services/api/xtream/XtreamCategoryService'
import { AuthService } from '@/lib/services/server/AuthService'
import type { Category } from '@/types/xtream'

export class CategoryService {
  static async getCategories(serverId?: number): Promise<Category[]> {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const targetServerId = serverId || user.serverId

    try {
      // First try to get from database
      const categories = await CategoryRepository.getAll(targetServerId)
      
      if (categories && categories.length > 0) {
        return categories
      }

      // If no categories in database, fetch from API
      const [credentials, server] = await Promise.all([
        CredentialsRepository.getCredentials(targetServerId, user.username),
        ServerRepository.getById(targetServerId)
      ])
      
      if (!credentials || !server) {
        throw new Error('Server or credentials not found')
      }

      if (!credentials.username || !credentials.password) {
        throw new Error('Invalid credentials')
      }

      const apiCategories = await XtreamCategoryService.getCategories(
        server.url,
        credentials.username,
        credentials.password
      )

      // Save to database for future use
      await CategoryRepository.saveBatch(apiCategories, targetServerId)

      return apiCategories
    } catch (error) {
      console.error('Failed to get categories:', error)
      throw error instanceof Error 
        ? error 
        : new Error('Failed to fetch categories')
    }
  }
}