#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { ingestVideo, ingestBatchVideos } from './pipeline';
import { IngestVideoOptions, SanityVideoDocument } from './types';
import {
  writeVideoDocumentsToSanity,
  fetchLessonsFromSanity,
  exportVideoDocumentsToFile,
  getSanityConfig,
} from './sanity-writer';

/**
 * CLI Argument Parser
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string | boolean> = {};

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx > -1) {
        const key = arg.slice(2, eqIdx);
        const val = arg.slice(eqIdx + 1);
        parsed[key] = val;
      } else {
        const key = arg.slice(2);
        parsed[key] = true;
      }
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`
===================================================================
VERTEX OFFLINE VIDEO INGESTION PIPELINE
===================================================================

Usage:
  npx tsx scripts/video-pipeline/cli.ts [options]

Options:
  --url=<url>            Ingest a single video URL (YouTube, Vimeo, Bunny Stream)
  --title=<title>        Title of the video (optional)
  --duration=<seconds>   Duration in seconds (optional)
  --transcript=<path>    Path to subtitle/transcript file (.vtt, .srt, .json, .txt)
  --chapters=<path>      Path to chapter markers file (.txt, timestamps)
  --all                  Batch ingest all lesson videos across the platform
  --file=<path>          Batch ingest from a JSON array file of video definitions
  --live-captions        Attempt to fetch live captions (YouTube only)
  --dry-run              Preview documents, chapters, and chunks without writing
  --write                Write mutations directly to Sanity dataset via API
  --output=<path>        Export generated documents to .ndjson or .json file
  --help                 Show this help message

Examples:
  1. Ingest a YouTube video with dry run:
     npx tsx scripts/video-pipeline/cli.ts --url="https://www.youtube.com/watch?v=WKfPctdIDek" --title="Data Fetching in Server Components" --dry-run

  2. Ingest a Vimeo video with custom VTT transcript and chapter file:
     npx tsx scripts/video-pipeline/cli.ts --url="https://vimeo.com/76979871" --transcript="subtitles.vtt" --chapters="chapters.txt" --dry-run

  3. Ingest a Bunny Stream embed URL:
     npx tsx scripts/video-pipeline/cli.ts --url="https://iframe.mediadelivery.net/embed/12345/abcde-67890" --title="Bunny Stream Lesson" --dry-run

  4. Batch ingest all lessons and output NDJSON:
     npx tsx scripts/video-pipeline/cli.ts --all --output="scripts/seed/video-intelligence.ndjson"

  5. Batch ingest all lessons and write to Sanity:
     npx tsx scripts/video-pipeline/cli.ts --all --write
===================================================================
`);
}

function extractPlainText(blocks: unknown): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .filter((b): b is { _type: string; children?: Array<{ text?: string }> } => b && typeof b === 'object' && '_type' in b && b._type === 'block' && Array.isArray((b as { children?: unknown[] }).children))
    .map(b => (b.children || []).map(c => c.text || '').join(''))
    .join(' ');
}

async function main() {
  const flags = parseArgs();

  if (flags.help || (!flags.url && !flags.all && !flags.file)) {
    printHelp();
    return;
  }

  const isDryRun = flags['dry-run'] === true || flags.dryRun === true;
  const shouldWrite = flags.write === true;
  const outputPath = typeof flags.output === 'string' ? flags.output : undefined;
  const liveCaptions = flags['live-captions'] === true;

  console.log('🚀 Starting Vertex Video Ingestion Pipeline...');

  const documentsToSave: SanityVideoDocument[] = [];

  // Mode 1: Single URL
  if (typeof flags.url === 'string') {
    const options: IngestVideoOptions = {
      url: flags.url,
      title: typeof flags.title === 'string' ? flags.title : undefined,
      duration: flags.duration ? parseInt(String(flags.duration), 10) : undefined,
      transcriptFile: typeof flags.transcript === 'string' ? flags.transcript : undefined,
      chaptersFile: typeof flags.chapters === 'string' ? flags.chapters : undefined,
      fetchLiveCaptions: liveCaptions,
    };

    console.log(`\n📹 Ingesting video: ${options.url}`);
    const result = await ingestVideo(options);

    if (!result.success) {
      console.error(`❌ Ingestion failed: ${result.error}`);
      process.exit(1);
    }

    console.log(`\n✅ Ingestion Successful!`);
    console.log(`  - Document ID:  ${result.document._id}`);
    console.log(`  - Provider:     ${result.provider}`);
    console.log(`  - Video ID:     ${result.document.videoId}`);
    console.log(`  - Title:        ${result.document.title}`);
    console.log(`  - Duration:     ${result.document.duration}s`);
    console.log(`  - Chapters:     ${result.chapterCount}`);
    console.log(`  - Chunks:       ${result.chunkCount}`);

    if (result.warnings && result.warnings.length > 0) {
      console.log(`  ⚠️ Warnings:`);
      result.warnings.forEach(w => console.log(`     • ${w}`));
    }

    console.log(`\n📋 Chapters Table of Contents:`);
    result.document.chapters.forEach(ch => {
      const mins = Math.floor(ch.startSeconds / 60);
      const secs = (ch.startSeconds % 60).toString().padStart(2, '0');
      console.log(`   [${mins}:${secs}] ${ch.label}`);
    });

    console.log(`\n📝 Transcript Chunks Preview (first 5 of ${result.chunkCount}):`);
    result.document.chunks.slice(0, 5).forEach((chunk, i) => {
      const mins = Math.floor(chunk.startSeconds / 60);
      const secs = (chunk.startSeconds % 60).toString().padStart(2, '0');
      console.log(`   ${i + 1}. [${mins}:${secs}] "${chunk.text.slice(0, 80)}${chunk.text.length > 80 ? '...' : ''}"`);
    });

    documentsToSave.push(result.document);
  }

  // Mode 2: Ingest from JSON file
  if (typeof flags.file === 'string') {
    const resolved = path.resolve(process.cwd(), flags.file);
    if (!fs.existsSync(resolved)) {
      console.error(`❌ Input file not found: ${flags.file}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(resolved, 'utf-8');
    const items: IngestVideoOptions[] = JSON.parse(fileContent);
    console.log(`\n📁 Loaded ${items.length} video definitions from ${flags.file}`);

    const batch = await ingestBatchVideos(items);
    console.log(`\n📊 Batch Ingestion Complete: ${batch.succeeded}/${batch.total} succeeded.`);
    batch.results.forEach(r => {
      if (r.success) documentsToSave.push(r.document);
    });
  }

  // Mode 3: Batch ingest all lessons
  if (flags.all === true) {
    console.log('\n📚 Batch ingesting all lessons...');
    let lessonInputs: IngestVideoOptions[] = [];

    // Check if Sanity dataset query is possible, or read from local seed files
    const config = getSanityConfig();
    let fetchedFromRemote = false;

    if (config.token) {
      try {
        console.log(`  Connecting to Sanity project ${config.projectId} (${config.dataset})...`);
        const lessons = await fetchLessonsFromSanity(config);
        if (lessons.length > 0) {
          fetchedFromRemote = true;
          console.log(`  Fetched ${lessons.length} lessons from Sanity.`);
          lessonInputs = lessons.map(l => ({
            url: l.videoUrl || `https://www.youtube.com/watch?v=${l.slug?.current || l._id}`,
            title: l.title,
            duration: l.duration,
            keyPoints: l.keyPoints,
            notesText: extractPlainText(l.notes),
            fetchLiveCaptions: liveCaptions,
          }));
        }
      } catch (err) {
        console.log(`  Could not query live Sanity (${err instanceof Error ? err.message : String(err)}). Using local seed dataset.`);
      }
    }

    if (!fetchedFromRemote) {
      const seedNdjsonPath = path.resolve(process.cwd(), 'scripts/seed/seed.ndjson');
      const videosJsonPath = path.resolve(process.cwd(), 'scripts/seed/videos.json');

      if (fs.existsSync(seedNdjsonPath)) {
        const seedNdjson = fs.readFileSync(seedNdjsonPath, 'utf-8')
          .split('\n')
          .filter(Boolean)
          .map(line => JSON.parse(line));

        let videosMap: Record<string, { id?: string; duration?: number; title?: string }> = {};
        if (fs.existsSync(videosJsonPath)) {
          videosMap = JSON.parse(fs.readFileSync(videosJsonPath, 'utf-8'));
        }

        const lessons = seedNdjson.filter(doc => doc._type === 'lesson');
        console.log(`  Loaded ${lessons.length} lessons from local seed data.`);

        lessonInputs = lessons.map(l => {
          const slug = l.slug?.current;
          const meta = slug ? videosMap[slug] : undefined;
          const videoId = meta?.id || (l.videoUrl ? l.videoUrl.split('v=')[1] : slug);
          const videoUrl = l.videoUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');

          return {
            url: videoUrl,
            title: meta?.title || l.title,
            duration: l.duration || meta?.duration || 600,
            keyPoints: l.keyPoints || [],
            notesText: extractPlainText(l.notes),
            fetchLiveCaptions: liveCaptions,
          };
        }).filter(item => Boolean(item.url));
      }
    }

    console.log(`  Processing ${lessonInputs.length} video documents...`);
    const batch = await ingestBatchVideos(lessonInputs);

    console.log(`\n📊 Batch Ingestion Summary:`);
    console.log(`  - Total Videos:     ${batch.total}`);
    console.log(`  - Succeeded:        ${batch.succeeded}`);
    console.log(`  - Failed:           ${batch.failed}`);
    const totalChapters = batch.results.reduce((sum, r) => sum + r.chapterCount, 0);
    const totalChunks = batch.results.reduce((sum, r) => sum + r.chunkCount, 0);
    console.log(`  - Total Chapters:   ${totalChapters}`);
    console.log(`  - Total Chunks:     ${totalChunks}`);

    batch.results.forEach(r => {
      if (r.success) documentsToSave.push(r.document);
    });
  }

  // Handle Output export
  if (outputPath && documentsToSave.length > 0) {
    exportVideoDocumentsToFile(documentsToSave, outputPath);
    console.log(`\n💾 Exported ${documentsToSave.length} video documents to ${outputPath}`);
  }

  // Handle Sanity Write
  if (shouldWrite && !isDryRun && documentsToSave.length > 0) {
    console.log(`\n⚡ Writing ${documentsToSave.length} video documents to Sanity...`);
    const writeResult = await writeVideoDocumentsToSanity(documentsToSave);
    if (writeResult.success) {
      console.log(`🎉 Successfully wrote ${writeResult.count} video documents to Sanity dataset!`);
    } else {
      console.error(`❌ Sanity write failed: ${writeResult.error}`);
      process.exit(1);
    }
  } else if (isDryRun) {
    console.log(`\n🔍 [Dry Run Mode]: No mutations written to Sanity.`);
  }

  console.log('\n✨ Pipeline completed successfully!\n');
}

main().catch(err => {
  console.error('Fatal pipeline error:', err);
  process.exit(1);
});
