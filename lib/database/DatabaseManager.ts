import mysql, { Pool, PoolConnection } from 'mysql2/promise'
import { DATABASE_CONFIG } from '@/lib/config/constants'
import { readFileSync } from 'fs'
import { join } from 'path'

export class DatabaseManager {
  private static instance: DatabaseManager
  private pool?: Pool
  private isInitialized = false

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  private async initialize() {
    if (this.isInitialized) return

    try {
      this.pool = mysql.createPool(DATABASE_CONFIG)
      const connection = await this.pool.getConnection()
      connection.release()
      console.log('MySQL database connected')
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to connect to MySQL:', error)
      throw error
    }
  }

  public async initializeTables(): Promise<void> {
    await this.initialize()

    try {
      const sql = readFileSync(join(process.cwd(), 'lib/database/migrations/01_initial.sql'), 'utf8')
      const statements = sql.split(';').filter(statement => statement.trim())
      
      for (const statement of statements) {
        if (statement.trim()) {
          await this.query(statement)
        }
      }
      
      console.log('Database tables initialized successfully')
    } catch (error) {
      console.error('Failed to initialize database tables:', error)
      throw error
    }
  }

  public async query<T>(sql: string, params?: any[]): Promise<T> {
    await this.initialize()

    try {
      if (!this.pool) {
        throw new Error('Database not initialized')
      }

      const [rows] = await this.pool.execute(sql, params)
      return rows as T
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }

  public async getConnection(): Promise<PoolConnection> {
    await this.initialize()
    if (!this.pool) {
      throw new Error('Database not initialized')
    }
    return await this.pool.getConnection()
  }

  public async end(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
    }
  }
}