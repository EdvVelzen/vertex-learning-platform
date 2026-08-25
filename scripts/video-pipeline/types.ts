export type VideoProvider = 'youtube' | 'vimeo' | 'bunny' | 'custom';

export interface ParsedVideoUrl {
  provider: VideoProvider;
  videoId: string;
  libraryId?: string;
  canonicalUrl: string;
  rawUrl: string;
}

export interface RawSubtitleCue {
  startSeconds: number;
  endSeconds?: number;
  text: string;
}

export interface VideoChapter {
  _key: string;
  startSeconds: number;
  label: string;
}

export interface TranscriptChunk {
  _key: string;
  startSeconds: number;
  text: string;
}

export interface SanityVideoDocument {
  _id: string;
  _type: 'video';
  videoId: string;
  url: string;
  title: string;
  duration?: number;
  chapters: VideoChapter[];
  chunks: TranscriptChunk[];
}

export interface IngestVideoOptions {
  url: string;
  title?: string;
  duration?: number;
  transcriptContent?: string;
  transcriptFile?: string;
  chaptersContent?: string;
  chaptersFile?: string;
  keyPoints?: string[];
  notesText?: string;
  fetchLiveCaptions?: boolean;
}

export interface IngestionResult {
  success: boolean;
  document: SanityVideoDocument;
  provider: VideoProvider;
  chapterCount: number;
  chunkCount: number;
  warnings?: string[];
  error?: string;
}

export interface PipelineBatchStats {
  total: number;
  succeeded: number;
  failed: number;
  results: IngestionResult[];
}
