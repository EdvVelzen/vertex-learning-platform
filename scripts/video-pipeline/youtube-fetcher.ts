import { RawSubtitleCue } from './types';
import { cleanSubtitleText } from './subtitle-parser';

/**
 * Attempts to fetch live timed-text subtitles from public YouTube video page.
 * Returns null if captions are unavailable or fetch fails.
 */
export async function fetchYouTubeCaptions(videoId: string): Promise<RawSubtitleCue[] | null> {
  if (!videoId) return null;

  try {
    const videoPageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!videoPageRes.ok) return null;

    const html = await videoPageRes.text();

    // Look for captionTracks in ytInitialPlayerResponse
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({[\s\S]+?});/);
    if (!playerResponseMatch) return null;

    const playerResponse = JSON.parse(playerResponseMatch[1]);
    const captionTracks =
      playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
      return null;
    }

    // Prefer English captions
    const track =
      captionTracks.find((t: { languageCode?: string }) => t.languageCode?.startsWith('en')) ||
      captionTracks[0];

    if (!track?.baseUrl) return null;

    // Fetch caption XML/JSON
    const captionRes = await fetch(`${track.baseUrl}&fmt=json3`);
    if (!captionRes.ok) {
      // Try XML format fallback
      const xmlRes = await fetch(track.baseUrl);
      if (!xmlRes.ok) return null;
      const xmlText = await xmlRes.text();
      return parseYouTubeTimedTextXml(xmlText);
    }

    const captionJson = await captionRes.json();
    const events = captionJson?.events || [];
    const cues: RawSubtitleCue[] = [];

    for (const evt of events) {
      if (!evt.segs || !Array.isArray(evt.segs)) continue;
      const text = cleanSubtitleText(evt.segs.map((s: { utf8?: string }) => s.utf8 || '').join(''));
      const startMs = evt.tStartMs ?? 0;
      const durMs = evt.dDurationMs ?? 0;

      if (text && text.length > 0) {
        cues.push({
          startSeconds: Math.floor(startMs / 1000),
          endSeconds: durMs > 0 ? Math.floor((startMs + durMs) / 1000) : undefined,
          text,
        });
      }
    }

    return cues.length > 0 ? cues : null;
  } catch {
    // Non-blocking catch; gracefully returns null to let caller fall back to local sources
    return null;
  }
}

/**
 * Parses classic YouTube XML timed text format (<text start="12.3" dur="4.5">hello</text>)
 */
function parseYouTubeTimedTextXml(xml: string): RawSubtitleCue[] {
  const cues: RawSubtitleCue[] = [];
  const regex = /<text\s+start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>(.*?)<\/text>/gi;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    const startSec = parseFloat(match[1]) || 0;
    const durSec = parseFloat(match[2]) || 0;
    const rawText = match[3] || '';
    const text = cleanSubtitleText(rawText);

    if (text) {
      cues.push({
        startSeconds: Math.floor(startSec),
        endSeconds: durSec > 0 ? Math.floor(startSec + durSec) : undefined,
        text,
      });
    }
  }

  return cues;
}
