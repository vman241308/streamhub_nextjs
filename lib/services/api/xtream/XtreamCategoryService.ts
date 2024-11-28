import { XtreamBaseService } from './XtreamBaseService'
import type { Category } from '@/types/xtream'

interface XtreamCategoryResponse {
  category_id: string
  category_name: string
  parent_id: number
}

export class XtreamCategoryService extends XtreamBaseService {
  static async getCategories(url: string, username: string, password: string): Promise<Category[]> {
    if (!url || !username || !password) {
      throw new Error('Missing required credentials')
    }

    try {
      const baseUrl = this.normalizeUrl(url)
      const apiUrl = new URL(this.buildApiUrl(baseUrl, username, password))
      apiUrl.searchParams.set('action', 'get_live_categories')

      const response = await this.proxyRequest<XtreamCategoryResponse[]>(apiUrl.toString())
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format')
      }

      return response.map(cat => ({
        category_id: cat.category_id,
        category_name: cat.category_name,
        parent_id: cat.parent_id || null
      }))
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error instanceof Error 
        ? error 
        : new Error('Failed to fetch categories from Xtream service')
    }
  }
}