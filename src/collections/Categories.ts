import type { CollectionConfig } from "payload";
import { slugify } from "../lib/slug";
import { isAdmin, isStaff } from "./access";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: { en: "Category", th: "หมวดหมู่" },
    plural: { en: "Categories", th: "หมวดหมู่" },
  },
  access: { read: () => true, create: isStaff, update: isStaff, delete: isAdmin },
  admin: {
    useAsTitle: "name",
    group: { en: "Website content", th: "เนื้อหาเว็บไซต์" },
    description: {
      en: "Tags used to group portfolio posts (e.g. Seminar, Team Building, Overseas).",
      th: "ป้ายหมวดหมู่สำหรับจัดกลุ่มผลงาน เช่น สัมมนา, ทีมบิลดิ้ง, ทัวร์ต่างประเทศ",
    },
    defaultColumns: ["name", "slug"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: { en: "Name", th: "ชื่อหมวดหมู่" },
      admin: {
        description: { en: "e.g. Seminar, Team Building", th: "เช่น สัมมนา, ทีมบิลดิ้ง, ทัวร์ต่างประเทศ" },
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
          en: "Leave blank to auto-generate from the name.",
          th: "เว้นว่างได้ ระบบจะสร้างให้อัตโนมัติจากชื่อหมวดหมู่",
        },
      },
      hooks: {
        beforeValidate: [({ value, data }) => slugify(value || data?.name)],
      },
    },
  ],
};
