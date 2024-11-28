"use client"

import { memo } from 'react'
import { Video, Gauge, Loader2 } from 'lucide-react'

export interface StreamStats {
  resolution: string
  fps: string
  buffered: number
}

interface VideoStatsProps {
  stats: StreamStats
}

const StatPill = memo(({ icon: Icon, value }: { icon: typeof Video; value: string | number }) => (
  <div className="flex items-center gap-1.5 bg-accent px-2.5 py-1 rounded-full text-sm">
    <Icon className="h-3.5 w-3.5" />
    <span>{value}</span>
  </div>
))

StatPill.displayName = 'StatPill'

const VideoStatsComponent = ({ stats }: VideoStatsProps) => {
  return (
    <div className="flex gap-2 p-4 border-t">
      <StatPill icon={Video} value={stats.resolution} />
      <StatPill icon={Gauge} value={stats.fps} />
      <StatPill icon={Loader2} value={`${stats.buffered}s`} />
    </div>
  )
}

export const VideoStats = memo(VideoStatsComponent)
VideoStats.displayName = 'VideoStats'