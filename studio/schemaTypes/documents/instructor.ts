import { defineArrayMember, defineField, defineType } from 'sanity'
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
      title: 'Expertise / Topics',
      type: 'array',
      description: 'Areas of expertise (e.g. React, Next.js, Web performance)',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'bio',
      title: 'Bio / Biography',
      type: 'blockContent',
      description: 'Detailed background and credentials of the instructor.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      expertise: 'expertise',
      media: 'photo',
    },
    prepare({ title, expertise, media }) {
      const expertiseStr = Array.isArray(expertise)
        ? expertise.join(', ')
        : expertise || 'Instructor'
      return {
        title: title || 'Unnamed Instructor',
        subtitle: expertiseStr,
        media: media || UserIcon,
      }
    },
  },
})
