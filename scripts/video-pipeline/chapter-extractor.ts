import { VideoChapter } from './types';
import { parseTimestampToSeconds, cleanSubtitleText } from './subtitle-parser';

/**
 * Parses chapter markers from description text, comments, or authored timestamp lists.
 * Supported formats:
 * - 00:00 Introduction
 * - 01:23 - Data Fetching
 * - [05:40] Server Actions
 * - (12:45) Streaming & Suspense
 */
export function parseChaptersFromText(text: string): VideoChapter[] {
  if (!text) return [];

  const chapters: VideoChapter[] = [];
  const lines = text.split('\n');

  // Regex matches:
  // (optional brackets/parens)(time digits: 00:00 or 0:00 or 00:00:00)(optional brackets/parens)(delimiter: - , :, space)(label)
  const chapterRegex = /^[\[\(]?((?:\d{1,2}:)?\d{1,2}:\d{2})[\]\)]?\s*[-–—:|]?\s*(.+)$/;

  let keyIndex = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(chapterRegex);
    if (match) {
      const startSeconds = parseTimestampToSeconds(match[1]);
      const rawLabel = match[2].trim();
      const label = cleanSubtitleText(rawLabel.replace(/^[-\–\—:|]+\s*/, ''));

      if (label && label.length > 1) {
        chapters.push({
          _key: `ch-${keyIndex++}`,
          startSeconds: Math.floor(startSeconds),
          label,
        });
      }
    }
  }

  return sortAndDeduplicateChapters(chapters);
}

/**
 * Synthesizes structured chapters from lesson keyPoints and duration when no explicit chapters are available.
 */
export function generateChaptersFromKeyPoints(
  title: string,
  keyPoints: string[] = [],
  duration: number = 600
): VideoChapter[] {
  const chapters: VideoChapter[] = [];

  // Always start with intro at 0s
  chapters.push({
    _key: 'ch-0',
    startSeconds: 0,
    label: `Introduction to ${title || 'Lesson'}`,
  });

  if (keyPoints && keyPoints.length > 0) {
    const validPoints = keyPoints.map(p => cleanSubtitleText(p)).filter(p => p.length > 0);
    const step = Math.max(30, Math.floor((duration - 60) / (validPoints.length + 1)));

    validPoints.forEach((point, idx) => {
      chapters.push({
        _key: `ch-${idx + 1}`,
        startSeconds: Math.min(Math.max(30, (idx + 1) * step), Math.max(30, duration - 30)),
        label: point,
      });
    });
  }

  return sortAndDeduplicateChapters(chapters);
}

/**
 * Normalizes, sorts chronologically, and deduplicates chapter markers.
 * Ensures the first chapter starts at 0s.
 */
export function sortAndDeduplicateChapters(chapters: VideoChapter[]): VideoChapter[] {
  if (!chapters || chapters.length === 0) return [];

  // Sort by startSeconds ascending
  const sorted = [...chapters].sort((a, b) => a.startSeconds - b.startSeconds);

  const result: VideoChapter[] = [];
  const seenSeconds = new Set<number>();

  for (let i = 0; i < sorted.length; i++) {
    const ch = sorted[i];
    const sec = Math.max(0, ch.startSeconds);
    if (!seenSeconds.has(sec)) {
      seenSeconds.add(sec);
      result.push({
        _key: ch._key || `ch-${result.length}`,
        startSeconds: sec,
        label: ch.label || `Chapter ${result.length + 1}`,
      });
    }
  }

  // Ensure first chapter starts at 0
  if (result.length > 0 && result[0].startSeconds > 0) {
    result.unshift({
      _key: 'ch-intro',
      startSeconds: 0,
      label: 'Introduction',
    });
  }

  return result.map((ch, idx) => ({
    ...ch,
    _key: `ch-${idx}`,
  }));
}
