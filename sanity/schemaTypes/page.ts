import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  // 1. Grouping for the professional "Top G" Studio UI
  groups: [
    { name: 'content', title: 'Content Builder', default: true },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Internal Page Title', 
      type: 'string', 
      group: 'content' 
    }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug', 
      type: 'slug', 
      options: { source: 'title' }, 
      group: 'content' 
    }),

    // 2. THE PAGE BUILDER ARRAY
    defineField({
      name: 'content',
      title: 'Section Builder',
      description: 'Stack and reorder technical sections to build the page.',
      type: 'array',
      group: 'content',
      of: [
        // BLOCK: Standard Technical Text
        { 
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2 (Section Header)', value: 'h2' },
            { title: 'H3 (Sub Header)', value: 'h3' },
          ],
        },

         // BLOCK: HTML Embed
  { type: 'htmlEmbed' },

        // BLOCK: Engineering Hero (16:9 optimized)
        {
          type: 'object',
          name: 'heroSection',
          title: 'Engineering Hero',
          fields: [
            { name: 'heading', type: 'string', title: 'Main Technical Heading' },
            { name: 'subheading', type: 'text', title: 'Supporting Analysis Text' },
            { 
              name: 'image', 
              type: 'image', 
              title: 'Cinematic Header (16:9)',
              options: { hotspot: true }
            },
            { 
              name: 'theme', 
              type: 'string', 
              title: 'Visual Theme',
              options: {
                list: [
                  { title: 'Lab White (Clean)', value: 'white' },
                  { title: 'Stealth Black (Premium)', value: 'black' }
                ]
              },
              initialValue: 'white'
            }
          ]
        },

        // BLOCK: Technical Bento Grid (Stats/Data)
        {
          type: 'object',
          name: 'statsGrid',
          title: 'Technical Data Grid',
          fields: [
            { name: 'gridTitle', type: 'string', title: 'Grid Heading (Optional)' },
            {
              name: 'stats',
              type: 'array',
              title: 'Data Points',
              of: [{
                type: 'object',
                fields: [
                  { name: 'value', type: 'string', title: 'Metric (e.g. 9.8/10 or 1,200N)' },
                  { name: 'label', type: 'string', title: 'Label (e.g. Deflection Rating)' },
                  { name: 'description', type: 'string', title: 'Short Spec' }
                ]
              }]
            }
          ]
        },

        // BLOCK: Full Width Lab Image
        { 
            type: 'image', 
            title: 'Lab Visual',
            options: { hotspot: true },
            fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }]
        }
      ],
    }),

    // 3. AUTOMATED SEO OBJECT
    defineField({
      name: 'seo',
      title: 'Search Engine Optimization',
      type: 'seo', // Using the object we registered in index.ts
      group: 'seo',
    }),
  ],
})