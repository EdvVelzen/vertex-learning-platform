import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const video = defineType({
  name: 'video',
  title: 'Video Intelligence',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'Derived unique ID from the video provider (e.g. YouTube ID)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'Canonical video URL',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Source Title',
      type: 'string',
      description: 'Title from provider or original recording',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (Seconds)',
      type: 'number',
      description: 'Total video duration in seconds',
    }),
    defineField({
      name: 'chapters',
      title: 'Table of Contents (Chapters)',
      type: 'array',
      description: 'Structured chapter markers for fast first-stage timestamp lookup',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Time (Seconds)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'label',
              title: 'Chapter Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              label: 'label',
              startSeconds: 'startSeconds',
            },
            prepare({ label, startSeconds }) {
              const mins = Math.floor((startSeconds || 0) / 60)
              const secs = (startSeconds || 0) % 60
              return {
                title: label || 'Untitled Chapter',
                subtitle: `${mins}:${secs.toString().padStart(2, '0')}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript Chunks',
      type: 'array',
      description: 'Timestamped transcript slices for second-stage fallback matching',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'transcriptChunk',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Time (Seconds)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'text',
              title: 'Transcript Text',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url',
      chapters: 'chapters',
    },
    prepare({ title, url, chapters }) {
      const chapterCount = Array.isArray(chapters) ? chapters.length : 0
      return {
        title: title || url || 'Video Intelligence Record',
        subtitle: `${chapterCount} chapter${chapterCount === 1 ? '' : 's'}`,
        media: PlayIcon,
      }
    },
  },
})
