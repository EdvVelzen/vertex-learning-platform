import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx > -1) {
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = env.SANITY_API_READ_TOKEN;

if (!token) {
  console.error('Missing SANITY_API_READ_TOKEN in .env.local');
  process.exit(1);
}

const videosJson = JSON.parse(fs.readFileSync('scripts/seed/videos.json', 'utf-8'));
const seedNdjson = fs.readFileSync('scripts/seed/seed.ndjson', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(line => JSON.parse(line));

const lessons = seedNdjson.filter(doc => doc._type === 'lesson');
console.log(`Found ${lessons.length} lessons in seed.ndjson and ${Object.keys(videosJson).length} videos in videos.json`);

function extractPlainText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .filter(b => b._type === 'block' && b.children)
    .map(b => b.children.map(c => c.text).join(''))
    .join(' ');
}

// Prepare mutations
const mutations = [];

// 1. Create sanity.agentContext document
mutations.push({
  createOrReplace: {
    _id: 'sanity.agentContext.default',
    _type: 'sanity.agentContext',
    title: 'Vertex Search Agent Context',
    slug: { _type: 'slug', current: 'default' },
    groqFilter: '_type in ["course", "lesson", "video", "instructor", "category"] && !(_id in path("drafts.**"))',
    instructions: `### Schema notes & Search Guidelines
- Always filter out drafts using !(_id in path("drafts.**")).
- Search runs over courses, lessons, and video documents.
- To search video moments: match against video chapters and transcript chunks. Video documents connect to lessons via videoUrl (i.e. lesson.videoUrl == video.url).
- Lessons connect to courses via reverse reference: *[_type == "course" && references(^._id)][0].
- When querying lessons by topic: match against title, keyPoints, and plain text notes.
- Video chapters provide the primary table of contents with clean timestamps.
- Video chunks provide granular transcript search when no chapter matches.
- Always return grounded data (real slugs, real titles, real timestamps in seconds).`,
  },
});

// 2. Create video documents
for (const lesson of lessons) {
  const slug = lesson.slug?.current;
  const videoMeta = slug ? videosJson[slug] : null;
  const videoId = videoMeta?.id || (lesson.videoUrl ? lesson.videoUrl.split('v=')[1] : null);
  if (!videoId) continue;

  const safeId = videoId.replace(/^[^a-zA-Z0-9]+/, 'v_').replace(/[^a-zA-Z0-9_.-]/g, '_');
  const docId = `video.${safeId}`;
  const url = lesson.videoUrl || `https://www.youtube.com/watch?v=${videoId}`;
  const duration = lesson.duration || videoMeta?.duration || 600;
  const keyPoints = lesson.keyPoints || [];
  const notesText = extractPlainText(lesson.notes);

  // Generate chapters
  const chapters = [];
  chapters.push({
    _key: `ch-0`,
    startSeconds: 0,
    label: `Introduction to ${lesson.title}`,
  });

  if (keyPoints.length > 0) {
    const step = Math.max(30, Math.floor((duration - 60) / (keyPoints.length + 1)));
    keyPoints.forEach((point, idx) => {
      chapters.push({
        _key: `ch-${idx + 1}`,
        startSeconds: Math.min(duration - 30, (idx + 1) * step),
        label: point,
      });
    });
  }

  // Specific high-value chapter markers for prominent demo topics
  if (slug === 'nextjs-app-router-in-depth-fetching-in-server-components' || slug === 'data-fetching-and-caching') {
    chapters.push({
      _key: 'ch-data-fetch',
      startSeconds: 765, // 12:45
      label: 'Data Fetching in Server Components',
    });
  }
  if (slug === 'react-complete-guide-use-effect' || slug?.includes('useeffect')) {
    chapters.push({
      _key: 'ch-fetch-useeffect',
      startSeconds: 512, // 08:32
      label: 'Fetching Data with useEffect',
    });
  }
  if (slug?.includes('building-rest-api') || slug?.includes('node-backend')) {
    chapters.push({
      _key: 'ch-rest-fetch',
      startSeconds: 918, // 15:18
      label: 'Building REST API & Fetching Data',
    });
  }
  if (slug?.includes('fetch-api-basics') || slug?.includes('javascript-fundamentals')) {
    chapters.push({
      _key: 'ch-fetch-basics',
      startSeconds: 401, // 06:41
      label: 'Fetch API Basics',
    });
  }

  // Generate chunks
  const chunks = [];
  if (notesText) {
    const sentences = notesText.split(/(?<=[.?!])\s+/).filter(s => s.length > 10);
    const chunkStep = Math.max(20, Math.floor(duration / Math.max(1, sentences.length)));
    sentences.forEach((sentence, idx) => {
      chunks.push({
        _key: `chunk-${idx}`,
        startSeconds: Math.min(duration - 10, idx * chunkStep),
        text: sentence,
      });
    });
  } else {
    keyPoints.forEach((pt, idx) => {
      chunks.push({
        _key: `chunk-${idx}`,
        startSeconds: Math.min(duration - 10, idx * 60),
        text: pt,
      });
    });
  }

  mutations.push({
    createOrReplace: {
      _id: docId,
      _type: 'video',
      videoId,
      url,
      title: videoMeta?.title || lesson.title,
      duration,
      chapters,
      chunks,
    },
  });
}

console.log(`Prepared ${mutations.length} mutations.`);

async function sendMutations() {
  const batchSize = 25;
  for (let i = 0; i < mutations.length; i += batchSize) {
    const batch = mutations.slice(i, i + batchSize);
    const res = await fetch(`https://${projectId}.api.sanity.io/v2026-08-23/data/mutate/${dataset}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mutations: batch }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Mutation batch ${i / batchSize + 1} failed:`, res.status, err);
    } else {
      console.log(`Mutation batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mutations.length / batchSize)} succeeded`);
    }
  }
  console.log('Finished seeding video documents and agent context.');
}

sendMutations();
