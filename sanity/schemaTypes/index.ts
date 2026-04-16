import { type SchemaTypeDefinition } from 'sanity'

// Documents
import post from './post'
import page from './page'
import category from './category' 
import rule from './rule'
import guide from './guide' // Import for the Gear Lab

// Objects (The new folder we created)
import seo from './objects/seo'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    post, 
    page, 
    category, 
    rule, 
    guide,

    // Objects
    seo
  ],
}