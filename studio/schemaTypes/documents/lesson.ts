import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Lesson Title',
      type: 'string',
      validation: (rule) => rule.required().error('Lesson title is required.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('A unique slug is required.'),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Supported provider embed URL (YouTube, Vimeo, Bunny)',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail / Poster Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration (in seconds)',
      type: 'number',
      description: 'Total video duration in seconds (e.g. 720 for 12m 00s)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'isFreePreview',
      title: 'Free Preview',
      type: 'boolean',
      description:
        'Allow learners to preview this lesson without an account/enrollment',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Learner Count (Display)',
      type: 'number',
      description:
        'Marketing count of learners who have completed or watched this lesson',
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Takeaways ("In this lesson you will")',
      type: 'array',
      description: 'Bullet points highlighting key lesson objectives',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro Tip',
      type: 'text',
      rows: 3,
      description:
        'Optional callout or expert tip highlighted in the lesson sidebar/notes',
    }),
    defineField({
      name: 'notes',
      title: 'Lesson Notes',
      type: 'blockContent',
      description:
        'Rich text notes, explanations, and code snippets for this lesson',
    }),
    defineField({
      name: 'resources',
      title: 'Resources & Downloads',
      type: 'array',
      description:
        'Related links, GitHub repositories, and downloadable attachments',
      of: [
        defineArrayMember({
          type: 'resource',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      isFreePreview: 'isFreePreview',
      media: 'thumbnail',
    },
    prepare({ title, duration, isFreePreview, media }) {
      const minutes =
        typeof duration === 'number' ? Math.floor(duration / 60) : null
      const seconds = typeof duration === 'number' ? duration % 60 : null
      const timeStr =
        minutes !== null && seconds !== null
          ? `${minutes}:${seconds.toString().padStart(2, '0')}`
          : 'No duration'

      const previewBadge = isFreePreview ? ' [Free Preview]' : ''

      return {
        title: title || 'Untitled Lesson',
        subtitle: `${timeStr}${previewBadge}`,
        media: media || PlayIcon,
      }
    },
  },
})
