import { CORS_HEADERS } from '@/lib/config/constants'

interface ResponseHeaders extends Record<string, string> {
  'Content-Type'?: string
  'Accept-Ranges'?: string
}

export function isValidSegment(segment: string): boolean {
  // Stricter validation for segment names
  return /^[\d]+_[\d]+\.ts$/.test(segment)
}

export function sanitizeSegmentPath(segment: string): string {
  // Extract just the filename, removing any path components
  const filename = segment.split(/[\/\\]/).pop()
  if (!filename || !isValidSegment(filename)) {
    throw new Error('Invalid segment format')
  }
  return filename
}

export function createStreamHeaders(serverUrl: string): HeadersInit {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Origin': serverUrl,
    'Referer': `${serverUrl}/`,
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site'
  }
}

export function createResponseHeaders(type: 'manifest' | 'segment'): ResponseHeaders {
  const headers: ResponseHeaders = {
    ...CORS_HEADERS,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Connection': 'keep-alive',
    'Keep-Alive': 'timeout=5, max=1000'
  }

  if (type === 'manifest') {
    headers['Content-Type'] = 'application/vnd.apple.mpegurl'
  } else {
    headers['Content-Type'] = 'video/mp2t'
    headers['Accept-Ranges'] = 'bytes'
  }

  return headers
}

export function modifyManifest(manifest: string, streamId: string): string {
  const lines = manifest.split('\n')
  const modified = lines.map(line => {
    const trimmedLine = line.trim()
    
    // Replace segment URLs with our proxy URLs
    if (trimmedLine.endsWith('.ts') && !trimmedLine.startsWith('#')) {
      try {
        const segmentFile = sanitizeSegmentPath(trimmedLine)
        return `/api/stream?streamId=${encodeURIComponent(streamId)}&segment=${encodeURIComponent(segmentFile)}`
      } catch {
        return line // Keep original line if sanitization fails
      }
    }
    
    // Add quality levels if not present
    if (trimmedLine.startsWith('#EXT-X-STREAM-INF:') && !trimmedLine.includes('RESOLUTION')) {
      return `${trimmedLine},RESOLUTION=1920x1080,BANDWIDTH=5000000,FRAME-RATE=30`
    }

    // Ensure correct target duration
    if (trimmedLine.startsWith('#EXT-X-TARGETDURATION:')) {
      return '#EXT-X-TARGETDURATION:2'
    }

    return line
  })

  // Add required HLS directives at the start if not present
  const requiredDirectives = new Set([
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    '#EXT-X-ALLOW-CACHE:NO',
    '#EXT-X-TARGETDURATION:2',
    '#EXT-X-MEDIA-SEQUENCE:0'
  ])

  // Filter out duplicates and combine
  const finalLines = Array.from(requiredDirectives)
    .concat(modified.filter(line => !requiredDirectives.has(line.trim())))

  return finalLines.join('\n')
}