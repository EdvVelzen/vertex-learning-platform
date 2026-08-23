import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      validation: (rule) => rule.required().error('Course title is required.'),
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
      name: 'summary',
      title: 'Summary / Overview',
      type: 'text',
      rows: 3,
      description:
        'Marketing summary highlighting course topics and value proposition',
      validation: (rule) =>
        rule.required().error('A course summary is required.'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required().error('A cover image is required.'),
    }),
    defineField({
      name: 'level',
      title: 'Skill Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
          { title: 'All Levels', value: 'All Levels' },
        ],
        layout: 'radio',
      },
      initialValue: 'Beginner',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price ($ USD)',
      type: 'number',
      description: 'Course price in USD (enter 0 for free courses)',
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'isPopular',
      title: 'Popular Badge',
      type: 'boolean',
      description:
        'Flag course as Popular / Best Seller on catalog and home pages',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Enrolled Students (Display)',
      type: 'number',
      description: 'Marketing count of enrolled students',
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) =>
        rule.required().error('Please select a category for this course.'),
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      validation: (rule) =>
        rule.required().error('Please assign an instructor to this course.'),
    }),
    defineField({
      name: 'learningOutcomes',
      title: "What You'll Learn (Outcomes)",
      type: 'array',
      description: 'Key skills and concepts students will acquire',
      of: [
        defineArrayMember({
          type: 'learningOutcome',
        }),
      ],
      validation: (rule) =>
        rule
          .min(1)
          .error('Provide at least one learning outcome for this course.'),
    }),
    defineField({
      name: 'modules',
      title: 'Course Curriculum (Modules)',
      type: 'array',
      description: 'Ordered sequence of modules and lesson references',
      of: [
        defineArrayMember({
          type: 'module',
        }),
      ],
      validation: (rule) =>
        rule
          .min(1)
          .error('A course must have at least one module in its curriculum.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      instructor: 'instructor.name',
      level: 'level',
      price: 'price',
      media: 'coverImage',
    },
    prepare({ title, category, instructor, level, price, media }) {
      const priceStr = price === 0 ? 'Free' : `$${price}`
      const metaParts = [category, instructor, level, priceStr].filter(Boolean)
      return {
        title: title || 'Untitled Course',
        subtitle: metaParts.join(' • '),
        media: media || BookIcon,
      }
    },
  },
})
