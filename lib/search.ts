import { client } from "@/sanity/lib/client";
import {
  SearchResult,
  VideoSearchResult,
  LessonSearchResult,
  SearchApiResponse,
  SanityImageReference,
} from "@/sanity/lib/types";

interface RawLessonMatch {
  _id: string;
  title: string;
  slug?: { current: string };
  videoUrl?: string;
  thumbnail?: SanityImageReference;
  duration?: number;
  keyPoints?: string[];
  notesText?: string;
  course?: {
    _id: string;
    title: string;
    slug?: { current: string };
    coverImage?: SanityImageReference;
    modules?: Array<{
      _key?: string;
      title: string;
      summary?: string;
      lessons?: Array<{
        _id: string;
        title: string;
        slug?: { current: string };
      }>;
    }>;
  };
}

interface RawVideoMatch {
  _id: string;
  videoId: string;
  url: string;
  title?: string;
  duration?: number;
  chapters?: Array<{
    _key?: string;
    startSeconds: number;
    label: string;
  }>;
  chunks?: Array<{
    _key?: string;
    startSeconds: number;
    text: string;
  }>;
  lesson?: RawLessonMatch;
}

// In-memory cache for initial schema context from Sanity Context MCP endpoint
let initialContextCache: string | null = null;
let lastInitialContextFetch = 0;

/**
 * Fetch and cache initial schema context from Sanity Context MCP
 */
export async function getMcpInitialContext(): Promise<string | null> {
  const now = Date.now();
  if (initialContextCache && now - lastInitialContextFetch < 1000 * 60 * 15) {
    return initialContextCache;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "k877xljb";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!token) return null;

  try {
    const url = `https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}/initial-context`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 900 },
    });

    if (res.ok) {
      const data = await res.text();
      initialContextCache = data;
      lastInitialContextFetch = now;
      return data;
    }
  } catch (error) {
    console.warn("Failed to fetch initial context from Sanity MCP:", error);
  }

  return null;
}

/**
 * Helper to derive module number, lesson number, and module title from course curriculum
 */
function findLessonPlacement(
  course: RawLessonMatch["course"],
  lessonId: string,
  lessonSlug?: string
): { moduleIndex: number; lessonIndex: number; moduleTitle: string; lessonLabel: string; moduleLabel: string } {
  if (!course?.modules || !Array.isArray(course.modules)) {
    return {
      moduleIndex: 1,
      lessonIndex: 1,
      moduleTitle: "General",
      lessonLabel: "Lesson 1.1",
      moduleLabel: "Module 1",
    };
  }

  for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
    const mod = course.modules[mIdx];
    const modNum = mIdx + 1;
    if (mod.lessons && Array.isArray(mod.lessons)) {
      for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
        const l = mod.lessons[lIdx];
        if (l._id === lessonId || (lessonSlug && l.slug?.current === lessonSlug)) {
          const lNum = lIdx + 1;
          return {
            moduleIndex: modNum,
            lessonIndex: lNum,
            moduleTitle: mod.title || `Module ${modNum}`,
            lessonLabel: `Lesson ${modNum}.${lNum}`,
            moduleLabel: `Module ${modNum}`,
          };
        }
      }
    }
  }

  return {
    moduleIndex: 1,
    lessonIndex: 1,
    moduleTitle: "Course Curriculum",
    lessonLabel: "Lesson 1.1",
    moduleLabel: "Module 1",
  };
}

/**
 * Formats seconds into MM:SS
 */
function formatTimestampSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Main search engine: queries Sanity for video moments and lesson topics, merges and ranks them.
 */
