import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const agentContext = defineType({
  name: 'sanity.agentContext',
  title: 'Agent Context Configuration',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Context Name',
      type: 'string',
      initialValue: 'Vertex Search Agent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (MCP Endpoint ID)',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instructions',
      title: 'Agent Query Instructions (Deltas)',
      type: 'text',
      rows: 10,
      description: 'Domain-specific instructions injected into the Sanity Context MCP endpoint',
    }),
    defineField({
      name: 'groqFilter',
      title: 'Content Filter (GROQ Expression)',
      type: 'text',
      rows: 3,
      description: 'Scoping filter to limit documents visible to the search agent',
      initialValue: '_type in ["course", "lesson", "video", "instructor", "category"] && !(_id in path("drafts.**"))',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title: title || 'Agent Context',
        subtitle: slug ? `slug: ${slug}` : 'No slug configured',
        media: CogIcon,
      }
    },
  },
})
