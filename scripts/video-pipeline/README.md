# Vertex Offline Video Ingestion Pipeline

The **Vertex Video Ingestion Pipeline** is an offline data processing tool that ingests transcripts and chapter markers from video providers (YouTube, Vimeo, and Bunny Stream) into dedicated Sanity `video` documents.

---

## 1. How It Works

1. **Provider Resolution & ID Derivation**:
   - Parses URLs for **YouTube**, **Vimeo**, and **Bunny Stream** (and generic sources).
   - Derives deterministic, datastore-safe IDs: `video.yt_{id}`, `video.vimeo_{id}`, `video.bunny_{lib}_{id}`.
2. **Table of Contents (Chapters)**:
   - Extracted from author descriptions, timestamps (`01:23 Topic`), VTT chapter tracks, or synthesized from lesson key points.
   - Used for **first-stage matching** during intelligent search.
3. **Transcript Chunks**:
   - Parses VTT, SRT, JSON, or timestamped text into compact, timestamped slices (~15-45s each).
   - Used for **second-stage fallback matching** during search without overflowing LLM context windows.
4. **Sanity Integration**:
   - Mutations use `createOrReplace` to ensure idempotent, repeatable runs.
   - Runs strictly **offline** — never blocks the Next.js request path.

---

## 2. Usage & CLI Options

```bash
npx tsx scripts/video-pipeline/cli.ts [options]
```

### Options

| Flag | Description |
|---|---|
| `--url=<url>` | Single video URL to ingest (YouTube, Vimeo, Bunny) |
| `--title=<title>` | Title of the video |
| `--duration=<sec>` | Video duration in seconds |
| `--transcript=<file>` | Path to subtitle/transcript file (`.vtt`, `.srt`, `.json`, `.txt`) |
| `--chapters=<file>` | Path to chapter markers file (timestamped text) |
| `--all` | Batch ingest all lesson videos across the platform |
| `--file=<json>` | Batch ingest from a JSON array file of video definitions |
| `--live-captions` | Attempt to fetch live captions from public YouTube video |
| `--dry-run` | Preview generated document structure without writing to Sanity |
| `--write` | Write mutations directly to Sanity dataset via API |
| `--output=<path>` | Export generated documents to `.ndjson` or `.json` |

---

## 3. Examples

### Ingest a YouTube Video (Dry Run)
```bash
npx tsx scripts/video-pipeline/cli.ts --url="https://www.youtube.com/watch?v=WKfPctdIDek" --title="Data Fetching in Server Components" --dry-run
```

### Ingest a Vimeo Video with VTT Subtitles
```bash
npx tsx scripts/video-pipeline/cli.ts --url="https://vimeo.com/76979871" --title="Vimeo Lesson" --transcript="path/to/subtitles.vtt" --dry-run
```

### Ingest a Bunny Stream Video
```bash
npx tsx scripts/video-pipeline/cli.ts --url="https://iframe.mediadelivery.net/embed/12345/abcde-67890" --title="Bunny Lesson" --dry-run
```

### Batch Ingest All Lessons & Export to NDJSON
```bash
npm run video:ingest:all -- --output="scripts/seed/video-intelligence.ndjson"
```

### Batch Ingest All Lessons & Write to Sanity
```bash
npm run video:ingest:all -- --write
```
