import type { CollectionConfig } from "payload";
import { isAdmin, isStaff } from "./access";

/**
 * Tours — a machine-written "read cache" of the okwebtour booking catalogue.
 *
 * Rows are populated by scripts/sync-tours.ts (Railway cron), NOT by hand. The
 * website reads from here via src/lib/tours-db.ts instead of scraping the PHP
 * booking site on every request. Heavy nested data (periods/itinerary/highlights)
 * is stored as JSON since it's never edited in the admin; flat indexed columns
 * back the search filters.
 */

async function revalidate(tourId?: string) {
  try {
    const { revalidatePath } = await import("next/cache");
    // Pages are locale-prefixed (/th, /en, /zh) — revalidate each locale.
    for (const l of ["th", "en", "zh"] as const) {
      revalidatePath(`/${l}/outboundtrip`);
      if (tourId) revalidatePath(`/${l}/outboundtrip/tour/${tourId}`);
    }
  } catch {
    /* called outside Next request scope (e.g. the sync CLI) — ignore */
  }
}

/** Fields the sync writes but no human should edit. */
const ro = { admin: { readOnly: true } } as const;

export const Tours: CollectionConfig = {
  slug: "tours",
  labels: {
    singular: { en: "Tour", th: "ทัวร์" },
    plural: { en: "Tours", th: "ทัวร์" },
  },
  access: { read: () => true, create: isStaff, update: isStaff, delete: isAdmin },
  admin: {
    useAsTitle: "title",
    group: { en: "Tours", th: "ทัวร์" },
    description: {
      en: "Auto-synced from the booking site — do not edit by hand. Managed by scripts/sync-tours.ts.",
      th: "ซิงค์อัตโนมัติจากระบบจองทัวร์ — ไม่ต้องแก้ไขด้วยมือ (ดูแลโดยสคริปต์ sync-tours)",
    },
    defaultColumns: ["code", "country", "priceFrom", "isHotDeal", "active", "detailSyncedAt"],
    listSearchableFields: ["title", "code", "country"],
  },
  hooks: {
    afterChange: [({ doc }) => void revalidate(doc?.tourId)],
    afterDelete: [({ doc }) => void revalidate(doc?.tourId)],
  },
  fields: [
    // ── Identity ──
    {
      name: "tourId",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: { en: "Tour ID", th: "รหัสภายใน (tour_id)" },
      admin: { description: { en: "okwebtour tour_id — the upsert key.", th: "tour_id จาก okwebtour — คีย์หลักสำหรับ upsert" }, readOnly: true },
    },
    { name: "code", type: "text", index: true, label: { en: "Tour code", th: "รหัสทัวร์" }, ...ro },
    { name: "title", type: "text", required: true, label: { en: "Title", th: "ชื่อทัวร์" }, ...ro },

    // ── List / card fields ──
    { name: "img", type: "text", label: { en: "Banner URL (source)", th: "ลิงก์รูป banner (ต้นทาง)" }, ...ro },
    { name: "bannerMedia", type: "upload", relationTo: "media", label: { en: "Banner (mirrored to R2)", th: "รูป banner (สำเนาบน R2)" }, ...ro },
    { name: "country", type: "text", index: true, label: { en: "Country", th: "ประเทศ" }, ...ro },
    { name: "city", type: "text", index: true, label: { en: "City", th: "เมือง" }, ...ro },
    { name: "days", type: "number", index: true, label: { en: "Days (number)", th: "จำนวนวัน (ตัวเลข)" }, ...ro },
    { name: "daysText", type: "text", label: { en: "Duration text", th: "ช่วงเวลา (ข้อความ)" }, ...ro },
    { name: "airline", type: "text", label: { en: "Airline", th: "สายการบิน" }, ...ro },
    { name: "priceFrom", type: "number", index: true, label: { en: "Price from", th: "ราคาเริ่มต้น" }, ...ro },

    // ── Hot-deal overlay ──
    { name: "isHotDeal", type: "checkbox", index: true, defaultValue: false, label: { en: "Hot deal", th: "โปรไฟไหม้" }, ...ro },
    { name: "discountPercent", type: "number", label: { en: "Discount %", th: "ส่วนลด %" }, ...ro },
    { name: "firePrice", type: "number", label: { en: "Fire price", th: "ราคาโปร" }, ...ro },
    { name: "originalPrice", type: "number", label: { en: "Original price", th: "ราคาเต็ม" }, ...ro },
    { name: "dealDateText", type: "text", label: { en: "Deal date text", th: "วันเดินทาง (โปร)" }, ...ro },
    { name: "dealImg", type: "text", label: { en: "Deal banner URL (source)", th: "ลิงก์รูปโปร (ต้นทาง)" }, ...ro },
    { name: "dealBannerMedia", type: "upload", relationTo: "media", label: { en: "Deal banner (mirrored)", th: "รูปโปร (สำเนา R2)" }, ...ro },
    { name: "dealAlt", type: "text", label: { en: "Deal banner alt", th: "alt รูปโปร" }, ...ro },

    // ── Detail (lazily hydrated from tour.php) ──
    { name: "image", type: "text", label: { en: "Hero image URL (source)", th: "ลิงก์รูป hero (ต้นทาง)" }, ...ro },
    { name: "heroMedia", type: "upload", relationTo: "media", label: { en: "Hero image (mirrored)", th: "รูป hero (สำเนา R2)" }, ...ro },
    { name: "pdf", type: "text", label: { en: "PDF programme", th: "ไฟล์ PDF โปรแกรม" }, ...ro },
    { name: "highlights", type: "json", label: { en: "Highlights", th: "ไฮไลท์" }, ...ro },
    { name: "periods", type: "json", label: { en: "Departure periods", th: "ช่วงวันเดินทาง" }, ...ro },
    { name: "itinerary", type: "json", label: { en: "Itinerary", th: "แผนการเดินทาง" }, ...ro },

    // ── Search support (derived) ──
    { name: "departures", type: "json", label: { en: "Departure dates (ISO)", th: "วันเดินทาง (ISO)" }, ...ro },
    { name: "departuresMin", type: "date", index: true, label: { en: "First departure", th: "วันเดินทางแรก" }, ...ro },
    { name: "departuresMax", type: "date", index: true, label: { en: "Last departure", th: "วันเดินทางสุดท้าย" }, ...ro },

    // ── Lifecycle / bookkeeping ──
    { name: "active", type: "checkbox", index: true, defaultValue: true, label: { en: "Active (in catalogue)", th: "ยังอยู่ในแคตตาล็อก" }, ...ro },
    { name: "listSyncedAt", type: "date", label: { en: "List synced at", th: "ซิงค์รายการล่าสุด" }, ...ro },
    { name: "detailSyncedAt", type: "date", label: { en: "Detail synced at", th: "ซิงค์รายละเอียดล่าสุด" }, ...ro },
    { name: "detailError", type: "text", label: { en: "Last detail error", th: "ข้อผิดพลาดล่าสุด (รายละเอียด)" }, ...ro },
  ],
};
