import fs from 'fs';
import path from 'path';
import { SanityVideoDocument } from './types';

export interface SanityConfig {
  projectId: string;
  dataset: string;
  token?: string;
}

/**
 * Reads Sanity credentials from environment variables or .env.local
 */
export function getSanityConfig(): SanityConfig {
  let envProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  let envDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  let envToken =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_TOKEN ||
    process.env.SANITY_API_READ_TOKEN;

  if (!envProjectId || !envDataset || !envToken) {
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx > -1) {
          const key = trimmed.slice(0, idx).trim();
          let val = trimmed.slice(idx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (key === 'NEXT_PUBLIC_SANITY_PROJECT_ID' && !envProjectId) envProjectId = val;
          if (key === 'NEXT_PUBLIC_SANITY_DATASET' && !envDataset) envDataset = val;
          if (
            (key === 'SANITY_API_WRITE_TOKEN' ||
              key === 'SANITY_API_TOKEN' ||
              key === 'SANITY_API_READ_TOKEN') &&
            !envToken
          ) {
            envToken = val;
          }
        }
      }
    }
  }

  return {
    projectId: envProjectId || 'k877xljb',
    dataset: envDataset || 'production',
    token: envToken,
  };
}

/**
 * Writes an array of video documents to Sanity via the mutate API using createOrReplace
 */
export async function writeVideoDocumentsToSanity(
  documents: SanityVideoDocument[],
  config?: SanityConfig
): Promise<{ success: boolean; count: number; error?: string }> {
  const cfg = config || getSanityConfig();

  if (!cfg.token) {
    return {
      success: false,
      count: 0,
      error: 'Missing Sanity API token (SANITY_API_WRITE_TOKEN / SANITY_API_READ_TOKEN). Cannot write to Sanity.',
    };
  }

  const mutations = documents.map((doc) => ({
    createOrReplace: doc,
  }));

  const batchSize = 25;
  let successCount = 0;

  for (let i = 0; i < mutations.length; i += batchSize) {
    const batch = mutations.slice(i, i + batchSize);
    const url = `https://${cfg.projectId}.api.sanity.io/v2026-08-23/data/mutate/${cfg.dataset}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mutations: batch }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          count: successCount,
          error: `Sanity mutation batch ${Math.floor(i / batchSize) + 1} failed (${res.status}): ${errorText}`,
        };
      }

      successCount += batch.length;
    } catch (err) {
      return {
        success: false,
        count: successCount,
        error: `Network error writing to Sanity: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  return {
    success: true,
    count: successCount,
  };
}

/**
 * Fetches all lessons from the Sanity dataset to extract video URLs and metadata
 */
export async function fetchLessonsFromSanity(
  config?: SanityConfig
): Promise<Array<{
  _id: string;
  title: string;
  slug?: { current: string };
  videoUrl?: string;
  duration?: number;
  keyPoints?: string[];
  notes?: unknown[];
}>> {
  const cfg = config || getSanityConfig();
  const query = encodeURIComponent(`*[_type == "lesson" && !(_id in path("drafts.**"))] {
    _id,
    title,
    slug,
    videoUrl,
    duration,
    keyPoints,
    notes
  }`);

  const url = `https://${cfg.projectId}.api.sanity.io/v2026-08-23/data/query/${cfg.dataset}?query=${query}`;
  const headers: Record<string, string> = {};
  if (cfg.token) {
    headers['Authorization'] = `Bearer ${cfg.token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch lessons from Sanity: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  return json.result || [];
}

/**
 * Exports video documents to an NDJSON or JSON file
 */
export function exportVideoDocumentsToFile(
  documents: SanityVideoDocument[],
  outputPath: string
): void {
  const resolved = path.resolve(process.cwd(), outputPath);
  const dir = path.dirname(resolved);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (outputPath.endsWith('.ndjson')) {
    const ndjsonContent = documents.map((doc) => JSON.stringify(doc)).join('\n');
    fs.writeFileSync(resolved, ndjsonContent, 'utf-8');
  } else {
    fs.writeFileSync(resolved, JSON.stringify(documents, null, 2), 'utf-8');
  }
}
