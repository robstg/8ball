// schemas/rule.ts
import { Scale } from 'lucide-react'

export default {
  name: 'rule',
  title: 'Rules Archive',
  type: 'document',
  icon: Scale,
  fields: [
    {
      name: 'title',
      title: 'Rule Set Title',
      type: 'string',
      description: 'e.g., WPA World Standard 8-Ball',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    },
    {
      name: 'sport',
      title: 'Sport',
      type: 'string',
      options: {
        list: [
          { title: '8-Ball', value: '8-ball' },
          { title: '9-Ball', value: '9-ball' },
          { title: 'Snooker', value: 'snooker' },
        ],
      },
    },
    {
      name: 'governingBody',
      title: 'Governing Body / Variation',
      type: 'string',
      description: 'e.g., BCA, WPA, Blackball, or NZ Pub Rules',
    },
    {
      name: 'quickVerdict',
      title: 'The "Bar Bet" Verdict',
      type: 'text',
      description: 'A 1-2 sentence summary for people arguing in a pub who need an instant answer.',
    },
    {
      name: 'content',
      title: 'Full Rule Details',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    },
  ],
}