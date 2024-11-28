import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/server/AuthService";
import { CredentialsRepository } from "@/lib/repositories/CredentialsRepository";
import { ServerRepository } from "@/lib/repositories/ServerRepository";
import { StreamCacheService } from "@/lib/services/StreamCacheService";
import {
  createStreamHeaders,
  createResponseHeaders,
  modifyManifest,
  isValidSegment,
  sanitizeSegmentPath,
} from "@/lib/utils/stream";

const streamCache = StreamCacheService.getInstance();
const RETRY_ATTEMPTS = 2;
const RETRY_DELAY = 1000;

async function fetchWithRetry(
  url: string,
  headers: HeadersInit,
  attempts = RETRY_ATTEMPTS
): Promise<Response> {
  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: 0 },
      keepalive: true,
    });

    if (!response.ok && attempts > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, headers, attempts - 1);
    }

    return response;
  } catch (error) {
    if (attempts > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, headers, attempts - 1);
    }
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const streamId = searchParams.get("streamId");
    const segment = searchParams.get("segment");

    if (!streamId) {
      return NextResponse.json(
        { error: "Stream ID is required" },
        { status: 400 }
      );
    }

    const cacheKey = `${user.serverId}:${user.username}:${streamId}`;

    // Handle segment requests
    if (segment) {
      try {
        const segmentFile = sanitizeSegmentPath(segment);
        const cached = streamCache.get(cacheKey);

        if (!cached) {
          return NextResponse.json(
            { error: "Stream session expired" },
            { status: 400 }
          );
        }

        const segmentUrl = `${cached.url}/${segmentFile}`;

        try {
          const response = await fetchWithRetry(
            segmentUrl,
            createStreamHeaders(cached.serverUrl)
          );

          const buffer = await response.arrayBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: createResponseHeaders("segment"),
          });
        } catch (error) {
          console.error("Segment fetch error:", error);
          streamCache.invalidate(cacheKey); // Invalidate cache on error
          return NextResponse.json(
            { error: "Failed to fetch segment" },
            { status: 502 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid segment format" },
          { status: 400 }
        );
      }
    }

    // Handle manifest requests
    let cached = streamCache.get(cacheKey);
    if (!cached) {
      const [server, credentials] = await Promise.all([
        ServerRepository.getById(user.serverId),
        CredentialsRepository.getCredentials(user.serverId, user.username),
      ]);

      if (!server || !credentials) {
        return NextResponse.json(
          { error: "Server or credentials not found" },
          { status: 404 }
        );
      }

      const baseUrl = `${server.url}/live/${credentials.username}/${credentials.password}/${streamId}`;

      streamCache.set(cacheKey, baseUrl, server.url);
      cached = { url: baseUrl, serverUrl: server.url, timestamp: Date.now() };
    }

    try {
      const manifestUrl = `${cached.url}.m3u8`;

      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~manifestUrl", manifestUrl);
      const response = await fetchWithRetry(
        manifestUrl,
        createStreamHeaders(cached.serverUrl)
      );

      const manifest = await response.text();
      const modifiedManifest = modifyManifest(manifest, streamId);

      return new NextResponse(modifiedManifest, {
        status: 200,
        headers: createResponseHeaders("manifest"),
      });
    } catch (error) {
      console.error("Manifest fetch error:", error);
      streamCache.invalidate(cacheKey); // Invalidate cache on error
      return NextResponse.json(
        { error: "Failed to fetch manifest" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Stream proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
