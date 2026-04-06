import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import page from './page'
import category from './category' // 1. Import your new category file

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, page, category], // 2. Add category to this list
}