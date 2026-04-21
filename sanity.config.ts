'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig, buildLegacyTheme} from 'sanity' // Added buildLegacyTheme
import {structureTool} from 'sanity/structure'
import {codeInput} from '@sanity/code-input'

import {schema} from './sanity/schemaTypes'
import {structure, defaultDocumentNode} from './sanity/structure' // Import both now

// --- SNOOKER LAB THEME (Stealth & Emerald) ---
const props = {
  "--ptb-white": "#f8fafc",
  "--ptb-black": "#020617", // Stealth Black
  "--ptb-emerald": "#10b981", // Cue-ball Emerald
  "--ptb-slate": "#475569",
}

export const ptbTheme = buildLegacyTheme({
  "--black": props["--ptb-black"],
  "--white": props["--ptb-white"],
  "--brand-primary": props["--ptb-emerald"],
  "--component-bg": props["--ptb-black"],
  "--component-text-color": props["--ptb-white"],
  "--default-button-primary-color": props["--ptb-emerald"],
  "--main-navigation-color": props["--ptb-black"],
  "--main-navigation-color--inverted": props["--ptb-white"],
  "--focus-color": props["--ptb-emerald"],
})

export default defineConfig({
  basePath: '/studio',
  title: 'Pot The Black Lab', // Added a custom title for the dashboard
  
  projectId: 'jcg2nhtl', 
  dataset: 'production',

  theme: ptbTheme, // Injecting the modern snooker theme

  schema,
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode, // This activates the "Live Preview" tab
    }),
    visionTool({defaultApiVersion: '2024-04-07'}),
    codeInput(),
  ],
})