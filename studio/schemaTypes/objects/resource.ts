import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          { title: 'Code Repository', value: 'repo' },
          { title: 'Documentation / Notes', value: 'docs' },
          { title: 'PDF / Cheat Sheet', value: 'pdf' },
          { title: 'External Tool / Link', value: 'link' },
          { title: 'Project Assets / Download', value: 'asset' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) =>
        rule.required().error('A resource title is required.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['http', 'https'] })
          .error('A valid web URL is required.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      url: 'url',
    },
    prepare({ title, subtitle, url }) {
      return {
        title: title || 'Untitled Resource',
        subtitle: subtitle ? `[${subtitle.toUpperCase()}] ${url || ''}` : url,
        media: LinkIcon,
      }
    },
  },
})
