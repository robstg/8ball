'use client'

/**
 * This configuration is used for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route.
 * HARDCODED VERSION TO FIX PERSISTENT PUBLISH BUTTON ISSUE.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// We keep these imports for schema and structure logic, 
// but we are overriding the project variables below.
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  
  // --- HARDCODED FOR THE WIN ---
  projectId: 'jcg2nhtl', 
  dataset: 'production',
  // -----------------------------

  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: '2024-04-07'}),
  ],
})