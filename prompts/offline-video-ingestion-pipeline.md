# Implementation Prompt: Offline Video Ingestion Pipeline

## 1. Goal

Implement a robust, standalone offline video ingestion pipeline for **Vertex** that ingests transcripts and chapters for YouTube, Vimeo, and Bunny Stream videos into dedicated Sanity `video` documents. Each video document stores clean chapter markers (table of contents) for first-stage matching and short timestamped transcript chunks for second-stage fallback matching, ensuring grounded video moment search without loading whole transcripts in the search request path.

---

## 2. Skills & References Read

- `AGENTS.md`: Sections 1, 2, 4, 5, 7, 8, 9, 11, 12, 13, 14.
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`).
- `sanity-migration` (`.agents/skills/sanity-migration/SKILL.md`).
- Video player and embed references: `components/lesson/video-embed.tsx`.

---

## 3. Code & Configuration Inspected

- **Sanity Video Schema**: `studio/schemaTypes/documents/video.ts` — defines `videoId`, `url`, `title`, `duration`, `chapters: [{ startSeconds, label }]`, and `chunks: [{ startSeconds, text }]`.
- **Search Logic & Queries**: `sanity/lib/queries.ts` (`SEARCH_VIDEOS_QUERY`), `lib/search.ts` (`searchContent`, `RawVideoMatch`) — searches chapters first, then transcript chunks, projecting matching seconds, duration, and reverse-referenced parent lesson/course.
- **Player Embed**: `components/lesson/video-embed.tsx` — supports YouTube (`start` query parameter), Vimeo (`#t=Xs` hash parameter), and Bunny (`start` parameter).
- **Existing Seed Data**: `scripts/seed/videos.json`, `scripts/seed/seed.ndjson`, and `scripts/seed/seed-video-data.mjs`.
- **Environment**: `.env.local` contains Sanity project configuration and tokens.

---

## 4. Decisions & Assumptions

1. **Pipeline Architecture & Location**:
   - The video ingestion pipeline is strictly offline tooling located in `scripts/video-pipeline/` (and exposed via npm scripts in `package.json`).
   - It runs completely offline and never in the Next.js request path, preventing runtime latency, third-party API rate limits, or context window overflow.
2. **Supported Video Providers**:
   - **YouTube**: Parses watch, share, embed, and shorts URLs; extracts YouTube video IDs; parses VTT/SRT/JSON/XML captions into timestamped chunks; parses description timestamps (e.g. `00:00`, `01:23`, `12:45`) or cue tracks into structured chapters.
   - **Vimeo**: Parses Vimeo video IDs; parses VTT/SRT captions into timestamped chunks; parses chapter cues into table of contents.
   - **Bunny Stream**: Parses Library ID and Video ID; parses VTT/SRT transcript tracks; structures moments/chapters.
   - **Generic / File Input**: Ingests standard `.vtt`, `.srt`, `.json`, or text transcripts with timestamps.
3. **Document ID Derivation**:
   - Follows Sanity datastore rules by sanitizing IDs to allowed characters (`a-z`, `A-Z`, `0-9`, `_`, `-`, `.`).
   - Formats IDs deterministically: `video.yt_${videoId}`, `video.vimeo_${videoId}`, `video.bunny_${libraryId}_${videoId}`, or `video.${sanitizedId}`.
4. **Chunking & Chapter Guidelines**:
   - **Chapters (First-Stage Matching)**: Normalized to `{ _key, startSeconds, label }`, ordered chronologically, ensuring an initial chapter at 0s.
   - **Chunks (Second-Stage Fallback)**: Transcript text split into short, coherent timestamped slices (~15–45 seconds each or sentence/segment-based boundaries) with `{ _key, startSeconds, text }`. Full transcripts are never stored in a single monolithic field.
5. **CLI Capabilities**:
   - Ingest single video URL with optional caption/transcript files or text.
   - Batch ingest all lessons in the Sanity dataset or seed dataset.
   - Dry-run mode (`--dry-run`) to preview chapters and chunks without modifying Sanity.
   - File output mode (`--output=<file.ndjson|json>`) to export generated video documents.
   - Live mutation mode (`--write`) using Sanity mutate API or client with token.

