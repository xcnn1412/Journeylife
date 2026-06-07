import type { CollectionConfig } from "payload";
import { slugify } from "../lib/slug";
import { previewPath } from "../lib/preview";
import { isAdmin, isStaff } from "./access";

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
  labels: {
    singular: { en: "Portfolio post", th: "ผลงาน (Portfolio)" },
    plural: { en: "Portfolio", th: "ผลงาน (Portfolio)" },
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "_status", "publishedAt"],
    group: { en: "Website content", th: "เนื้อหาเว็บไซต์" },
    description: {
      en: "Case studies / past trips shown on the public /portfolio page. Use “Save draft” to keep it hidden, “Publish” to make it live.",
      th: "ผลงาน/ทริปที่ผ่านมา ซึ่งจะแสดงบนหน้า “ผลงานของเรา” (/portfolio) — กด “บันทึกฉบับร่าง” เพื่อเก็บไว้ก่อน หรือ “เผยแพร่” เพื่อให้ขึ้นเว็บจริง",
    },
    listSearchableFields: ["title", "excerpt", "client"],
    pagination: { defaultLimit: 20, limits: [10, 20, 50, 100] },
    // "Preview" button — opens the live (draft) page in a new tab.
    preview: (doc) => previewPath(doc),
    // Live Preview — split-view: edit on the left, live website on the right.
    livePreview: {
      url: ({ data }) => previewPath(data),
      breakpoints: [
        { name: "mobile", label: "มือถือ (Mobile)", width: 390, height: 844 },
        { name: "tablet", label: "แท็บเล็ต (Tablet)", width: 768, height: 1024 },
        { name: "desktop", label: "เดสก์ท็อป (Desktop)", width: 1440, height: 900 },
      ],
    },
  },
  access: {
    // Public sees only published; logged-in staff see everything.
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
    create: isStaff,
    update: isStaff,
    delete: isAdmin, // only admins can permanently delete (editors can unpublish instead)
  },
  // Manual drafts (NO autosave): a background autosave firing mid-edit raced the
  // Lexical block's deferred commit (node.setFields in setTimeout(0)) — round-tripping
  // a `content` with 0 images, which mergeServerFormState then accepted (collapsing a
  // just-picked Gallery to 0) AND triggered an iframe self-refresh via RefreshRouteOnSave.
  // Live Preview still updates on each explicit "Save draft" / "Publish".
  versions: { drafts: true },
  hooks: {
    afterChange: [({ doc }) => void revalidate(doc?.slug)],
    afterDelete: [({ doc }) => void revalidate(doc?.slug)],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: { en: "Title", th: "ชื่อผลงาน" },
      admin: {
        description: {
          en: "The project / trip name shown as the headline.",
          th: "ชื่อโครงการหรือทริปที่จะแสดงเป็นหัวข้อใหญ่บนการ์ดและหน้าบทความ",
        },
        placeholder: { en: "e.g. Incentive Trip — Hokkaido 2024", th: "เช่น ทริป Incentive — ฮอกไกโด 2024" },
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      label: { en: "Short summary", th: "คำโปรยสั้น ๆ" },
      maxLength: 200,
      admin: {
        description: {
          en: "1–2 sentences shown on the card and used for Google / link previews (max 200 chars).",
          th: "ข้อความสั้น 1–2 ประโยค แสดงบนการ์ด และใช้เป็นคำอธิบายตอนแชร์ลิงก์/บน Google (ไม่เกิน 200 ตัวอักษร)",
        },
        placeholder: { en: "e.g. A 4-day reward trip for 120 staff…", th: "เช่น ทริปรางวัล 4 วันสำหรับพนักงาน 120 คน…" },
      },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: { en: "Cover image", th: "รูปปก" },
      admin: {
        description: {
          en: "Main image for the card, hero & social share. Landscape (16:9) works best.",
          th: "รูปหลัก ใช้บนการ์ด หัวบทความ และตอนแชร์ลิงก์ — แนะนำรูปแนวนอน (สัดส่วน 16:9)",
        },
      },
    },
    {
      name: "content",
      type: "richText",
      label: { en: "Content", th: "เนื้อหา" },
      admin: {
        description: {
          en: "The full story — use the toolbar to add headings, lists, links & images.",
          th: "เนื้อหาเต็มของผลงาน — ใช้แถบเครื่องมือด้านบนเพื่อใส่หัวข้อ รายการ ลิงก์ และรูปภาพ",
        },
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: { en: "Slug (URL)", th: "Slug (ส่วนของลิงก์)" },
      admin: {
        position: "sidebar",
        description: {
          en: "Leave blank to auto-generate from the title.",
          th: "เว้นว่างได้ ระบบจะสร้างให้อัตโนมัติจากชื่อผลงาน (เป็นส่วนท้ายของลิงก์ /portfolio/…)",
        },
      },
      hooks: {
        beforeValidate: [({ value, data }) => slugify(value || data?.title)],
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: { en: "Category", th: "หมวดหมู่" },
      admin: {
        position: "sidebar",
        description: {
          en: "Group this post under a category.",
          th: "เลือกหมวดหมู่ให้ผลงานนี้ (เพิ่ม/แก้รายการหมวดหมู่ได้ที่เมนู “หมวดหมู่”)",
        },
      },
    },
    {
      name: "client",
      type: "text",
      label: { en: "Client / company", th: "ชื่อลูกค้า / องค์กร" },
      admin: {
        position: "sidebar",
        description: {
          en: "Optional — the organization this trip was for.",
          th: "ไม่บังคับ — ชื่อองค์กรหรือบริษัทที่จัดทริปให้",
        },
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: { en: "Publish date", th: "วันที่เผยแพร่" },
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        description: {
          en: "Used to order posts (newest first). Today is filled in automatically.",
          th: "ใช้จัดเรียงลำดับผลงาน (ใหม่สุดขึ้นก่อน) — ระบบใส่วันที่วันนี้ให้อัตโนมัติ แก้ไขได้",
        },
        date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy HH:mm" },
      },
    },
  ],
};
