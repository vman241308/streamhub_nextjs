"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold">Connection Successful!</h1>
        <p className="text-lg text-muted-foreground">
          You&apos;ve successfully authenticated with the streaming service.
        </p>
      </div>
    </div>
  )
}