/**
 * Locale routing helpers — the site serves real, server-rendered pages under
 * /th, /en and /zh (so Googlebot / Google Ads see localized HTML directly).
 * The active locale comes from the URL's first path segment (`[lang]`), not
 * from localStorage.
 */
import type { Lang } from "./i18n";

export const LOCALES = ["th", "en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "th";

export function isLocale(x: string | undefined | null): x is Locale {
  return !!x && (LOCALES as readonly string[]).includes(x);
}

// matches a leading /th, /en or /zh segment (followed by "/" or end-of-string)
const LOCALE_RE = /^\/(?:th|en|zh)(?=\/|$)/;

/**
 * Prefix an internal app path with the active locale. External links, in-page
 * anchors, mailto:/tel: and already-prefixed paths are handled correctly.
 *   localeHref("/contact", "en")        → "/en/contact"
 *   localeHref("/", "zh")               → "/zh"
 *   localeHref("/#our-services", "en")  → "/en#our-services"
 *   localeHref("https://x.com", "en")   → "https://x.com" (untouched)
 */
export function localeHref(href: string, lang: Locale): string {
  if (!href.startsWith("/")) return href; // external / relative / mailto: / tel:
  if (href.startsWith("/#")) return `/${lang}${href.slice(1)}`; // home anchor
  const stripped = href.replace(LOCALE_RE, "");
  return stripped === "" || stripped === "/" ? `/${lang}` : `/${lang}${stripped}`;
}

/** hreflang map for a path WITHOUT a locale prefix ("" for home, "/aboutus", …). */
export function altLanguages(pathNoLocale: string): Record<string, string> {
  return {
    "th-TH": `/th${pathNoLocale}`,
    "en-US": `/en${pathNoLocale}`,
    "zh-CN": `/zh${pathNoLocale}`,
    "x-default": `/th${pathNoLocale}`,
  };
}

/** canonical + hreflang alternates block for a page's Metadata. */
export function localeAlternates(lang: Locale, pathNoLocale = "") {
  return { canonical: `/${lang}${pathNoLocale}`, languages: altLanguages(pathNoLocale) };
}

/** Pick a localized value from a {th,en,zh} record. */
export function pick<T>(lang: Lang, v: Record<Lang, T>): T {
  return v[lang];
}

/** OpenGraph locale code for a given language. */
export const OG_LOCALE: Record<Locale, string> = { th: "th_TH", en: "en_US", zh: "zh_CN" };

/** Resolve the best matching locale from an Accept-Language header (or null). */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("en")) return "en";
    if (tag.startsWith("th")) return "th";
  }
  return null;
}
