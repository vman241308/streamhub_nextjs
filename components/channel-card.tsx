"use client"

import { memo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ChannelPreview } from '@/components/channel-preview'
import type { Channel } from '@/types/xtream'

interface ChannelCardProps {
  channel: Channel
}

function ChannelCardComponent({ channel }: ChannelCardProps) {
  return (
    <Link href={`/live/watch/${channel.stream_id}`}>
      <Card className="overflow-hidden transition-all hover:scale-105 hover:ring-2 hover:ring-primary">
        <ChannelPreview 
          logo={channel.stream_icon}
          name={channel.name}
        />
        <div className="p-4">
          <h3 className="font-medium line-clamp-1" title={channel.name}>
            {channel.name}
          </h3>
        </div>
      </Card>
    </Link>
  )
}

export const ChannelCard = memo(ChannelCardComponent)
ChannelCard.displayName = 'ChannelCard'