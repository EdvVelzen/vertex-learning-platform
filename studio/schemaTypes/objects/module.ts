import { defineArrayMember, defineField, defineType } from 'sanity'
import { ProjectsIcon } from '@sanity/icons'

export const moduleType = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Module Title',
      type: 'string',
      validation: (rule) => rule.required().error('A module title is required.'),
    }),
    defineField({
      name: 'summary',
      title: 'Module Summary',
      type: 'text',
      rows: 3,
      description: 'Brief overview of what this module covers.',
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      description: 'Ordered list of lessons belonging to this module.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
      validation: (rule) =>
        rule
          .min(1)
          .error('A module must contain at least one lesson reference.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lessons: 'lessons',
    },
    prepare({ title, lessons }) {
      const count = Array.isArray(lessons) ? lessons.length : 0
      return {
        title: title || 'Untitled Module',
        subtitle: `${count} ${count === 1 ? 'lesson' : 'lessons'}`,
        media: ProjectsIcon,
      }
    },
  },
})