---

## 5. Files to Touch & Create

- **New Pipeline Modules**:
  - `scripts/video-pipeline/types.ts`: Pipeline types for providers, parsed cues, chapters, chunks, and video documents.
  - `scripts/video-pipeline/url-parser.ts`: URL parsing and ID extraction for YouTube, Vimeo, and Bunny.
  - `scripts/video-pipeline/subtitle-parser.ts`: Parser for VTT, SRT, WebVTT, JSON, and timestamped transcript text into normalized cues.
  - `scripts/video-pipeline/chunker.ts`: Intelligent chunking engine that groups subtitle cues into compact, timestamped slices.
  - `scripts/video-pipeline/chapter-extractor.ts`: Chapter parser extracting timestamps and labels from descriptions, VTT chapters, or structured lists.
  - `scripts/video-pipeline/youtube-fetcher.ts`: Automated caption and metadata fetcher for YouTube videos.
  - `scripts/video-pipeline/pipeline.ts`: Core pipeline orchestrator combining URL parsing, caption fetching/parsing, chapter extraction, chunking, and document generation.
  - `scripts/video-pipeline/sanity-writer.ts`: Batch Sanity client/mutation writer for uploading video documents.
  - `scripts/video-pipeline/cli.ts`: Standalone CLI runner with arguments for `--url`, `--file`, `--all`, `--dry-run`, `--write`, `--output`.
- **Package Scripts**:
  - `package.json`: Add `video:ingest`, `video:ingest:all`, and `video:ingest:dry-run` scripts.
- **Documentation**:
  - `scripts/video-pipeline/README.md`: Usage guide and CLI documentation with examples for YouTube, Vimeo, and Bunny.

---

## 6. Requirements & Acceptance Criteria

1. **Provider Support**: Seamlessly parses video URLs and IDs for YouTube, Vimeo, and Bunny Stream.
2. **Transcript Chunking**: Converts transcripts into timestamped chunks (`{ _key, startSeconds, text }`) without storing whole monolithic transcripts.
3. **Chapter Extraction**: Builds clean chapter arrays (`{ _key, startSeconds, label }`) sorted by start timestamp.
4. **Deterministic Sanity IDs**: Uses safe, deterministic `_id` values derived from provider video IDs with invalid characters stripped.
5. **Offline & Non-blocking**: Pipeline operates strictly as an offline tool without executing in the web request path.
6. **Playback Compatibility**: Resulting video documents and timestamps integrate directly with `components/lesson/video-embed.tsx` seeking behavior.
7. **Type & Lint Checks**: TypeScript compiles cleanly (`npx tsc --noEmit`) and ESLint passes without errors (`npm run lint`).

---

## 7. Checks to Run

1. `npx tsc --noEmit`
2. `npm run lint`
3. Execute dry-run ingestion on sample video URLs (YouTube, Vimeo, Bunny).
4. Execute batch ingestion to generate `video` documents and verify chunk/chapter structure.

---

## 8. Manual Test Steps

1. Run CLI for a YouTube video URL:
   `npx tsx scripts/video-pipeline/cli.ts --url="https://www.youtube.com/watch?v=WKfPctdIDek" --title="Fetching Data in Server Components" --dry-run`
   Verify output displays parsed video ID, generated chapters, and timestamped chunks.
2. Run CLI with a custom transcript/VTT file or chapter list:
   `npx tsx scripts/video-pipeline/cli.ts --url="https://vimeo.com/76979871" --title="Sample Vimeo Lesson" --dry-run`
   Verify Vimeo ID extraction and valid document formatting.
3. Run CLI with a Bunny stream URL:
   `npx tsx scripts/video-pipeline/cli.ts --url="https://iframe.mediadelivery.net/embed/12345/abcde-67890" --title="Sample Bunny Lesson" --dry-run`
   Verify Bunny library/video ID extraction and valid document formatting.
4. Run full batch ingestion across all lessons:
   `npm run video:ingest:all -- --dry-run`
   Verify summary counts of video documents, chapters, and chunks produced.
5. Execute live write to Sanity (if tokens present) or export to NDJSON and verify documents adhere to Sanity Studio `video` schema.
