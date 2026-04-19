import { defineField, defineType } from 'sanity'
import { Scale } from 'lucide-react'

export default defineType({
  name: 'rule',
  title: 'Rules Archive',
  type: 'document',
  icon: Scale,
  // 1. Grouping for that elite Studio layout
  groups: [
    { name: 'content', title: 'Rule Details', default: true },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    // --- CONTENT GROUP ---
    defineField({
      name: 'title',
      title: 'Rule Set Title',
      type: 'string',
      description: 'e.g., WPA World Standard 8-Ball',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      group: 'content',
    }),
    defineField({
      name: 'sport',
      title: 'Sport',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: '8-Ball', value: '8-ball' },
          { title: '9-Ball', value: '9-ball' },
          { title: 'Snooker', value: 'snooker' },
        ],
      },
    }),
    defineField({
      name: 'governingBody',
      title: 'Governing Body / Variation',
      type: 'string',
      description: 'e.g., BCA, WPA, Blackball, or NZ Pub Rules',
      group: 'content',
    }),
    defineField({
      name: 'quickVerdict',
      title: 'The "Bar Bet" Verdict',
      type: 'text',
      description: 'A 1-2 sentence summary for instant answers under pressure.',
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Full Rule Details',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' }, 
        { 
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }]
        },
        // --- ADDED: HTML / Product Embed Block ---
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

    // --- SEO GROUP ---
    defineField({
      name: 'seo',
      title: 'Search Engine Optimization',
      type: 'seo', // Using the object we registered in index.ts
      group: 'seo',
    }),
  ],
})