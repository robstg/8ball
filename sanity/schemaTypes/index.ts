import { type SchemaTypeDefinition } from 'sanity'
import post from './post' // This links the file you just made

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post], // This tells Sanity to show it in the menu
}