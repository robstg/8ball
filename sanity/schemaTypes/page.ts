import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug', 
      type: 'slug', 
      options: { source: 'title' } 
    }),

    defineField({
      name: 'content',
      title: 'Page Builder',
      description: 'Add and reorder sections to build your page layout.',
      type: 'array',
      of: [
        // 1. Standard Text Block
        { type: 'block' },

        // 2. Modern Hero Block
        {
          type: 'object',
          name: 'heroSection',
          title: 'Modern Hero',
          fields: [
            { name: 'heading', type: 'string', title: 'Big Heading' },
            { name: 'subheading', type: 'text', title: 'Sub-text' },
            { 
              name: 'image', 
              type: 'image', 
              title: 'Hero Image',
              options: { hotspot: true }
            },
            { name: 'showGreenTag', type: 'boolean', title: 'Show "Est. 2026" Tag?' }
          ]
        },

        // 3. Bento Grid / Stats Block
        {
          type: 'object',
          name: 'statsGrid',
          title: 'Bento Stats Grid',
          fields: [
            {
              name: 'stats',
              type: 'array',
              title: 'Stats Cards',
              of: [{
                type: 'object',
                fields: [
                  { name: 'value', type: 'string', title: 'Value (e.g. 12)' },
                  { name: 'label', type: 'string', title: 'Label (e.g. Pro Tables)' }
                ]
              }]
            }
          ]
        },

        // 4. Simple Image Block
        { type: 'image', options: { hotspot: true } }
      ],
    }),
  ],
})