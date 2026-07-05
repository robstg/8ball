import { type SchemaTypeDefinition } from 'sanity'

// Documents
import post from './post'
import page from './page'
import category from './category' 
import rule from './rule'
import guide from './guide' // Import for the Gear Lab
import author from './author'
import subscriber from './documents/subscriber'

// Objects (The new folder we created)
import seo from './objects/seo'
import htmlEmbed from './htmlEmbed'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    post, 
    page, 
    category, 
    rule, 
    guide,
    author, // Cleanly registered inside the compilation pipeline
    subscriber,

    // Objects
    seo,
    htmlEmbed
  ],
}