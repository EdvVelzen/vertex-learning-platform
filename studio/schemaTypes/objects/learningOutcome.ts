import { defineField, defineType } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons'

export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning Outcome',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon Name / Identifier',
      type: 'string',
      description:
        'Lucide icon name (e.g. Code, Database, Shield, Zap, Sparkles) or emoji',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) =>
        rule.required().error('A learning outcome title is required.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Outcome',
        subtitle: subtitle || 'No description',
        media: CheckmarkCircleIcon,
      }
    },
  },
})
