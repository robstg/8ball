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
      name: 'mainImage',
      title: 'Cover Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})