'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image' // Adjust this path if your sanity image helper is elsewhere

const components: PortableTextComponents = {
  types: {
    // 1. This handles the Amazon/HTML blocks
    code: ({ value }: any) => {
      if (value.language === 'html') {
        return (
          <div 
            className="my-8 rounded-xl border border-emerald-900 bg-slate-900/50 p-4 shadow-2xl"
            dangerouslySetInnerHTML={{ __html: value.code }} 
          />
        )
      }
      return (
        <pre className="my-6 overflow-x-auto rounded bg-slate-900 p-4 text-sky-400">
          <code>{value.code}</code>
        </pre>
      )
    },
    // 2. This handles images you drop into the body
    image: ({ value }: any) => {
      return (
        <div className="relative my-10 aspect-video w-full overflow-hidden rounded-xl border-2 border-emerald-900">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'RACK. Pool Tip'}
            fill
            className="object-cover"
          />
          {value.caption && (
            <div className="absolute bottom-0 w-full bg-slate-950/80 p-2 text-center text-sm text-slate-300 italic">
              {value.caption}
            </div>
          )}
        </div>
      )
    },
  },
  block: {
    // 3. Styling your headlines and paragraphs
    h2: ({ children }: any) => <h2 className="mb-4 mt-12 font-space-grotesk text-3xl font-bold uppercase tracking-tight text-white">{children}</h2>,
    h3: ({ children }: any) => <h3 className="mb-3 mt-8 font-space-grotesk text-2xl font-bold text-sky-500">{children}</h3>,
    normal: ({ children }: any) => <p className="mb-6 font-inter text-lg leading-relaxed text-slate-300">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 border-l-4 border-sky-500 bg-emerald-900/10 py-4 pl-6 italic text-slate-200">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="mb-6 list-inside list-disc space-y-2 text-slate-300">{children}</ul>,
  },
}

export function CustomPortableText({ value }: { value: any }) {
  if (!value) return null
  return <PortableText value={value} components={components} />
}