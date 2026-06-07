import type { Block } from "payload";

/**
 * Recommended "widgets" for writing portfolio / blog posts.
 *
 * These are Lexical *blocks* — editors insert them from the "+" menu inside the
 * content editor and manage each one as its own draggable section. Block data is
 * stored inside the richText JSON (no extra DB tables), and rendered on the site
 * by the converters in src/components/richtext.tsx.
 */
const GROUP = { en: "Blog widgets", th: "วิดเจ็ตสำหรับบล็อก" };

/** Highlighted note / tip / warning box. */
export const CalloutBlock: Block = {
  slug: "callout",
  interfaceName: "CalloutBlock",
  labels: { singular: { en: "Callout box", th: "กล่องเน้นข้อความ" }, plural: { en: "Callout boxes", th: "กล่องเน้นข้อความ" } },
  admin: { group: GROUP },
  fields: [
    {
      name: "style",
      type: "select",
      defaultValue: "info",
      label: { en: "Style", th: "รูปแบบ" },
      options: [
        { label: { en: "Info", th: "ข้อมูลทั่วไป" }, value: "info" },
        { label: { en: "Tip", th: "เคล็ดลับ" }, value: "tip" },
        { label: { en: "Highlight", th: "ไฮไลต์สำคัญ" }, value: "highlight" },
        { label: { en: "Warning", th: "ข้อควรระวัง" }, value: "warning" },
      ],
    },
    { name: "title", type: "text", label: { en: "Title (optional)", th: "หัวข้อ (ไม่บังคับ)" } },
    { name: "body", type: "textarea", required: true, label: { en: "Text", th: "ข้อความ" } },
  ],
};

/** Pull-quote / customer testimonial. */
export const QuoteBlock: Block = {
  slug: "quote",
  interfaceName: "QuoteBlock",
  labels: { singular: { en: "Quote / Testimonial", th: "คำพูด / รีวิวลูกค้า" }, plural: { en: "Quotes", th: "คำพูด" } },
  admin: { group: GROUP },
  fields: [
    { name: "quote", type: "textarea", required: true, label: { en: "Quote", th: "ข้อความคำพูด" } },
    { name: "author", type: "text", label: { en: "Author", th: "ชื่อผู้พูด" } },
    { name: "role", type: "text", label: { en: "Role / Company", th: "ตำแหน่ง / บริษัท" } },
  ],
};

/** Row of headline numbers (e.g. 120+ trips · 98% retention). */
export const StatsBlock: Block = {
  slug: "stats",
  interfaceName: "StatsBlock",
  labels: { singular: { en: "Key numbers", th: "ตัวเลขเด่น" }, plural: { en: "Key numbers", th: "ตัวเลขเด่น" } },
  admin: { group: GROUP },
  fields: [
    {
      name: "items",
      type: "array",
      minRows: 1,
      maxRows: 4,
      labels: { singular: { en: "Number", th: "ตัวเลข" }, plural: { en: "Numbers", th: "ตัวเลข" } },
      admin: { description: { en: "Add 2–4 stats for the best layout.", th: "แนะนำใส่ 2–4 ตัวเลข จะจัดวางสวยที่สุด" } },
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
          label: { en: "Number", th: "ตัวเลข" },
          admin: { description: { en: "e.g. 120+", th: "เช่น 120+" } },
        },
        {
          name: "label",
          type: "text",
          required: true,
          label: { en: "Caption", th: "คำอธิบาย" },
          admin: { description: { en: "e.g. Trips delivered", th: "เช่น ทริปที่จัด" } },
        },
      ],
    },
  ],
};

/** Multi-image gallery grid. */
export const GalleryBlock: Block = {
  slug: "gallery",
  interfaceName: "GalleryBlock",
  labels: { singular: { en: "Image gallery", th: "แกลเลอรีรูปภาพ" }, plural: { en: "Image galleries", th: "แกลเลอรีรูปภาพ" } },
  admin: {
    group: GROUP,
    // Dynamic header label: shows the chosen layout + image count per gallery.
    components: { Label: "@/components/admin/GalleryBlockLabel#GalleryBlockLabel" },
  },
  fields: [
    {
      name: "layout",
      type: "select",
      defaultValue: "grid2",
      label: { en: "Layout", th: "รูปแบบการจัดวาง" },
      admin: { description: { en: "How the images are arranged on the page.", th: "เลือกวิธีจัดวางรูปบนหน้าเว็บ" } },
      options: [
        { label: { en: "Grid · 2 columns", th: "กริด · 2 คอลัมน์" }, value: "grid2" },
        { label: { en: "Grid · 3 columns", th: "กริด · 3 คอลัมน์" }, value: "grid3" },
        { label: { en: "Masonry (keep ratios)", th: "Masonry (คงสัดส่วนรูป)" }, value: "masonry" },
        { label: { en: "Carousel (swipe sideways)", th: "สไลด์เลื่อนแนวนอน" }, value: "carousel" },
      ],
    },
    {
      name: "images",
      type: "array",
      minRows: 1,
      labels: { singular: { en: "Image", th: "รูปภาพ" }, plural: { en: "Images", th: "รูปภาพ" } },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true, label: { en: "Image", th: "รูปภาพ" } },
        { name: "caption", type: "text", label: { en: "Caption", th: "คำบรรยาย" } },
      ],
    },
  ],
};

