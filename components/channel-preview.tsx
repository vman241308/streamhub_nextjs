"use client"

import { memo } from 'react'
import { Play, Tv } from 'lucide-react'
import Image from 'next/image'

interface ChannelPreviewProps {
  logo?: string
  name: string
}

const ChannelPreviewComponent = ({ logo, name }: ChannelPreviewProps) => {
  return (
    <div className="relative aspect-video bg-zinc-950 rounded-lg overflow-hidden group">
      <div className="absolute inset-0 flex items-center justify-center">
        {logo ? (
          <div className="relative w-full h-full">
            <Image
              src={logo}
              alt={name}
              fill
              className="object-contain p-4"
              onError={(e) => {
                // Replace broken image with TV icon
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden')
              }}
            />
            <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center">
              <Tv className="h-12 w-12 text-zinc-700" />
            </div>
          </div>
        ) : (
          <Tv className="h-12 w-12 text-zinc-700" />
        )}
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Play className="w-12 h-12 text-white" />
      </div>
    </div>
  )
}

export const ChannelPreview = memo(ChannelPreviewComponent)
ChannelPreview.displayName = 'ChannelPreview'