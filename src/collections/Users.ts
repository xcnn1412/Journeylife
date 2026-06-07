import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  // Without this, Payload's default access (any logged-in user) would let an
  // "editor" create admins, delete users, or self-escalate via the `role` field.
  access: {
    create: ({ req }) => req.user?.role === "admin",
    // Admins see everyone; others may read only their own account (account page).
    read: ({ req }) => (req.user?.role === "admin" ? true : { id: { equals: req.user?.id } }),
    update: ({ req }) => (req.user?.role === "admin" ? true : { id: { equals: req.user?.id } }),
    delete: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Bootstrap safety: the very first user created is always an admin, so a
        // fresh install can never lock itself out of user/role management.
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users" });
          if (totalDocs === 0) data.role = "admin";
        }
        return data;
      },
    ],
  },
  labels: {
    singular: { en: "User", th: "ผู้ใช้งาน" },
    plural: { en: "Users", th: "ผู้ใช้งาน" },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    group: { en: "System settings", th: "ตั้งค่าระบบ" },
    // Hide the Users collection from non-admins (they keep their own account page).
    hidden: ({ user }) => user?.role !== "admin",
    description: {
      en: "People who can sign in to manage the website.",
      th: "รายชื่อผู้ที่สามารถเข้าสู่ระบบเพื่อจัดการเว็บไซต์ได้",
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: { en: "Full name", th: "ชื่อ-นามสกุล" },
      admin: {
        description: { en: "Display name shown in the admin.", th: "ชื่อที่จะแสดงในระบบหลังบ้าน" },
      },
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      // Only admins may set/change roles — blocks self-escalation even when an
      // editor edits their own account (the field value is ignored, not errored).
      access: {
        create: ({ req }) => req.user?.role === "admin",
        update: ({ req }) => req.user?.role === "admin",
      },
      label: { en: "Role", th: "บทบาท / สิทธิ์การใช้งาน" },
      admin: {
        description: {
          en: "Admin = full access · Editor = manage content.",
          th: "ผู้ดูแลระบบ (Admin) = จัดการได้ทุกอย่าง · ผู้แก้ไข (Editor) = จัดการเนื้อหา/ผลงาน",
        },
      },
      options: [
        { label: { en: "Admin", th: "ผู้ดูแลระบบ (Admin)" }, value: "admin" },
        { label: { en: "Editor", th: "ผู้แก้ไขเนื้อหา (Editor)" }, value: "editor" },
      ],
    },
  ],
};
