import { type SchemaTypeDefinition } from 'sanity'

// Documents
import { category } from './documents/category'
import { course } from './documents/course'
import { instructor } from './documents/instructor'
import { lesson } from './documents/lesson'

// Objects
import { blockContent } from './objects/blockContent'
import { learningOutcome } from './objects/learningOutcome'
import { moduleType } from './objects/module'
import { resource } from './objects/resource'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    course,
    lesson,
    instructor,
    category,

    // Objects
    moduleType,
    learningOutcome,
    resource,
    blockContent,
  ],
}
