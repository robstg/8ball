// schemaTypes/htmlEmbed.ts
import {defineField, defineType} from 'sanity'
import {HtmlEmbedInput} from '../components/HtmlEmbedInput'

export default defineType({
  name: 'htmlEmbed',
  title: 'HTML Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'HTML / CSS code',
      type: 'text',
      components: {
        input: HtmlEmbedInput,
      },
    }),
  ],
  preview: {
    select: {code: 'code'},
    prepare({code}) {
      return {
        title: 'HTML Embed',
        subtitle: code ? code.slice(0, 60) + '...' : 'Empty',
      }
    },
  },
})