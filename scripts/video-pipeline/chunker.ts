import { RawSubtitleCue, TranscriptChunk } from './types';
import { cleanSubtitleText } from './subtitle-parser';

export interface ChunkerOptions {
  minDurationSeconds?: number; // Target minimum duration for a chunk (default: 15)
  maxDurationSeconds?: number; // Target maximum duration for a chunk (default: 45)
  maxWordsPerChunk?: number;   // Target maximum words per chunk (default: 60)
}

/**
 * Intelligent chunking engine: groups subtitle cues into compact, timestamped slices.
 * Ensures chunks have meaningful length for token-based search and LLM context window safety.
 */
export function chunkSubtitleCues(
  cues: RawSubtitleCue[],
  options: ChunkerOptions = {}
): TranscriptChunk[] {
  if (!cues || cues.length === 0) return [];

  const minDuration = options.minDurationSeconds ?? 15;
  const maxDuration = options.maxDurationSeconds ?? 45;
  const maxWords = options.maxWordsPerChunk ?? 60;

  const chunks: TranscriptChunk[] = [];
  let currentChunkStart = cues[0].startSeconds;
  let currentTexts: string[] = [];
  let currentWordCount = 0;

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    const text = cleanSubtitleText(cue.text);
    if (!text) continue;

    const words = text.split(/\s+/).filter(Boolean);

    currentTexts.push(text);
    currentWordCount += words.length;

    const isLastCue = i === cues.length - 1;
    const nextCue = cues[i + 1];
    const nextStart = nextCue ? nextCue.startSeconds : cue.startSeconds;
    const durationSoFar = nextStart - currentChunkStart;

    const endsWithSentencePunctuation = /[.?!]$/.test(text);

    // Decision to seal current chunk:
    // 1. If we reached max duration or max words
    // 2. If we reached min duration and hit a natural sentence boundary
    // 3. If there is a large pause between cues (> 10 seconds)
    // 4. If it's the last cue
    const shouldSeal =
      isLastCue ||
      durationSoFar >= maxDuration ||
      currentWordCount >= maxWords ||
      (durationSoFar >= minDuration && endsWithSentencePunctuation) ||
      (nextCue && nextCue.startSeconds - (cue.endSeconds || cue.startSeconds) > 10);

    if (shouldSeal && currentTexts.length > 0) {
      chunks.push({
        _key: `chunk-${chunks.length}`,
        startSeconds: Math.floor(currentChunkStart),
        text: currentTexts.join(' ').trim(),
      });

      if (nextCue) {
        currentChunkStart = nextCue.startSeconds;
      }
      currentTexts = [];
      currentWordCount = 0;
    }
  }

  return chunks;
}

/**
 * Creates timestamped transcript chunks from plain text notes by splitting into sentences
 * and distributing them across the video duration.
 */
export function chunkPlainText(
  text: string,
  totalDuration: number = 600
): TranscriptChunk[] {
  const cleaned = cleanSubtitleText(text);
  if (!cleaned) return [];

  // Split on sentence boundaries
  const sentences = cleaned.split(/(?<=[.?!])\s+/).filter((s) => s.length > 10);
  if (sentences.length === 0) {
    return [
      {
        _key: 'chunk-0',
        startSeconds: 0,
        text: cleaned,
      },
    ];
  }

  const chunks: TranscriptChunk[] = [];
  const count = sentences.length;
  const chunkStep = Math.max(15, Math.floor(totalDuration / count));

  sentences.forEach((sentence, idx) => {
    chunks.push({
      _key: `chunk-${idx}`,
      startSeconds: Math.min(Math.max(0, idx * chunkStep), Math.max(0, totalDuration - 10)),
      text: sentence.trim(),
    });
  });

  return chunks;
}
