import { defineField, defineType } from "sanity";

// Schema for standalone interactive tools (bracket makers, calculators, etc)
// living at /tools/[slug]. Reuses the existing `htmlEmbed` object type for
// the actual widget code, same as the embed blocks inside post.body.
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
        "Real body text shown above the tool. Needed for SEO — don't leave this empty, a bare widget with no surrounding text won't rank.",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "embed",
      title: "Tool embed",
      type: "htmlEmbed",
      group: "content",
      validation: (Rule) => Rule.required(),
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
    select: { title: "title", subtitle: "category", media: "icon" },
  },
});