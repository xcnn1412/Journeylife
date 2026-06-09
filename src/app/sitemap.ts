import type { MetadataRoute } from "next";
import { I18N } from "@/lib/i18n";
import { LOCALES } from "@/lib/locale";
import { getPayloadClient } from "@/lib/payload";

const BASE = "https://journeylife.co.th";
const HREF: Record<string, string> = { th: "th-TH", en: "en-US", zh: "zh-CN" };

// Static, indexable routes (without locale prefix). The /outboundtrip/search
// route is intentionally excluded (noindex search permutations).
const STATIC = ["", "/aboutus", "/services", "/outboundtrip", "/portfolio", "/contact"];

async function portfolioPaths(): Promise<string[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      select: { slug: true },
      depth: 0,
      limit: 1000,
    });
    return docs.map((d) => `/portfolio/${String(d.slug)}`).filter((p) => p !== "/portfolio/");
  } catch {
    return []; // DB unreachable at build → ship the static + service entries only
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = I18N.en.pillars.items.map((i) => `/services/${i.slug}`);
  const paths = [...STATIC, ...services, ...(await portfolioPaths())];
  const now = new Date();

  // One entry per logical page, with hreflang alternates for all three locales
  // (canonical URL points at the Thai/default version).
  return paths.map((p) => ({
    url: `${BASE}/th${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [HREF[l], `${BASE}/${l}${p}`])),
    },
  }));
}
