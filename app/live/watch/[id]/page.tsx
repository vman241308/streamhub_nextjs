"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { VideoPlayer } from '@/components/video-player'
import { Loader2 } from 'lucide-react'

export default function WatchPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, serverStatus } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    if (!serverStatus.hasData) {
      router.push('/setup')
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, serverStatus.hasData, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <VideoPlayer streamId={parseInt(params.id, 10)} />
      </div>
    </div>
  )
}