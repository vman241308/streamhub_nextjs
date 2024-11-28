"use client"

import { useState, useEffect } from 'react'
import { ChannelCard } from '@/components/channel-card'
import { Loader2 } from 'lucide-react'
import type { Channel } from '@/types/xtream'
import { ChannelService } from '@/lib/services/client/ChannelService'

interface ChannelGridProps {
  serverId: number
  categoryId: string
}

export function ChannelGrid({ serverId, categoryId }: ChannelGridProps) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChannels = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const channelsData = await ChannelService.getChannelsByCategory(
          serverId,
          categoryId
        )
        setChannels(channelsData)
      } catch (error) {
        console.error('Failed to load channels:', error)
        setError('Failed to load channels')
      } finally {
        setIsLoading(false)
      }
    }

    loadChannels()
  }, [serverId, categoryId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        {error}
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        No channels found in this category
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {channels.map((channel) => (
        <ChannelCard key={channel.stream_id} channel={channel} />
      ))}
    </div>
  )
}