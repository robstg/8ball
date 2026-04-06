import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import page from './page' // 1. Import it

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, page], // 2. Add it here
}