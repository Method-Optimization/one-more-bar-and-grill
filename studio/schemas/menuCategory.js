/* =============================================================================
   MENU CATEGORY
   -----------------------------------------------------------------------------
   One document per section of the printed menu — Fingerfoods, Salads, Wings,
   Pizza and so on. Inside each, "blocks" run down the page in the order you put
   them, so a category can mix priced items, sub-headings, notes and the
   sauce-style lists exactly the way the paper menu does.
   ============================================================================= */

const menuItem = {
  type: "object",
  name: "menuItem",
  title: "Item",
  fields: [
    { name: "name", title: "Item", type: "string", validation: (R) => R.required() },
    {
      name: "price",
      title: "Price",
      description: 'Whatever should print on the right, e.g. "$9", "Cup $8 / Bowl $9.50" or "Market".',
      type: "string"
    },
    { name: "desc", title: "Description", type: "text", rows: 3 },
    {
      name: "tiers",
      title: "Sizes instead of one price",
      description:
        'For items sold by the count. Fill this in and the price above is ignored — ' +
        'e.g. "6 pc $9 · 13 pc $15 · 25 pc $27".',
      type: "string"
    },
    {
      name: "lead",
      title: "Small note beside the name",
      description: "Rarely used. Sits between the item name and the price.",
      type: "string"
    }
  ],
  preview: {
    select: { title: "name", price: "price", tiers: "tiers", desc: "desc" },
    prepare: ({ title, price, tiers, desc }) => ({
      title: title,
      subtitle: (tiers || price || "") + (desc ? "  —  " + desc : "")
    })
  }
};

export default {
  name: "menuCategory",
  title: "Menu Section",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Section heading",
      description: 'As it prints on the page, e.g. "Buffalo Wings & Morsels".',
      type: "string",
      validation: (R) => R.required()
    },
    {
      name: "jumpLabel",
      title: "Short name for the jump bar",
      description: 'The strip of links at the top of the menu page, e.g. "Wings & Morsels".',
      type: "string",
      validation: (R) => R.required()
    },
    {
      name: "anchor",
      title: "Link id",
      description:
        "The bit after the # in the address bar. Lower-case letters only, no " +
        "spaces. Changing it breaks any existing link to this section.",
      type: "string",
      validation: (R) =>
        R.required().regex(/^[a-z0-9-]+$/, { name: "lower-case letters, numbers and dashes" })
    },
    {
      name: "order",
      title: "Position on the page",
      description: "Sections are shown lowest number first.",
      type: "number",
      validation: (R) => R.required()
    },

    {
      name: "blocks",
      title: "Contents",
      description:
        "Everything inside this section, top to bottom. Drag to reorder.",
      type: "array",
      validation: (R) => R.required().min(1),
      of: [
        {
          type: "object",
          name: "menuItems",
          title: "Item list",
          fields: [{ name: "items", title: "Items", type: "array", of: [menuItem] }],
          preview: {
            select: { items: "items" },
            prepare: ({ items }) => ({
              title: "Item list",
              subtitle:
                (items || []).length + " item" + ((items || []).length === 1 ? "" : "s") +
                ((items || []).length ? " — " + items.slice(0, 3).map((i) => i.name).join(", ") : "")
            })
          }
        },

        {
          type: "object",
          name: "menuHeading",
          title: "Sub-heading",
          fields: [{ name: "text", title: "Heading", type: "string", validation: (R) => R.required() }],
          preview: {
            select: { text: "text" },
            prepare: ({ text }) => ({ title: "Sub-heading", subtitle: text })
          }
        },

        {
          type: "object",
          name: "menuNote",
          title: "Note",
          description: "A line of small print.",
          fields: [
            {
              name: "lead",
              title: "Bold start (optional)",
              description: 'The part printed in bold, e.g. "Dressings:".',
              type: "string"
            },
            { name: "text", title: "Note", type: "text", rows: 3, validation: (R) => R.required() },
            {
              name: "top",
              title: "Show directly under the section heading",
              description: "Tick this for a note that introduces the whole section.",
              type: "boolean",
              initialValue: false
            }
          ],
          preview: {
            select: { lead: "lead", text: "text" },
            prepare: ({ lead, text }) => ({
              title: "Note",
              subtitle: (lead ? lead + " " : "") + text
            })
          }
        },

        {
          type: "object",
          name: "menuDefs",
          title: "Name-and-description list",
          description:
            "For lists like the sauces or the happy-hour deals: a bold name " +
            "followed by a short explanation, with no price.",
          fields: [
            {
              name: "entries",
              title: "Rows",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "term", title: "Name", type: "string", validation: (R) => R.required() },
                    { name: "detail", title: "Description", type: "string" }
                  ],
                  preview: { select: { title: "term", subtitle: "detail" } }
                }
              ]
            }
          ],
          preview: {
            select: { entries: "entries" },
            prepare: ({ entries }) => ({
              title: "Name-and-description list",
              subtitle: (entries || []).length + " rows"
            })
          }
        }
      ]
    },

    {
      name: "showInFooter",
      title: "Also show this section in the footer",
      description:
        "Repeats this section at the bottom of every page, under Hours & Find " +
        "Us. Meant for the late night menu — it is what someone is looking for " +
        "when they check whether the kitchen is still open. Only one section " +
        "shows there; if you tick more than one, the first wins.",
      type: "boolean",
      initialValue: false
    },

    {
      name: "comment",
      title: "Internal label",
      description:
        "Only shows up in the page source, as a signpost for developers. " +
        "Safe to ignore.",
      type: "string",
      hidden: true
    }
  ],

  orderings: [
    {
      title: "Order on the page",
      name: "byOrder",
      by: [{ field: "order", direction: "asc" }]
    }
  ],

  preview: {
    select: { title: "title", order: "order", blocks: "blocks" },
    prepare: ({ title, order, blocks }) => {
      const items = (blocks || []).reduce(
        (n, b) => n + ((b.items && b.items.length) || 0), 0);
      return {
        title: title,
        subtitle: "#" + order + " · " + items + " item" + (items === 1 ? "" : "s")
      };
    }
  }
};
