import type { CollectionConfig } from "payload";

/** Slugify that keeps Thai letters; lowercases latin, spaces → "-". */
function slugify(input?: string): string {
  if (!input) return "";
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function revalidate(slug?: string) {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/portfolio");
    if (slug) revalidatePath(`/portfolio/${slug}`);
  } catch {
    /* called outside Next request scope (e.g. CLI) — ignore */
  }
}

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Portfolio post", plural: "Portfolio" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "_status", "publishedAt"],
  },
  access: {
    // Public sees only published; logged-in editors see everything.
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [({ doc }) => void revalidate(doc?.slug)],
    afterDelete: [({ doc }) => void revalidate(doc?.slug)],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "เว้นว่างเพื่อสร้างจากชื่อให้อัตโนมัติ" },
      hooks: {
        beforeValidate: [({ value, data }) => slugify(value || data?.title)],
      },
    },
    { name: "excerpt", type: "textarea", admin: { description: "ข้อความสั้นบนการ์ด" } },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "content", type: "richText" },
    {
      name: "gallery",
      type: "array",
      fields: [{ name: "image", type: "upload", relationTo: "media" }],
    },
    { name: "category", type: "relationship", relationTo: "categories" },
    { name: "client", type: "text" },
    { name: "publishedAt", type: "date", admin: { position: "sidebar" } },
  ],
};
