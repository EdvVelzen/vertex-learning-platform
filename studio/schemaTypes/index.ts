import { type SchemaTypeDefinition } from 'sanity'

// Documents
import { category } from './documents/category'
import { course } from './documents/course'
import { instructor } from './documents/instructor'
import { lesson } from './documents/lesson'
import { video } from './documents/video'
import { agentContext } from './documents/agentContext'

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
    video,
    instructor,
    category,
    agentContext,

    // Objects
    moduleType,
    learningOutcome,
    resource,
    blockContent,
  ],
}
