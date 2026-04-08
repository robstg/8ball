import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Pool Tips & Updates',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {source: 'title'},
    }),
    // --- ADD THIS FIELD TO LINK CATEGORIES ---
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Photo',
      type: 'image',
      options: {hotspot: true},
    }),
defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          // 1. This adds the Heading dropdown (H2, H3) and Quote styles
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2 (Big Header)', value: 'h2' },
            { title: 'H3 (Sub Header)', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          // 2. This adds Bullet points
          lists: [{ title: 'Bullet', value: 'bullet' }],
          // 3. This adds Bold and Italic
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
        // 4. This adds the "+" button to drop images into the text
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Important for SEO (e.g. "Diagram of a side-spin shot")'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }
          ]
        }
      ],
    }),
  ],
})