export interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  connectionLimit: number
}

export interface ServerInfo {
  id: number
  url: string
  categoryCount: number
  channelCount: number
  lastSync?: Date
}

export interface StoredCredentials {
  id: number
  serverId: number
  username: string
  password: string
  created_at: Date
  updated_at: Date
}

export interface CategoryBadge {
  type: 'quality' | 'provider' | 'content'
  value: string
}

export interface StoredCategory {
  category_id: string
  name: string
  parent_id: number | null
  badges: CategoryBadge[] | null
  server_id: number
  created_at: Date
  updated_at: Date
}