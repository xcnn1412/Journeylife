/** Slugify that keeps Thai letters; lowercases latin, spaces → "-". */
export function slugify(input?: string | null): string {
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