export async function searchContent(
  query: string,
  sort: string = "relevant"
): Promise<SearchApiResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: "",
      totalCount: 0,
      courseCount: 0,
      results: [],
    };
  }

  // Tokenize query words
  const terms = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  const wildcardPattern = terms.length > 0 ? `*${terms.join("* *")}*` : `*${trimmed}*`;
  const singleWildcard = `*${trimmed}*`;

  // Fetch lessons, videos, and all courses in parallel
  const [rawLessons, rawVideos, allCourses] = await Promise.all([
    client.fetch<RawLessonMatch[]>(
      `*[_type == "lesson" && !(_id in path("drafts.**")) && (
        title match $term ||
        title match $singleTerm ||
        keyPoints[] match $term ||
        keyPoints[] match $singleTerm ||
        pt::text(notes) match $term ||
        pt::text(notes) match $singleTerm
      )] {
        _id,
        title,
        slug,
        videoUrl,
        thumbnail,
        duration,
        keyPoints,
        "notesText": pt::text(notes),
        "course": *[_type == "course" && references(^._id)][0] {
          _id,
          title,
          slug,
          coverImage,
          modules[]{
            _key,
            title,
            summary,
            lessons[]->{
              _id,
              title,
              slug
            }
          }
        }
      }`,
      { term: wildcardPattern, singleTerm: singleWildcard }
    ),
    client.fetch<RawVideoMatch[]>(
      `*[_type == "video" && !(_id in path("drafts.**")) && (
        chapters[].label match $term ||
        chapters[].label match $singleTerm ||
        chunks[].text match $term ||
        chunks[].text match $singleTerm ||
        title match $term ||
        title match $singleTerm
      )] {
        _id,
        videoId,
        url,
        title,
        duration,
        chapters[]{
          _key,
          startSeconds,
          label
        },
        chunks[]{
          _key,
          startSeconds,
          text
        },
        "lesson": *[_type == "lesson" && videoUrl == ^.url][0] {
          _id,
          title,
          slug,
          thumbnail,
          duration,
          keyPoints,
          "notesText": pt::text(notes),
          "course": *[_type == "course" && references(^._id)][0] {
            _id,
            title,
            slug,
            coverImage,
            modules[]{
              _key,
              title,
              summary,
              lessons[]->{
                _id,
                title,
                slug
              }
            }
          }
        }
      }`,
      { term: wildcardPattern, singleTerm: singleWildcard }
    ),
    client.fetch<Array<{
      _id: string;
      title: string;
      slug?: { current: string };
      coverImage?: SanityImageReference;
      modules?: Array<{
        _key?: string;
        title: string;
        summary?: string;
        lessons?: Array<{
          _id: string;
          title: string;
          slug?: { current: string };
        }>;
      }>;
    }>>(`*[_type == "course" && !(_id in path("drafts.**"))]{
      _id,
      title,
      slug,
      coverImage,
      modules[]{
        _key,
        title,
        summary,
        lessons[]->{
          _id,
          title,
          slug
        }
      }
    }`)
  ]);

  // Build helper map of lesson ID -> Course & placement
  const lessonToCourseMap = new Map<string, { course: RawLessonMatch["course"]; placement: ReturnType<typeof findLessonPlacement> }>();
  if (allCourses) {
    for (const c of allCourses) {
      if (c.modules) {
        for (const m of c.modules) {
          if (m.lessons) {
            for (const l of m.lessons) {
              const placement = findLessonPlacement(c, l._id, l.slug?.current);
              lessonToCourseMap.set(l._id, { course: c, placement });
              if (l.slug?.current) {
                lessonToCourseMap.set(l.slug.current, { course: c, placement });
              }
            }
          }
        }
      }
    }
  }

  const queryLower = trimmed.toLowerCase();
  const results: SearchResult[] = [];
  const seenKeys = new Set<string>();

  // 1. Process Video Moments (chapters first, then transcript chunks)
  if (rawVideos && rawVideos.length > 0) {
    for (const vid of rawVideos) {
      const lesson = vid.lesson;
      if (!lesson) continue;

      const courseInfo = lessonToCourseMap.get(lesson._id) || (lesson.slug?.current ? lessonToCourseMap.get(lesson.slug.current) : null);
      const course = lesson.course || courseInfo?.course;
      const placement = courseInfo?.placement || findLessonPlacement(course, lesson._id, lesson.slug?.current);

      const chapters = vid.chapters || [];
      const chunks = vid.chunks || [];

      // Stage 1: Check matching chapters (clean table of contents)
      const matchingChapters = chapters.filter((ch) =>
        terms.some((t) => ch.label.toLowerCase().includes(t)) ||
        ch.label.toLowerCase().includes(queryLower)
      );

      if (matchingChapters.length > 0) {
        for (const ch of matchingChapters) {
          const key = `video-${lesson._id}-${ch.startSeconds}`;
          if (seenKeys.has(key)) continue;
          seenKeys.add(key);

          const isExact = ch.label.toLowerCase().includes(queryLower);
          const score = isExact ? 100 : 80;

          results.push({
            id: key,
            type: "video",
            title: ch.label,
            summary: lesson.notesText || `Learn about ${ch.label} in ${placement.moduleTitle}.`,
            lessonLabel: placement.lessonLabel,
            moduleLabel: placement.moduleTitle,
            timestamp: formatTimestampSeconds(ch.startSeconds),
            startSeconds: ch.startSeconds,
            duration: lesson.duration || vid.duration,
            thumbnail: lesson.thumbnail,
            course: {
              title: course?.title || "Vertex Course",
              slug: course?.slug?.current || "course",
              coverImage: course?.coverImage,
            },
            lessonSlug: lesson.slug?.current || lesson._id,
            courseSlug: course?.slug?.current,
            relevanceScore: score,
          } as VideoSearchResult);
        }
      } else {
        // Stage 2: Fall back to matching transcript chunks
        const matchingChunks = chunks.filter((chunk) =>
          terms.some((t) => chunk.text.toLowerCase().includes(t)) ||
          chunk.text.toLowerCase().includes(queryLower)
        );

        if (matchingChunks.length > 0) {
          const topChunk = matchingChunks[0];
          const key = `video-${lesson._id}-${topChunk.startSeconds}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              id: key,
              type: "video",
              title: lesson.title,
              summary: topChunk.text,
              lessonLabel: placement.lessonLabel,
              moduleLabel: placement.moduleTitle,
              timestamp: formatTimestampSeconds(topChunk.startSeconds),
              startSeconds: topChunk.startSeconds,
              duration: lesson.duration || vid.duration,
              thumbnail: lesson.thumbnail,
              course: {
                title: course?.title || "Vertex Course",
                slug: course?.slug?.current || "course",
                coverImage: course?.coverImage,
              },
              lessonSlug: lesson.slug?.current || lesson._id,
              courseSlug: course?.slug?.current,
              relevanceScore: 60,
            } as VideoSearchResult);
          }
        }
      }
    }
  }

  // 2. Process Lesson Results (topic, title, key takeaways)
  if (rawLessons && rawLessons.length > 0) {
    for (const lesson of rawLessons) {
      const courseInfo = lessonToCourseMap.get(lesson._id) || (lesson.slug?.current ? lessonToCourseMap.get(lesson.slug.current) : null);
      const course = lesson.course || courseInfo?.course;
      const placement = courseInfo?.placement || findLessonPlacement(course, lesson._id, lesson.slug?.current);

      const key = `lesson-${lesson._id}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      const titleLower = lesson.title.toLowerCase();
      const isExactTitle = titleLower.includes(queryLower);
      const hasKeyPointMatch = lesson.keyPoints?.some((kp) => kp.toLowerCase().includes(queryLower));

      let score = 50;
      if (isExactTitle) score = 95;
      else if (hasKeyPointMatch) score = 75;

      results.push({
        id: key,
        type: "lesson",
        title: lesson.title,
        summary: lesson.notesText
          ? lesson.notesText.slice(0, 160) + "..."
          : `Explore ${lesson.title} in ${placement.moduleTitle}.`,
        moduleLabel: placement.moduleLabel,
        keyPoints: lesson.keyPoints && lesson.keyPoints.length > 0
          ? lesson.keyPoints.slice(0, 3)
          : ["Core concepts and practical implementation", "Best practices and error handling", "Production considerations"],
        course: {
          title: course?.title || "Vertex Course",
          slug: course?.slug?.current || "course",
          coverImage: course?.coverImage,
        },
        lessonSlug: lesson.slug?.current || lesson._id,
        courseSlug: course?.slug?.current,
        relevanceScore: score,
      } as LessonSearchResult);
    }
  }

  // 3. Sorting
  if (sort === "duration-asc") {
    results.sort((a, b) => {
      const durA = (a as VideoSearchResult).startSeconds ?? 0;
      const durB = (b as VideoSearchResult).startSeconds ?? 0;
      return durA - durB;
    });
  } else if (sort === "duration-desc") {
    results.sort((a, b) => {
      const durA = (a as VideoSearchResult).startSeconds ?? 0;
      const durB = (b as VideoSearchResult).startSeconds ?? 0;
      return durB - durA;
    });
  } else {
    // Default: Most Relevant
    results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  // Distinct courses count
  const courseTitles = new Set(results.map((r) => r.course.title).filter(Boolean));

  return {
    query: trimmed,
    totalCount: results.length,
    courseCount: courseTitles.size,
    results,
  };
}
