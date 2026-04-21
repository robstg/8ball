import type {StructureResolver, DefaultDocumentNodeResolver} from 'sanity/structure'
import {Iframe} from 'sanity-plugin-iframe-pane'

// This defines the sidebar list
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Engineering Lab')
    .items([
      ...S.documentTypeListItems(),
    ])

// This defines the "Tabs" inside a document (Form vs. Preview)
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  if (['post', 'rule', 'guide'].includes(schemaType)) {
    return S.document().views([
      S.view.form(), // The standard editor
      S.view
        .component(Iframe)
        .options({
          url: (doc: any) => {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            const slug = doc?.slug?.current
            if (!slug) return baseUrl
            
            // Technical route mapping
            if (schemaType === 'post') return `${baseUrl}/articles/${slug}`
            if (schemaType === 'rule') return `${baseUrl}/rules/${doc.sport}/${slug}`
            if (schemaType === 'guide') return `${baseUrl}/guides/${slug}`
            
            return baseUrl
          },
          reload: { button: true },
          attributes: { allow: 'fullscreen' }
        })
        .title('Live Preview'),
    ])
  }

  return S.document().views([S.view.form()])
}