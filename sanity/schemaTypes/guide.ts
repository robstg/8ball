import { defineField, defineType } from 'sanity'
import { Microscope } from 'lucide-react'

export default defineType({
  name: 'guide',
  title: 'Gear Guides',
  type: 'document',
  icon: Microscope,
  groups: [
    { name: 'content', title: 'Technical Details', default: true },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Product/Guide Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Technical Category',
      type: 'string',
      description: 'e.g., Engineering, Technical, Equipment',
      group: 'content',
    }),
    defineField({
      name: 'score',
      title: 'Engineering Score',
      type: 'string',
      description: 'e.g., 9.8',
      group: 'content',
    }),
    defineField({
      name: 'badge',
      title: 'Status Badge',
      type: 'string',
      description: "e.g., Editor's Choice, Pro Standard",
      group: 'content',
    }),
    defineField({
      name: 'mainImage',
      title: 'Technical Image (16:9)',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
    }),
    defineField({
      name: 'info',
      title: 'Short Summary',
      type: 'text',
      rows: 2,
      description: 'Shown on the homepage cards.',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Full Lab Report',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { type: 'code', title: 'Product Link / Embed' }
      ],
    }),
    // The SEO Object for global search
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      group: 'seo',
    }),
  ],
})