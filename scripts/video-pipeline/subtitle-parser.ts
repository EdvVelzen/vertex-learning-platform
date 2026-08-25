import { RawSubtitleCue } from './types';

/**
 * Parses timestamp string (e.g. "00:01:23.456", "01:23,456", "01:23", "83") to seconds.
 */
export function parseTimestampToSeconds(timestamp: string): number {
  if (!timestamp) return 0;
  const trimmed = timestamp.trim().replace(',', '.');

  // If already a pure number
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return parseFloat(trimmed);
  }

  const parts = trimmed.split(':');
  if (parts.length === 3) {
    // HH:MM:SS.mmm
    const hours = parseFloat(parts[0]) || 0;
    const mins = parseFloat(parts[1]) || 0;
    const secs = parseFloat(parts[2]) || 0;
    return hours * 3600 + mins * 60 + secs;
  }

  if (parts.length === 2) {
    // MM:SS.mmm
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  }

  return 0;
}

/**
 * Strips HTML, XML, and VTT style markup tags from cue text.
 */
export function cleanSubtitleText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/<[^>]+>/g, '') // remove HTML/XML tags
    .replace(/\{[^}]+\}/g, '') // remove bracket tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses WebVTT content into raw cues.
 */
export function parseVtt(content: string): RawSubtitleCue[] {
  const cues: RawSubtitleCue[] = [];
  const lines = content.replace(/\r/g, '').split('\n');

  let currentStart = -1;
  let currentEnd = -1;
  let currentTextLines: string[] = [];

  const timeMatchRegex =
    /((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{3})?)\s*-->\s*((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{3})?)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('WEBVTT') || line.startsWith('NOTE') || line.startsWith('STYLE')) {
      continue;
    }

    const match = line.match(timeMatchRegex);
    if (match) {
      // Save previous cue if exists
      if (currentStart >= 0 && currentTextLines.length > 0) {
        const text = cleanSubtitleText(currentTextLines.join(' '));
        if (text) {
          cues.push({
            startSeconds: currentStart,
            endSeconds: currentEnd > currentStart ? currentEnd : undefined,
            text,
          });
        }
      }

      currentStart = parseTimestampToSeconds(match[1]);
      currentEnd = parseTimestampToSeconds(match[2]);
      currentTextLines = [];
    } else if (currentStart >= 0 && line.length > 0 && !/^\d+$/.test(line)) {
      currentTextLines.push(line);
    } else if (line.length === 0 && currentStart >= 0 && currentTextLines.length > 0) {
      const text = cleanSubtitleText(currentTextLines.join(' '));
      if (text) {
        cues.push({
          startSeconds: currentStart,
          endSeconds: currentEnd > currentStart ? currentEnd : undefined,
          text,
        });
      }
      currentStart = -1;
      currentEnd = -1;
      currentTextLines = [];
    }
  }

  // Flush last cue
  if (currentStart >= 0 && currentTextLines.length > 0) {
    const text = cleanSubtitleText(currentTextLines.join(' '));
    if (text) {
      cues.push({
        startSeconds: currentStart,
        endSeconds: currentEnd > currentStart ? currentEnd : undefined,
        text,
      });
    }
  }

  return cues;
}

/**
 * Parses SRT content into raw cues.
 */
export function parseSrt(content: string): RawSubtitleCue[] {
  // SRT format is very similar to VTT with comma decimals and numeric indices
  return parseVtt(content);
}

/**
 * Parses JSON formatted captions/transcripts.
 */
export function parseJsonCaptions(jsonString: string): RawSubtitleCue[] {
  try {
    const parsed = JSON.parse(jsonString);
    const items = Array.isArray(parsed) ? parsed : parsed.cues || parsed.transcript || parsed.events || [];
    const cues: RawSubtitleCue[] = [];

    for (const item of items) {
      const start = item.startSeconds ?? item.start ?? item.tStartMs ? (item.tStartMs / 1000) : parseTimestampToSeconds(item.timestamp || item.time || '0');
      const text = cleanSubtitleText(item.text || item.utf8 || item.label || '');
      const dur = item.duration ?? item.dur ?? item.dDurationMs ? (item.dDurationMs / 1000) : 0;

      if (text && typeof start === 'number' && !isNaN(start)) {
        cues.push({
          startSeconds: Math.floor(start),
          endSeconds: dur > 0 ? Math.floor(start + dur) : undefined,
          text,
        });
      }
    }

    return cues;
  } catch (error) {
    throw new Error(`Failed to parse JSON captions: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parses timestamped text lines (e.g. "[01:23] Some text here" or "01:23 Intro text").
 */
export function parseTimestampedText(content: string): RawSubtitleCue[] {
  const cues: RawSubtitleCue[] = [];
  const lines = content.split('\n');
  const lineRegex = /^[\[\(]?((?:\d{1,2}:)?\d{2}:\d{2})[\]\)]?[\s:-]+(.*)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(lineRegex);
    if (match) {
      const startSeconds = parseTimestampToSeconds(match[1]);
      const text = cleanSubtitleText(match[2]);
      if (text) {
        cues.push({
          startSeconds,
          text,
        });
      }
    }
  }

  return cues;
}

/**
 * Auto-detects format and parses subtitle/caption string into normalized cues.
 */
export function parseSubtitles(content: string): RawSubtitleCue[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  // Check JSON
  if (trimmed.startsWith('[') || (trimmed.startsWith('{') && trimmed.includes('"transcript"'))) {
    try {
      return parseJsonCaptions(trimmed);
    } catch {
      // Fallback
    }
  }

  // Check VTT or SRT
  if (trimmed.includes('-->')) {
    return parseVtt(trimmed);
  }

  // Check timestamped text
  const timestamped = parseTimestampedText(trimmed);
  if (timestamped.length > 0) {
    return timestamped;
  }

  // Plain sentences fallback (if no timestamps provided)
  const sentences = trimmed.split(/(?<=[.?!])\s+/).filter((s) => s.length > 5);
  return sentences.map((sentence, index) => ({
    startSeconds: index * 30,
    text: cleanSubtitleText(sentence),
  }));
}
