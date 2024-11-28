// lib/config/constants.ts
export const ALLOWED_HOSTS = [
  'cf.mar-cdn.me',
  '185.245.1.8',
  '185.245.1.11', 
  '185.245.1.14',
  '185.245.1.101',
  '185.245.1.104'
] as string[]

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*'
} as const

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 // 30 days
} as const

export const API_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

export const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:uDEmpFZZJwpWfUtMvpGRSnjMkUqusvXL@autorack.proxy.rlwy.net:38080/railway'

// Parse database URL into config object
function parseDatabaseUrl(url: string) {
  const dbUrl = new URL(url)
  return {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '3306'),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace('/', ''),
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  } as const
}

export const DATABASE_CONFIG = parseDatabaseUrl(DATABASE_URL)

export const TEST_CREDENTIALS = {
  username: 'vitoasc',
  password: '3585c59be3',
  url: 'http://cf.mar-cdn.me'
} as const

export const isDevelopment = process.env.NODE_ENV === 'development'
