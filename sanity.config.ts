'use client'

/**
 * This configuration is used for the Sanity Studio.
 * Now with Code Input for those Amazon product comparisons.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
// 1. Import the code input plugin
import {codeInput} from '@sanity/code-input'

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
    // 2. Add the plugin here
    codeInput(),
  ],
})