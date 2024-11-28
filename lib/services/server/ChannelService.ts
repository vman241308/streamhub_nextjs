import { ChannelRepository } from '@/lib/repositories/ChannelRepository'
import { CredentialsRepository } from '@/lib/repositories/CredentialsRepository'
import { ServerRepository } from '@/lib/repositories/ServerRepository'
import { XtreamChannelService } from '@/lib/services/api/xtream/XtreamChannelService'
import { AuthService } from '@/lib/services/server/AuthService'
import type { Channel } from '@/types/xtream'

export class ChannelService {
  static async getChannelsByCategory(serverId: number, categoryId?: string): Promise<Channel[]> {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    try {
      // First try to get from database
      const channels = await ChannelRepository.getByCategory(serverId, categoryId)
      
      if (channels && channels.length > 0) {
        return channels
      }

      // If no channels in database, fetch from API
      const [credentials, server] = await Promise.all([
        CredentialsRepository.getCredentials(serverId, user.username),
        ServerRepository.getById(serverId)
      ])
      
      if (!credentials || !server) {
        throw new Error('Server or credentials not found')
      }

      if (!credentials.username || !credentials.password) {
        throw new Error('Invalid credentials')
      }

      const apiChannels = await XtreamChannelService.getChannels(
        server.url,
        credentials.username,
        credentials.password
      )

      // Save to database for future use
      await ChannelRepository.saveBatch(apiChannels, serverId)

      // Return filtered channels if categoryId is provided
      return categoryId
        ? apiChannels.filter(channel => channel.category_id === categoryId)
        : apiChannels
    } catch (error) {
      console.error('Failed to get channels:', error)
      throw error instanceof Error 
        ? error 
        : new Error('Failed to fetch channels')
    }
  }

  static async searchChannels(serverId: number, query: string): Promise<Channel[]> {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    try {
      return await ChannelRepository.search(serverId, query)
    } catch (error) {
      console.error('Failed to search channels:', error)
      throw error instanceof Error 
        ? error 
        : new Error('Failed to search channels')
    }
  }
}