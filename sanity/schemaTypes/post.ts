import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Pool Tips & Updates',
  type: 'document',
  // 1. Define Groups for a premium Studio experience
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    // --- CONTENT GROUP ---
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {source: 'title'},
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'content',
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'mainImage',
      title: 'Cover Photo',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    
    // The "Page Builder" style Content Array
    defineField({
      name: 'body',
      title: 'Content Blocks',
      type: 'array',
      group: 'content',
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
        },
        // ADDED: Link to Rules directly in your text flow
        {
          type: 'reference',
          name: 'ruleCallout',
          title: 'Rule Reference',
          to: [{ type: 'rule' }],
          description: 'Drop an official rule card directly into the article.'
        }
      ],
    }),

    // --- SEO GROUP ---
    // This uses the 'seo' object we registered in schemaTypes/index.ts
    defineField({
      name: 'seo',
      title: 'Search Engine Optimization',
      type: 'seo',
      group: 'seo',
    }),
  ],
})