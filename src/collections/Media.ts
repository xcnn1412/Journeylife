import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    mimeTypes: ["image/*", "video/mp4"],
    // Images are resized via sharp; videos skip resizing automatically.
    imageSizes: [
      { name: "thumbnail", width: 480 },
      { name: "card", width: 1024 },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
  },
  fields: [{ name: "alt", type: "text" }],
};
