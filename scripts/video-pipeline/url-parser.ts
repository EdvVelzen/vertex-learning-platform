import { ParsedVideoUrl } from './types';

/**
 * Sanitizes a string to conform strictly to Sanity document ID rules:
 * Must match ^[a-zA-Z0-9_.-]+$
 */
export function sanitizeSanityId(id: string): string {
  return id
    .replace(/^[^a-zA-Z0-9]+/, '')
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Parses video URLs for YouTube, Vimeo, and Bunny Stream, extracting provider and IDs.
 */
export function parseVideoUrl(url: string): ParsedVideoUrl {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid video URL provided: URL must be a non-empty string');
  }

  const trimmed = url.trim();

  // 1. YouTube
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      videoId,
      canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      rawUrl: trimmed,
    };
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      provider: 'vimeo',
      videoId,
      canonicalUrl: `https://vimeo.com/${videoId}`,
      rawUrl: trimmed,
    };
  }

  // 3. Bunny Stream
  const bunnyMatch = trimmed.match(
    /(?:iframe\.mediadelivery\.net\/embed\/|video\.bunnycdn\.com\/play\/)([\w-]+)\/([\w-]+)/
  );
  if (bunnyMatch && bunnyMatch[1] && bunnyMatch[2]) {
    const libraryId = bunnyMatch[1];
    const videoId = bunnyMatch[2];
    return {
      provider: 'bunny',
      videoId,
      libraryId,
      canonicalUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
      rawUrl: trimmed,
    };
  }

  // 4. Custom / Generic URL
  // Extract a fallback identifier from pathname or search params
  try {
    const parsed = new URL(trimmed);
    const idParam = parsed.searchParams.get('v') || parsed.searchParams.get('id') || parsed.pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '_');
    const safeId = sanitizeSanityId(idParam || 'custom_video');
    return {
      provider: 'custom',
      videoId: safeId || 'custom_video',
      canonicalUrl: trimmed,
      rawUrl: trimmed,
    };
  } catch {
    const safeFallback = sanitizeSanityId(trimmed);
    return {
      provider: 'custom',
      videoId: safeFallback || 'video',
      canonicalUrl: trimmed,
      rawUrl: trimmed,
    };
  }
}

/**
 * Derives a deterministic, datastore-safe Sanity document ID for a parsed video URL.
 */
export function deriveVideoDocumentId(parsed: ParsedVideoUrl): string {
  switch (parsed.provider) {
    case 'youtube':
      return `video.yt_${sanitizeSanityId(parsed.videoId)}`;
    case 'vimeo':
      return `video.vimeo_${sanitizeSanityId(parsed.videoId)}`;
    case 'bunny':
      return `video.bunny_${sanitizeSanityId(parsed.libraryId || 'lib')}_${sanitizeSanityId(parsed.videoId)}`;
    case 'custom':
    default:
      return `video.${sanitizeSanityId(parsed.videoId)}`;
  }
}
