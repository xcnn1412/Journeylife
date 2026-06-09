import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, localeFromAcceptLanguage } from "@/lib/locale";

/**
 * Locale routing: every public page lives under /th, /en or /zh. Requests that
 * arrive without a locale prefix (the bare "/", or old links like /aboutus) are
 * redirected to the visitor's preferred locale — remembered cookie first, then
 * the browser's Accept-Language, then Thai as the default.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Already locale-prefixed → nothing to do.
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  const cookieLang = req.cookies.get("jl-lang")?.value;
  const locale = (LOCALES as readonly string[]).includes(cookieLang || "")
    ? (cookieLang as string)
    : localeFromAcceptLanguage(req.headers.get("accept-language")) || DEFAULT_LOCALE;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, Payload (/admin, /api), the preview route, SEO files
  // and any static asset (anything with a file extension).
  matcher: ["/((?!_next/|api/|admin|next/preview|sitemap.xml|robots.txt|.*\\..*).*)"],
};