/** Customer review cards (avatar · stars · name · text), like a testimonials wall. */
export const ReviewsBlock: Block = {
  slug: "reviews",
  interfaceName: "ReviewsBlock",
  labels: { singular: { en: "Customer reviews", th: "รีวิวจากลูกค้า" }, plural: { en: "Customer reviews", th: "รีวิวจากลูกค้า" } },
  admin: { group: GROUP },
  fields: [
    {
      name: "heading",
      type: "text",
      label: { en: "Heading (optional)", th: "หัวข้อ (ไม่บังคับ)" },
      admin: { description: { en: "e.g. What our clients say", th: "เช่น เสียงจากลูกค้าของเรา" } },
    },
    {
      name: "items",
      type: "array",
      minRows: 1,
      labels: { singular: { en: "Review", th: "รีวิว" }, plural: { en: "Reviews", th: "รีวิว" } },
      fields: [
        { name: "name", type: "text", required: true, label: { en: "Reviewer name", th: "ชื่อผู้รีวิว" } },
        {
          name: "rating",
          type: "select",
          defaultValue: "5",
          label: { en: "Star rating", th: "คะแนนดาว" },
          options: [
            { label: "★★★★★ (5)", value: "5" },
            { label: "★★★★ (4)", value: "4" },
            { label: "★★★ (3)", value: "3" },
            { label: "★★ (2)", value: "2" },
            { label: "★ (1)", value: "1" },
          ],
        },
        {
          name: "date",
          type: "text",
          label: { en: "Date (optional)", th: "วันที่ (ไม่บังคับ)" },
          admin: { description: { en: "e.g. Jul 2025", th: "เช่น ก.ค. 2025" } },
        },
        { name: "text", type: "textarea", required: true, label: { en: "Review text", th: "ข้อความรีวิว" } },
      ],
    },
  ],
};

/** Embedded YouTube / Vimeo video. */
export const VideoBlock: Block = {
  slug: "video",
  interfaceName: "VideoBlock",
  labels: { singular: { en: "Video embed", th: "ฝังวิดีโอ" }, plural: { en: "Video embeds", th: "ฝังวิดีโอ" } },
  admin: { group: GROUP },
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
      label: { en: "Video link (YouTube / Vimeo)", th: "ลิงก์วิดีโอ (YouTube / Vimeo)" },
      admin: { description: { en: "Paste the full video URL.", th: "วางลิงก์วิดีโอแบบเต็ม เช่น https://youtu.be/..." } },
    },
    { name: "caption", type: "text", label: { en: "Caption", th: "คำบรรยาย" } },
  ],
};

/** Call-to-action box with a button (e.g. request a quote). */
export const CtaBlock: Block = {
  slug: "cta",
  interfaceName: "CtaBlock",
  labels: { singular: { en: "Call to action", th: "กล่องชวนติดต่อ (CTA)" }, plural: { en: "Calls to action", th: "กล่องชวนติดต่อ" } },
  admin: { group: GROUP },
  fields: [
    { name: "heading", type: "text", required: true, label: { en: "Heading", th: "หัวข้อ" } },
    { name: "description", type: "textarea", label: { en: "Description", th: "รายละเอียด" } },
    {
      name: "buttonLabel",
      type: "text",
      required: true,
      defaultValue: "ขอใบเสนอราคา",
      label: { en: "Button label", th: "ข้อความบนปุ่ม" },
    },
    {
      name: "buttonHref",
      type: "text",
      required: true,
      defaultValue: "/#contact",
      label: { en: "Button link", th: "ลิงก์ปุ่ม" },
      admin: {
        description: {
          en: "URL, #contact, tel:0..., or a LINE link.",
          th: "ใส่ลิงก์ เช่น #contact, tel:020514240 หรือ https://lin.ee/...",
        },
      },
    },
  ],
};

/** Ordered list of all blog widgets, passed to BlocksFeature. */
export const blogBlocks: Block[] = [CalloutBlock, QuoteBlock, ReviewsBlock, StatsBlock, GalleryBlock, VideoBlock, CtaBlock];
