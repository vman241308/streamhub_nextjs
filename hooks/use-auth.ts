"use client"

import { create } from 'zustand'
import { useEffect, useRef } from 'react'
import { AuthService } from '@/lib/services/client/AuthService'
import { ServerService } from '@/lib/services/client/ServerService'

interface Credentials {
  url: string
  username: string
  password: string
}

interface ServerStatus {
  isReady: boolean
  hasData: boolean
  isChecking: boolean
  error?: string
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  isVerifying: boolean
  serverId?: number
  username?: string
  credentials?: Credentials
  serverStatus: ServerStatus
  checkServerStatus: () => Promise<void>
  setAuth: (data: { serverId: number; username: string; credentials: Credentials }) => Promise<void>
  logout: () => Promise<void>
  verify: () => Promise<void>
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  isVerifying: false,
  serverId: undefined,
  username: undefined,
  credentials: undefined,
  serverStatus: {
    isReady: false,
    hasData: false,
    isChecking: false
  },

  checkServerStatus: async () => {
    const { serverId } = get()
    if (!serverId) return

    set(state => ({
      serverStatus: { ...state.serverStatus, isChecking: true, error: undefined }
    }))

    try {
      const status = await ServerService.checkServer(serverId)
      set({
        serverStatus: {
          isReady: status.isReady,
          hasData: status.hasData,
          isChecking: false
        }
      })
    } catch (error) {
      set({
        serverStatus: {
          isReady: false,
          hasData: false,
          isChecking: false,
          error: 'Failed to check server status'
        }
      })
    }
  },

  setAuth: async (data) => {
    set({ isLoading: true })
    try {
      set({
        isAuthenticated: true,
        serverId: data.serverId,
        username: data.username,
        credentials: data.credentials,
        isLoading: false
      })
      
      // Check server status immediately after authentication
      await get().checkServerStatus()
    } catch (error) {
      console.error('Failed to set auth:', error)
      set({ isLoading: false })
    }
  },

  logout: async () => {
    try {
      await AuthService.logout()
      set({ 
        isAuthenticated: false, 
        serverId: undefined, 
        username: undefined,
        credentials: undefined,
        serverStatus: {
          isReady: false,
          hasData: false,
          isChecking: false
        }
      })
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  },

  verify: async () => {
    const state = get()
    if (state.isVerifying) return
    
    set({ isVerifying: true })
    
    try {
      const response = await AuthService.verify()
      
      if (response.isAuthenticated && response.serverId && response.username) {
        set({
          isAuthenticated: true,
          serverId: response.serverId,
          username: response.username
        })
        // Check server status after verification
        await get().checkServerStatus()
      } else {
        set({ isAuthenticated: false })
      }
    } catch (error) {
      console.error('Auth verification failed:', error)
      set({ isAuthenticated: false })
    } finally {
      set({ isVerifying: false, isLoading: false })
    }
  }
}))

export function useAuth() {
  const didVerify = useRef(false)

  useEffect(() => {
    if (!didVerify.current) {
      didVerify.current = true
      // Verify auth status on mount
      useAuthStore.getState().verify()
    }
  }, [])

  return useAuthStore()
}