interface CacheEntry {
  url: string
  timestamp: number
  serverUrl: string
}

export class StreamCacheService {
  private static instance: StreamCacheService
  private cache: Map<string, CacheEntry>
  private readonly TTL = 5 * 60 * 1000 // 5 minutes
  private cleanupInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.cache = new Map()
    this.startCleanupInterval()
  }

  private startCleanupInterval() {
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000)
  }

  public static getInstance(): StreamCacheService {
    if (!StreamCacheService.instance) {
      StreamCacheService.instance = new StreamCacheService()
    }
    return StreamCacheService.instance
  }

  public set(key: string, url: string, serverUrl: string): void {
    // Remove any existing entry first
    this.cache.delete(key)
    
    this.cache.set(key, {
      url,
      serverUrl,
      timestamp: Date.now()
    })
  }

  public get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key)
      return undefined
    }

    return entry
  }

  public invalidate(key: string): void {
    this.cache.delete(key)
  }

  public cleanup(): void {
    const now = Date.now()
    // Convert Map entries to array before iterating
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key)
      }
    })
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }
}