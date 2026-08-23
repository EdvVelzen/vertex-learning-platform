import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const instructor = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Instructor name is required.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('A unique slug is required.'),
    }),
    defineField({
      name: 'photo',
      title: 'Photo / Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) =>
        rule.required().error('Instructor photo is required.'),
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise / Headline',
      type: 'string',
      description:
        'Short headline, e.g. "Senior Full-Stack Engineer & AI Architect"',
      validation: (rule) =>
        rule.required().error('Expertise headline is required.'),
    }),
    defineField({
      name: 'bio',
      title: 'Bio / Biography',
      type: 'text',
      rows: 4,
      description: 'Detailed background and credentials of the instructor.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'expertise',
      media: 'photo',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Unnamed Instructor',
        subtitle: subtitle || 'Instructor',
        media: media || UserIcon,
      }
    },
  },
})
