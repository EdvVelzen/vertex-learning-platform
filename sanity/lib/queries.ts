import { defineQuery } from 'next-sanity'

/**
 * Fragment: Instructor summary projection
 */
const instructorSummaryFragment = /* groq */ `
  _id,
  name,
  slug,
  photo,
  expertise
`

/**
 * Fragment: Category summary projection
 */
const categorySummaryFragment = /* groq */ `
  _id,
  title,
  slug
`

/**
 * Query: Fetch all courses for the catalog / courses page
 */
export const COURSES_QUERY = defineQuery(/* groq */ `
  *[_type == "course"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    summary,
    coverImage,
    level,
    price,
    "isPopular": coalesce(popular, isPopular, false),
    popular,
    studentCount,
    category->{
      ${categorySummaryFragment}
    },
    instructor->{
      ${instructorSummaryFragment}
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "totalDuration": math::sum(modules[].lessons[]->duration)
  }
`)

/**
 * Query: Fetch featured / popular courses
 */
export const FEATURED_COURSES_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && (popular == true || isPopular == true || studentCount > 0)] | order(coalesce(popular, isPopular, false) desc, studentCount desc)[0...6] {
    _id,
    _createdAt,
    title,
    slug,
    summary,
    coverImage,
    level,
    price,
    "isPopular": coalesce(popular, isPopular, false),
    popular,
    studentCount,
    category->{
      ${categorySummaryFragment}
    },
    instructor->{
      ${instructorSummaryFragment}
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "totalDuration": math::sum(modules[].lessons[]->duration)
  }
`)

/**
 * Query: Fetch a single course by its slug
 */
export const COURSE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    summary,
    coverImage,
    level,
    price,
    "isPopular": coalesce(popular, isPopular, false),
    popular,
    studentCount,
    category->{
      _id,
      title,
      slug,
      description
    },
    instructor->{
      _id,
      name,
      slug,
      photo,
      expertise,
      bio
    },
    learningOutcomes[]{
      _key,
      icon,
      title,
      description
    },
    modules[]{
      _key,
      title,
      summary,
      lessons[]->{
        _id,
        title,
        slug,
        duration,
        "isFreePreview": coalesce(freePreview, isFreePreview, false),
        freePreview,
        studentCount
      }
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "totalDuration": math::sum(modules[].lessons[]->duration)
  }
`)

/**
 * Query: Fetch a lesson by slug, resolving the parent course via reverse reference
 */
export const LESSON_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && slug.current == $lessonSlug][0] {
    _id,
    title,
    slug,
    videoUrl,
    thumbnail,
    duration,
    "isFreePreview": coalesce(freePreview, isFreePreview, false),
    freePreview,
    studentCount,
    keyPoints,
    proTip,
    notes,
    resources[]{
      _key,
      type,
      title,
      description,
      url
    },
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      slug,
      instructor->{
        _id,
        name,
        slug,
        photo,
        expertise
      },
      modules[]{
        _key,
        title,
        summary,
        lessons[]->{
          _id,
          title,
          slug,
          duration,
          "isFreePreview": coalesce(freePreview, isFreePreview, false),
          freePreview
        }
      }
    }
  }
`)

/**
 * Query: Fetch all instructors with their course count
 */
export const INSTRUCTORS_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor"] | order(name asc) {
    _id,
    name,
    slug,
    photo,
    expertise,
    bio,
    "courseCount": count(*[_type == "course" && instructor._ref == ^._id])
  }
`)

/**
 * Query: Fetch instructor detail with all courses taught
 */
export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && instructor._ref == ^._id] | order(_createdAt desc) {
      _id,
      title,
      slug,
      summary,
      coverImage,
      level,
      price,
      "isPopular": coalesce(popular, isPopular, false),
      popular,
      studentCount,
      category->{
        ${categorySummaryFragment}
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[]),
      "totalDuration": math::sum(modules[].lessons[]->duration)
    }
  }
`)

/**
 * Query: Fetch all categories with course count
 */
export const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "courseCount": count(*[_type == "course" && category._ref == ^._id])
  }
`)

/**
 * Query: Fetch category detail with associated courses
 */
export const CATEGORY_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    "courses": *[_type == "course" && category._ref == ^._id] | order(_createdAt desc) {
      _id,
      title,
      slug,
      summary,
      coverImage,
      level,
      price,
      "isPopular": coalesce(popular, isPopular, false),
      popular,
      studentCount,
      instructor->{
        ${instructorSummaryFragment}
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[]),
      "totalDuration": math::sum(modules[].lessons[]->duration)
    }
  }
`)

/**
 * Slugs queries for static paths and sitemaps
 */
export const COURSE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)][].slug.current
`)

export const LESSON_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && defined(slug.current)][].slug.current
`)

export const INSTRUCTOR_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && defined(slug.current)][].slug.current
`)

export const CATEGORY_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && defined(slug.current)][].slug.current
`)
