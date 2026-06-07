"use client";

import { useFormFields } from "@payloadcms/ui";

/**
 * Dynamic header label for the Gallery block in the content editor.
 * Reads the block's own form fields and shows e.g.
 *   "แกลเลอรีรูปภาพ · กริด 2 คอลัมน์ · 3 รูป"
 * so editors can tell each gallery (and its layout) apart at a glance.
 */
const LAYOUT_LABEL: Record<string, string> = {
  grid2: "กริด 2 คอลัมน์",
  grid3: "กริด 3 คอลัมน์",
  masonry: "Masonry",
  carousel: "สไลด์เลื่อนแนวนอน",
};

export function GalleryBlockLabel() {
  // Return a primitive string so useFormFields can cheaply compare and avoid re-renders.
  const summary = useFormFields(([fields]) => {
    const layout = (fields?.layout?.value as string | undefined) ?? "grid2";
    const count = Object.keys(fields ?? {}).filter((k) => /^images\.\d+\.image$/.test(k)).length;
    return `${layout}|${count}`;
  });

  const [layout, countStr] = summary.split("|");
  const count = Number(countStr) || 0;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <strong>แกลเลอรีรูปภาพ</strong>
      <span style={{ opacity: 0.65, fontWeight: 400 }}>
        · {LAYOUT_LABEL[layout] ?? layout} · {count} รูป
      </span>
    </span>
  );
}
