"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FirstTimeSetup } from '@/components/first-time-setup'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export default function SetupPage() {
  const router = useRouter()
  const { isAuthenticated, serverStatus } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    if (!serverStatus.isChecking && serverStatus.hasData) {
      router.push('/live')
    }
  }, [isAuthenticated, serverStatus, router])

  if (!isAuthenticated) {
    return null
  }

  if (serverStatus.isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Verifying server status...</p>
      </div>
    )
  }

  return <FirstTimeSetup />
}