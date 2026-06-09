import { slugify } from "./slug";

/** Resolve the public site origin (server-side helpers + admin config). */
function serverURL(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    "http://localhost:3000"
  );
}

/**
 * Builds the URL used by both the "Preview" button (admin.preview) and the
 * Live Preview iframe (admin.livePreview). It points at the `/next/preview`
 * route, which enables Next draft mode and then redirects to the live page —
 * so editors see the *current draft* (including unpublished edits), not just
 * the published version.
 */
export function previewPath(doc: { slug?: unknown; title?: unknown } | null | undefined): string {
  const slug =
    (typeof doc?.slug === "string" && doc.slug) ||
    slugify(typeof doc?.title === "string" ? doc.title : "");
  // Before the first save a post may have no slug yet — fall back to the listing page.
  // Pages are locale-prefixed; preview opens the Thai (default) locale.
  const target = slug ? `/th/portfolio/${slug}` : "/th/portfolio";

  const params = new URLSearchParams({ path: target });
  const secret = process.env.PREVIEW_SECRET;
  if (secret) params.set("secret", secret);

  return `${serverURL()}/next/preview?${params.toString()}`;
}
