import type { PortableTextBlock } from 'sanity'

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityImageReference {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface LearningOutcome {
  _key?: string
  icon?: string
  title: string
  description?: string
}

export interface Resource {
  _key?: string
  type: 'repo' | 'docs' | 'pdf' | 'link' | 'asset'
  title: string
  description?: string
  url: string
}

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: SanitySlug
  description?: string
  courseCount?: number
}

export interface Instructor {
  _id: string
  _type: 'instructor'
  name: string
  slug: SanitySlug
  photo: SanityImageReference
  expertise: string[] | string
  bio?: PortableTextBlock[] | string
  courseCount?: number
}

export interface LessonSummary {
  _id: string
  _type?: 'lesson'
  title: string
  slug: SanitySlug
  duration?: number
  isFreePreview?: boolean
  freePreview?: boolean
  studentCount?: number
}

export interface Module {
  _key?: string
  _type?: 'module'
  title: string
  summary?: string
  moduleDuration?: number
  lessonCount?: number
  lessons: LessonSummary[]
}

export interface CourseSummary {
  _id: string
  _type?: 'course'
  _createdAt?: string
  title: string
  slug: SanitySlug
  summary: string
  coverImage: SanityImageReference
  level:
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced'
    | 'All Levels'
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'all-levels'
  price: number
  isPopular?: boolean
  popular?: boolean
  studentCount?: number
  category?: Category
  instructor?: Instructor
  moduleCount?: number
  lessonCount?: number
  totalDuration?: number
}

export interface CourseDetail extends CourseSummary {
  learningOutcomes?: LearningOutcome[]
  modules: Module[]
}

export interface LessonDetail {
  _id: string
  _type?: 'lesson'
  title: string
  slug: SanitySlug
  videoUrl?: string
  thumbnail?: SanityImageReference
  duration?: number
  isFreePreview?: boolean
  freePreview?: boolean
  studentCount?: number
  keyPoints?: string[]
  proTip?: string
  notes?: PortableTextBlock[]
  resources?: Resource[]
  course?: {
    _id: string
    title: string
    slug: SanitySlug
    coverImage?: SanityImageReference
    level?: string
    studentCount?: number
    instructor?: Instructor
    modules: Module[]
    moduleCount?: number
    lessonCount?: number
    totalDuration?: number
  }
}

export interface VideoChapter {
  _key?: string
  startSeconds: number
  label: string
}

export interface VideoChunk {
  _key?: string
  startSeconds: number
  text: string
}

export interface VideoDocument {
  _id: string
  _type: 'video'
  videoId: string
  url: string
  title?: string
  duration?: number
  chapters?: VideoChapter[]
  chunks?: VideoChunk[]
}

export interface AgentContextDocument {
  _id: string
  _type: 'sanity.agentContext'
  title: string
  slug: SanitySlug
  instructions?: string
  groqFilter?: string
}

export interface VideoSearchResult {
  id: string
  type: 'video'
  title: string
  summary: string
  lessonLabel: string
  moduleLabel: string
  timestamp: string
  startSeconds: number
  duration?: number
  thumbnail?: SanityImageReference | string
  course: {
    title: string
    slug?: SanitySlug | string
    icon?: string
    coverImage?: SanityImageReference
  }
  lessonSlug: string
  courseSlug?: string
  relevanceScore?: number
}

export interface LessonSearchResult {
  id: string
  type: 'lesson'
  title: string
  summary: string
  moduleLabel: string
  keyPoints?: string[]
  course: {
    title: string
    slug?: SanitySlug | string
    icon?: string
    coverImage?: SanityImageReference
  }
  lessonSlug: string
  courseSlug?: string
  relevanceScore?: number
}

export type SearchResult = VideoSearchResult | LessonSearchResult

export interface SearchApiResponse {
  query: string
  totalCount: number
  courseCount: number
  results: SearchResult[]
}

