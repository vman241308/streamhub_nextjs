"use client"

import type { Category } from '@/types/xtream'

export class CategoryService {
  private static cache = new Map<number, Category[]>()

  static async getCategories(serverId: number): Promise<Category[]> {
    // Check cache first
    const cached = this.cache.get(serverId)
    if (cached) {
      return cached
    }

    const response = await fetch(`/api/categories?serverId=${serverId}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch categories')
    }

    const categories = await response.json()
    // Cache the result
    this.cache.set(serverId, categories)
    return categories
  }

  static clearCache(serverId?: number) {
    if (serverId) {
      this.cache.delete(serverId)
    } else {
      this.cache.clear()
    }
  }
}