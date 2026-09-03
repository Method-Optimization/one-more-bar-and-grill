/* =============================================================================
   HOME PAGE
   -----------------------------------------------------------------------------
   Every word and photo on the front page, in the order they appear going down
   the screen.
   ============================================================================= */

import { seoField, sectionHead, photoField } from "./objects";

export default {
  name: "homePage",
  title: "Home Page",
  type: "document",

  groups: [
    { name: "top", title: "Top of the page", default: true },
    { name: "cards", title: "The three cards" },
    { name: "favorites", title: "Favorites & sauces" },
    { name: "proof", title: "Reviews" },
    { name: "story", title: "Our story" },
    { name: "seo", title: "Search & sharing" }
  ],

  fields: [
    Object.assign({}, seoField, { group: "seo" }),

    /* ----------------------------------------------------------------- hero */
    {
      name: "heroTag",
      title: "Big line under the logo",
      type: "string",
      group: "top"
    },
    {
      name: "heroSub",
      title: "Line under that",
      type: "string",
      group: "top"
    },
    {
      name: "heroCtaLabel",
      title: "Button text",
      type: "string",
      group: "top"
    },
    {
      name: "heroCtaHref",
      title: "Button goes to",
      type: "string",
      group: "top"
    },
    {
      name: "heroLines",
      title: "Cycling phrases",
      description:
        "The big phrases that light up word by word as you scroll. Keep them " +
        "short and punchy — three to five works best.",
      type: "array",
      of: [{ type: "string" }],
      group: "top"
    },

    /* ------------------------------------------------------------ the cards */
    {
      name: "stackCards",
      title: "The three cards",
      description:
        "The full-screen cards that slide over each other under the hero.",
      type: "array",
      group: "cards",
      of: [
        {
          type: "object",
          name: "stackCard",
          fields: [
            {
              name: "script",
              title: "Handwritten line",
              type: "string",
              description: 'The small script text above the heading, e.g. "come hungry".'
            },
            { name: "title", title: "Heading", type: "string", validation: (R) => R.required() },
            { name: "body", title: "Paragraph", type: "text", rows: 3 },
            { name: "linkLabel", title: "Link text", type: "string" },
            {
              name: "linkHref",
              title: "Link goes to",
              description: 'A page, a spot on this page ("#specials"), or a phone number ("tel:+16093885386").',
              type: "string"
            },
            photoField("photo", "Photo", "The picture on the right-hand side of the card.")
          ],
          preview: {
            select: { title: "title", subtitle: "script", media: "photo.image" }
          }
        }
      ]
    },

    /* -------------------------------------------------------- our favorites */
    {
      name: "showcase",
      title: "“Our Favorites” heading",
      type: "object",
      group: "favorites",
      fields: sectionHead().fields.concat([
        { name: "tagline", title: "Line under the heading", type: "string" },
        { name: "ctaLabel", title: "Button under the photos", type: "string" }
      ])
    },

    {
      name: "signatureItems",
      title: "Favorites photos",
      description: "The scattered polaroids. Four looks best.",
      type: "array",
      group: "favorites",
      of: [
        {
          type: "object",
          name: "signatureItem",
          fields: [
            photoField("photo", "Photo", null),
            { name: "caption", title: "Caption", type: "string", validation: (R) => R.required() },
            { name: "note", title: "Line under the caption", type: "string" }
          ],
          preview: { select: { title: "caption", subtitle: "note", media: "photo.image" } }
        }
      ]
    },

    {
      name: "sauces",
      title: "Sauces",
      description: "The scrolling strip of sauce names.",
      type: "array",
      of: [{ type: "string" }],
      group: "favorites"
    },

    /* ------------------------------------------------------ specials headings */
    {
      name: "specialsHead",
      title: "“This week at One More” heading",
      type: "object",
      group: "favorites",
      fields: sectionHead().fields.concat([
        { name: "dailyHeading", title: "First column heading", type: "string" },
        { name: "eventsHeading", title: "Second column heading", type: "string" },
        { name: "rotatingHeading", title: "Third list heading", type: "string" }
      ])
    },

    /* ---------------------------------------------------------------- proof */
    {
      name: "ratings",
      title: "Star ratings",
      type: "array",
      group: "proof",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "source",
              title: "Where from",
              type: "string",
              description: 'e.g. "Google" or "Facebook". The Google one also feeds the search listing.'
            },
            { name: "score", title: "Score", type: "string", description: 'e.g. "4.5"' },
            { name: "count", title: "Underneath", type: "string", description: 'e.g. "812 reviews"' }
          ],
          preview: { select: { title: "source", subtitle: "score" } }
        }
      ]
    },

    {
      name: "testimonials",
      title: "Customer quotes",
      description: "These rotate automatically.",
      type: "array",
      group: "proof",
      of: [
        {
          type: "object",
          fields: [
            { name: "quote", title: "Quote", type: "text", rows: 4, validation: (R) => R.required() },
            { name: "who", title: "Who said it", type: "string" },
            { name: "where", title: "Where they're from", type: "string" }
          ],
          preview: { select: { title: "who", subtitle: "quote" } }
        }
      ]
    },

    /* ---------------------------------------------------------------- story */
    {
      name: "story",
      title: "Our story",
      type: "object",
      group: "story",
      fields: [
        { name: "script", title: "Handwritten line", type: "string" },
        { name: "title", title: "Heading", type: "string" },
        { name: "body", title: "Paragraph", type: "text", rows: 5 },
        {
          name: "orderLine",
          title: "The big line at the end",
          description: 'Currently "ORDER ONE MORE".',
          type: "string"
        }
      ]
    }
  ],

  preview: {
    prepare: () => ({ title: "Home Page" })
  }
};
