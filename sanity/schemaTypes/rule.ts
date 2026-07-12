import { defineField, defineType } from 'sanity'
import { Scale } from 'lucide-react'

export default defineType({
  name: 'rule',
  title: 'Rules Archive',
  type: 'document',
  icon: Scale,
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
  name: 'faq',
  title: 'FAQ',
  type: 'array',
  group: 'content', // remove this line in post.ts if you don't use field groups there
  of: [
    {
      type: 'object',
      name: 'faqItem',
      fields: [
        { name: 'question', type: 'string', title: 'Question' },
        {
          name: 'answer',
          type: 'array',
          title: 'Answer',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              lists: [],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                      {
                        name: 'href',
                        type: 'url',
                        title: 'URL',
                        validation: (Rule: any) =>
                          Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
      preview: {
        select: { title: 'question' },
      },
    },
  ],
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
      rows: 2,
      description: 'ONE short punchy sentence, max ~150 characters. This also becomes the Google meta description, so keep it tight — the full breakdown goes in Key Points below, not here.',
      validation: (Rule) => Rule.max(155).warning('Keep this under 155 characters — it doubles as the SEO meta description and gets cut off past that.'),
      group: 'content',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      type: 'array',
      description: 'Short, scannable bullets for the Quick Verdict box. One rule per bullet — keep each under a sentence or two.',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(6).warning('More than 6 points gets cluttered — consider trimming or moving detail into the full write-up below.'),
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
      type: 'seo',
      group: 'seo',
    }),
  ],
})