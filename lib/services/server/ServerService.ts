import { ServerRepository } from '@/lib/repositories/ServerRepository'
import { ServerInfo, ServerStatus } from '@/types'

export class ServerService {
  static async getByUrl(url: string): Promise<ServerInfo | null> {
    return await ServerRepository.getByUrl(url)
  }

  static async createOrUpdate(url: string): Promise<number> {
    return await ServerRepository.createOrUpdate(url)
  }

  static async checkServerStatus(serverId: number): Promise<ServerStatus> {
    const server = await ServerRepository.getById(serverId)
    if (!server) return { exists: false, hasData: false, isReady: false }

    const hasData = server.categoryCount > 0 && server.channelCount > 0
    return {
      exists: true,
      id: server.id,
      hasData,
      isReady: hasData
    }
  }

  static async checkServerStatusByUrl(url: string): Promise<ServerStatus> {
    const server = await ServerRepository.getByUrl(url)
    if (!server) return { exists: false, hasData: false, isReady: false }

    const hasData = server.categoryCount > 0 && server.channelCount > 0
    return {
      exists: true,
      id: server.id,
      hasData,
      isReady: hasData
    }
  }
}