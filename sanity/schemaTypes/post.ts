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
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2 (Big Header)', value: 'h2' },
            { title: 'H3 (Sub Header)', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
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
        },
        // --- THE D1 UPGRADE: ADD THIS FOR AMAZON/HTML ---
        {
          type: 'code',
          title: 'HTML / Product Embed',
          options: {
            language: 'html',
            languageAlternatives: [
              {title: 'HTML', value: 'html'},
              {title: 'Javascript', value: 'javascript'}
            ]
          }
        }
      ],
    }),
  ],
})