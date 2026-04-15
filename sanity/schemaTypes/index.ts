import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import page from './page'
import category from './category' 
import rule from './rule' // 1. Import your new rule schema

export const schema: { types: SchemaTypeDefinition[] } = {
  // 2. Add 'rule' to this list
  types: [post, page, category, rule], 
}