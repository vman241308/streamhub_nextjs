"use client"

import type { Channel } from '@/types/xtream'

export class ChannelService {
  private static cache = new Map<string, Channel[]>()

  static async getChannels(serverId: number): Promise<Channel[]> {
    const cacheKey = `server_${serverId}`
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    const response = await fetch(`/api/channels?serverId=${serverId}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch channels')
    }

    const channels = await response.json()
    this.cache.set(cacheKey, channels)
    return channels
  }

  static async getChannelsByCategory(serverId: number, categoryId: string): Promise<Channel[]> {
    const cacheKey = `server_${serverId}_category_${categoryId}`
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    const response = await fetch(`/api/channels?serverId=${serverId}&categoryId=${categoryId}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch channels')
    }

    const channels = await response.json()
    this.cache.set(cacheKey, channels)
    return channels
  }

  static async searchChannels(serverId: number, query: string): Promise<Channel[]> {
    const response = await fetch(`/api/channels/search?serverId=${serverId}&query=${encodeURIComponent(query)}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to search channels')
    }
    return response.json()
  }

  static clearCache(serverId?: number) {
    if (serverId) {
      // Clear all cache entries for this server
      Array.from(this.cache.keys())
        .filter(key => key.startsWith(`server_${serverId}`))
        .forEach(key => this.cache.delete(key))
    } else {
      this.cache.clear()
    }
  }
}