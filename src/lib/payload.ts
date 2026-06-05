import config from "@payload-config";
import { getPayload } from "payload";
import type { Media } from "@/payload-types";

/** Cached Payload Local API instance (server-only). */
export const getPayloadClient = () => getPayload({ config });

/** Pull a usable src/alt from a Media relationship (populated when depth ≥ 1). */
export function mediaImage(
  m: number | Media | null | undefined,
  size: "thumbnail" | "card" | "og" = "card",
): { src: string; alt: string } | null {
  if (!m || typeof m !== "object") return null;
  const src = m.sizes?.[size]?.url || m.url;
  if (!src) return null;
  return { src, alt: m.alt || "" };
}
