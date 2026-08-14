import { defineField, defineType } from "sanity";

// Schema for standalone tools living at /tools/[slug]. Covers two
// resourceTypes:
//  - "interactive": bracket makers, calculators, etc. Reuses the existing
//    `htmlEmbed` object type for the widget code, same as embed blocks
//    inside post.body.
//  - "printable": a discipline's set of downloadable A4 wall charts
//    (e.g. Snooker Wall Charts, holding the ball colours chart + fouls
//    chart as separate PDF downloads on one page).
export default defineType({
  name: "tool",
  title: "Tool",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "resourceType",
      title: "Resource type",
      description:
        "Interactive tools render the embed widget. Printable charts show a set of downloadable A4 PDFs instead (e.g. a discipline's wall chart page).",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Interactive tool", value: "interactive" },
          { title: "Printable chart set", value: "printable" },
        ],
        layout: "radio",
      },
      initialValue: "interactive",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      description: "One or two sentences shown on the /tools hub card.",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      hidden: ({ parent }) => parent?.resourceType !== "interactive",
      options: {
        list: [
          { title: "Bracket / Draw", value: "bracket" },
          { title: "Calculator", value: "calculator" },
          { title: "Simulator", value: "simulator" },
          { title: "Reference", value: "reference" },
        ],
      },
    }),
    defineField({
      name: "discipline",
      title: "Discipline",
      description: "Which sport this chart set covers.",
      type: "string",
      group: "content",
      hidden: ({ parent }) => parent?.resourceType !== "printable",
      options: {
        list: [
          { title: "Snooker", value: "snooker" },
          { title: "Pool", value: "pool" },
          { title: "Heyball", value: "heyball" },
        ],
      },
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.resourceType === "printable" && !value) {
            return "Required for printable chart sets";
          }
          return true;
        }),
    }),
    defineField({
      name: "icon",
      title: "Icon (emoji)",
      type: "string",
      description: "Shown on the hub card, e.g. 🎱",
      group: "content",
    }),
    defineField({
      name: "intro",
      title: "Intro copy",
      description:
        "Real body text shown above the tool/charts. Needed for SEO — don't leave this empty, a bare widget or download list with no surrounding text won't rank.",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.resourceType === "interactive" && (!value || value.length === 0)) {
            return "Required for interactive tools";
          }
          return true;
        }),
    }),
    defineField({
      name: "embed",
      title: "Tool embed",
      type: "htmlEmbed",
      group: "content",
      hidden: ({ parent }) => parent?.resourceType !== "interactive",
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.resourceType === "interactive" && !value) {
            return "Required for interactive tools";
          }
          return true;
        }),
    }),
    defineField({
      name: "charts",
      title: "Charts",
      description: "One entry per downloadable A4 chart on this page.",
      type: "array",
      group: "content",
      hidden: ({ parent }) => parent?.resourceType !== "printable",
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.resourceType === "printable" && (!value || value.length === 0)) {
            return "Add at least one chart";
          }
          return true;
        }),
      of: [
        {
          type: "object",
          name: "chartItem",
          title: "Chart",
          fields: [
            defineField({
              name: "chartTitle",
              title: "Chart title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "shortDescription",
              title: "Short description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "previewImage",
              title: "Preview image",
              description: "On-page preview shown before the person downloads the PDF.",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "pdfFile",
              title: "PDF file",
              type: "file",
              options: { accept: "application/pdf" },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "dimensions",
              title: "Dimensions",
              type: "string",
              initialValue: "A4",
            }),
          ],
          preview: {
            select: { title: "chartTitle", media: "previewImage" },
          },
        },
      ],
    }),
    defineField({
      name: "relatedRulesPage",
      title: "Related rules page",
      description: "The discipline's official rules page, for cross-linking. Mainly for printable chart sets.",
      type: "reference",
      to: [{ type: "post" }],
      group: "content",
      hidden: ({ parent }) => parent?.resourceType !== "printable",
    }),
    defineField({
      name: "relatedArticles",
      title: "Related articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      group: "content",
    }),
    defineField({
      name: "featured",
      title: "Show on /tools hub",
      type: "boolean",
      initialValue: true,
      group: "meta",
    }),
    defineField({
      name: "fullWidth",
      title: "Break out to full page width",
      description:
        "Off by default — the embed sits inside the site's normal content width, same as articles. Turn on for content-heavy tools (long scenario pickers, reference lists) that benefit from more room than the standard container gives, like a full-page app rather than an in-article widget.",
      type: "boolean",
      initialValue: false,
      group: "meta",
      hidden: ({ parent }) => parent?.resourceType !== "interactive",
    }),
    defineField({
      name: "order",
      title: "Sort order on hub",
      description: "Lower numbers appear first. Leave blank to sort by newest.",
      type: "number",
      group: "meta",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title override",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description override",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", discipline: "discipline", media: "icon" },
    prepare({ title, subtitle, discipline }) {
      return { title, subtitle: subtitle || discipline };
    },
  },
});