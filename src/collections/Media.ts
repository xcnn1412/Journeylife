import type { CollectionConfig } from "payload";
import { isAdmin, isStaff } from "./access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: { en: "Media file", th: "ไฟล์ภาพ / วิดีโอ" },
    plural: { en: "Media library", th: "คลังรูปภาพ" },
  },
  access: { read: () => true, create: isStaff, update: isStaff, delete: isAdmin },
  admin: {
    group: { en: "Library", th: "คลังไฟล์" },
    description: {
      en: "Upload images & videos here. Every image is automatically resized and compressed — just drag & drop, no need to shrink files yourself.",
      th: "อัปโหลดรูปภาพและวิดีโอที่นี่ — ระบบจะ “ย่อขนาดและบีบอัดรูปให้อัตโนมัติ” ทุกครั้ง ลากไฟล์มาวางได้เลย ไม่ต้องย่อรูปเองก่อน",
    },
    defaultColumns: ["filename", "alt", "mimeType", "filesize"],
    listSearchableFields: ["filename", "alt"],
  },
  upload: {
    // Explicit safe raster types + mp4 (excludes SVG — an inline-XSS surface — and
    // other exotic image/* types). A 50 MB upload size cap is set globally in
    // payload.config.ts (config.upload.limits.fileSize) to avoid DoS / R2 cost abuse.
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "video/mp4"],
    adminThumbnail: "thumbnail",
    focalPoint: true,
    crop: true,
    displayPreview: true,
    // ── Always shrink images before storing (videos pass through untouched) ──
    // 1) Cap the master image so huge phone/camera photos are never stored full-size.
    resizeOptions: { width: 2560, height: 2560, fit: "inside", withoutEnlargement: true },
    // 2) Re-encode the master to WebP — a big size win with broad browser support.
    formatOptions: { format: "webp", options: { quality: 82 } },
    // Variants. NOTE: size names (thumbnail/card/og) are read by the website — do not rename.
    imageSizes: [
      // Square (1:1) crop — used for the homepage "ผลงานของเรา" post cards + admin thumbs.
      { name: "thumbnail", width: 480, height: 480, position: "centre", formatOptions: { format: "webp", options: { quality: 78 } } },
      { name: "card", width: 1024, formatOptions: { format: "webp", options: { quality: 80 } } },
      // Social/OG image stays JPEG for maximum compatibility (LINE, Facebook, X).
      {
        name: "og",
        width: 1200,
        height: 630,
        position: "centre",
        formatOptions: { format: "jpeg", options: { quality: 82, mozjpeg: true } },
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: { en: "Alt text (image description)", th: "คำอธิบายรูป (Alt text)" },
      admin: {
        description: {
          en: "Briefly describe what's in the image — helps accessibility & Google.",
          th: "อธิบายสั้น ๆ ว่าในรูปคืออะไร ช่วยเรื่องการเข้าถึงและ SEO เช่น “ภาพหมู่ทีมงานที่ฮอกไกโด”",
        },
        placeholder: { en: "e.g. Team group photo at Hokkaido", th: "เช่น ภาพหมู่ทีมงานที่ฮอกไกโด" },
      },
    },
  ],
};
