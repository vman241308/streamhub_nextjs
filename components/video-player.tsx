"use client"

import { useEffect, useRef, memo, useState, useCallback } from "react"
import type Hls from "hls.js"
import { Card } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoStats } from "@/components/video-stats"
import { HLS_CONFIG } from "@/lib/config/hls"

interface VideoPlayerProps {
  streamId: number
}

function VideoPlayerComponent({ streamId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<typeof Hls>()
  const hlsInstanceRef = useRef<InstanceType<typeof Hls>>()
  const abortControllerRef = useRef<AbortController>()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    resolution: 'N/A',
    fps: 'N/A',
    buffered: 0
  })

  const updateStats = useCallback(() => {
    if (!videoRef.current || !hlsInstanceRef.current) return

    const video = videoRef.current
    const hls = hlsInstanceRef.current

    const level = hls.levels[hls.currentLevel]
    const resolution = level ? `${level.width}x${level.height}` : 'N/A'
    const fps = level ? `${level.frameRate}fps` : 'N/A'

    let buffered = 0
    if (video.buffered.length > 0) {
      buffered = video.buffered.end(video.buffered.length - 1) - video.currentTime
    }

    setStats({
      resolution,
      fps,
      buffered: Math.round(buffered * 10) / 10
    })
  }, [])

  const handleError = useCallback((error: Error) => {
    console.error("Player error:", error)
    setError("Failed to load stream")
    setIsLoading(false)
  }, [])

  const cleanup = useCallback(() => {
    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Stop and destroy HLS instance
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.stopLoad()
      hlsInstanceRef.current.detachMedia()
      hlsInstanceRef.current.destroy()
      hlsInstanceRef.current = undefined
    }

    // Clear video source
    if (videoRef.current) {
      videoRef.current.removeAttribute('src')
      videoRef.current.load()
    }
  }, [])

  const initializeHls = useCallback(() => {
    cleanup()
    const videoElement = videoRef.current
    if (!videoElement) return

    // Create new abort controller for this instance
    abortControllerRef.current = new AbortController()

    setError(null)
    setIsLoading(true)

    import('hls.js').then(({ default: Hls }) => {
      hlsRef.current = Hls

      if (!Hls.isSupported()) {
        setError("Your browser does not support HLS playback")
        setIsLoading(false)
        return
      }

      const streamUrl = `/api/stream?streamId=${streamId}`
      const hls = new Hls({
        ...HLS_CONFIG,
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = false
          // Attach abort signal to XHR requests
          if (abortControllerRef.current?.signal) {
            xhr.addEventListener('abort', () => xhr.abort())
            abortControllerRef.current.signal.addEventListener('abort', () => xhr.abort())
          }
        }
      })
      hlsInstanceRef.current = hls

      const statsInterval = setInterval(updateStats, 1000)

      const handleFragLoaded = () => {
        if (videoElement.buffered.length > 0) {
          const latestAvailable = videoElement.buffered.end(videoElement.buffered.length - 1)
          const currentLatency = latestAvailable - videoElement.currentTime
          if (currentLatency > 1) {
            videoElement.currentTime = latestAvailable - 0.5
          }
        }
      }

      const handleError = (_: any, data: { type: string; fatal: boolean; details: string }) => {
        console.error("HLS Error:", data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (!abortControllerRef.current?.signal.aborted) {
                console.log("Network error, attempting to recover...")
                hls.startLoad()
              }
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, attempting to recover...")
              hls.recoverMediaError()
              break
            default:
              if (!abortControllerRef.current?.signal.aborted) {
                handleError(new Error(data.details))
                cleanup()
              }
              break
          }
        }
      }

      try {
        hls.attachMedia(videoElement)

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log("Media attached")
          hls.loadSource(streamUrl)
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("Manifest parsed")
          setIsLoading(false)
          videoElement.play().catch(console.error)
        })

        hls.on(Hls.Events.FRAG_BUFFERED, handleFragLoaded)
        hls.on(Hls.Events.ERROR, handleError)
        hls.on(Hls.Events.LEVEL_SWITCHED, updateStats)

        // Cleanup function
        return () => {
          clearInterval(statsInterval)
          hls.off(Hls.Events.FRAG_BUFFERED, handleFragLoaded)
          hls.off(Hls.Events.ERROR, handleError)
          hls.off(Hls.Events.LEVEL_SWITCHED, updateStats)
          cleanup()
        }
      } catch (error) {
        handleError(error instanceof Error ? error : new Error('Failed to initialize player'))
        cleanup()
      }
    }).catch(handleError)
  }, [streamId, handleError, updateStats, cleanup])

  useEffect(() => {
    initializeHls()
    return cleanup
  }, [initializeHls, cleanup])

  if (error) {
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <p className="text-white">{error}</p>
            <Button variant="outline" onClick={() => initializeHls()}>
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <video 
          ref={videoRef} 
          className="w-full h-full" 
          controls 
          playsInline
          crossOrigin="anonymous"
        />
      </div>
      <VideoStats stats={stats} />
    </Card>
  )
}

export const VideoPlayer = memo(VideoPlayerComponent)
VideoPlayer.displayName = "VideoPlayer"