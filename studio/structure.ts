import type { StructureResolver } from 'sanity/structure'
import { BookIcon, PlayIcon, TagIcon, UserIcon } from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Courses')
        .icon(BookIcon)
        .child(
          S.documentList()
            .title('All Courses')
            .filter('_type == "course"')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      S.listItem()
        .title('Lessons')
        .icon(PlayIcon)
        .child(
          S.documentList()
            .title('All Lessons')
            .filter('_type == "lesson"')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Instructors')
        .icon(UserIcon)
        .child(
          S.documentList()
            .title('All Instructors')
            .filter('_type == "instructor"')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(
          S.documentList()
            .title('All Categories')
            .filter('_type == "category"')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),
      S.divider(),
      // Catch-all for any other document types that might be defined or added later
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['course', 'lesson', 'instructor', 'category'].includes(
            listItem.getId() || ''
          )
      ),
    ])
