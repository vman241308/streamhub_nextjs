export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface ServerStatus {
  exists: boolean
  id?: number
  hasData: boolean
  isReady: boolean
}