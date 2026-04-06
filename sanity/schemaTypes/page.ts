import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'URL Slug', type: 'slug', options: {source: 'title'} }),
    
    // --- The "Face Lift" Fields ---
    defineField({ 
      name: 'heroImage', 
      title: 'Hero Image (Action Shot)', 
      type: 'image',
      options: { hotspot: true } 
    }),
    
    defineField({
      name: 'stats',
      title: 'Key Stats (The Bento Grid)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label (e.g. Pro Tables)', type: 'string' },
            { name: 'value', title: 'Value (e.g. 12)', type: 'string' }
          ]
        }
      ]
    }),

    defineField({ 
      name: 'content', 
      title: 'Main Body Content', 
      type: 'array', 
      of: [{type: 'block'}, {type: 'image'}] 
    }),
  ],
})