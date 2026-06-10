import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { StickyCTA } from "@/components/StickyCTA";
import { TourSearch } from "@/components/TourSearch";
import { TourResults } from "@/components/TourResults";
import { TourResultsSkeleton } from "@/components/TourResultsSkeleton";
import { RevealObserver } from "@/lib/site-context";
import { isLocale, localeAlternates, localeHref, type Locale } from "@/lib/locale";
import { I18N } from "@/lib/i18n";
import { searchTours, buildSearchUrl, SEARCH_KEYS, DEFAULT_MAX_PAGES, MAX_DEPTH_PAGES } from "@/lib/tour-search";

const SEARCH_META: Record<Locale, { title: string; description: string }> = {
  th: { title: "ผลการค้นหาทัวร์ · JOURNEYLIFE", description: "ค้นหาแพ็กเกจทัวร์ต่างประเทศคุณภาพจาก Journey Life — เลือกประเทศ เมือง ช่วงราคา และจำนวนวัน" },
  en: { title: "Tour search results · JOURNEYLIFE", description: "Search quality overseas tour packages by Journey Life — by country, city, price range and duration." },
  zh: { title: "旅游搜索结果 · JOURNEYLIFE", description: "搜索 Journey Life 优质海外旅游套餐 — 按国家、城市、价格区间与天数筛选。" },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  return {
    ...SEARCH_META[l],
    robots: { index: false, follow: true }, // search permutations shouldn't be indexed
    alternates: localeAlternates(l, "/outboundtrip"),
  };
}

type SP = Record<string, string | string[] | undefined>;

/** Build the clean filter map (SEARCH_KEYS only) from raw searchParams. */
function parseFilters(sp: SP): Record<string, string> {
  const filters: Record<string, string> = {};
  for (const k of SEARCH_KEYS) {
    let v = sp[k];
    if (typeof v !== "string") continue;
    v = v.trim();
    // Collapse any accidental double-encoding (router can re-encode a pre-encoded
    // query, leaving literal %XX sequences here) so Thai keywords match correctly.
    if (/%[0-9A-Fa-f]{2}/.test(v)) {
      try {
        v = decodeURIComponent(v);
      } catch {
        /* keep as-is */
      }
    }
    if (v) filters[k] = v;
  }
  return filters;
}

/**
 * Data-fetching half of the page. Lives inside <Suspense> so the upstream scrape
 * (the slow part) streams in after the shell — Nav + search form paint instantly
 * while a skeleton holds the results area.
 */
async function SearchResults({ filters, depth }: { filters: Record<string, string>; depth: number }) {
  const { results, fullUrl, totalPages, pagesFetched } = await searchTours(filters, depth);
  const currentSort = filters.sort ?? "new";
  return (
    <TourResults
      key={fullUrl}
      results={results}
      seeAllUrl={fullUrl}
      sort={currentSort}
      query={filters}
      depth={depth}
      hasMore={totalPages > pagesFetched}
    />
  );
}

export default async function SearchPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<SP> }) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : "th";
  const sp = await searchParams;
  const sr = I18N[lang].overseasPackages.searchResults;
  const filters = parseFilters(sp);

  // How deep to fetch: "load more" bumps `depth`; clamp to a sane ceiling.
  const rawDepth = Number(typeof sp.depth === "string" ? sp.depth : "");
  const depth = Number.isFinite(rawDepth) && rawDepth > 0 ? Math.min(rawDepth, MAX_DEPTH_PAGES) : DEFAULT_MAX_PAGES;

  // Re-suspend (show skeleton) only when the query/sort/depth genuinely changes.
  const suspenseKey = `${buildSearchUrl(filters)}|${depth}`;

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* ── Header + refine form (renders immediately) ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <Container className="relative pt-32 md:pt-40 pb-12 md:pb-16">
            <div className="mb-8 text-center">
              <Link
                href={localeHref("/outboundtrip", lang)}
                className="inline-flex items-center gap-1.5 text-[12px] tracking-wide-cap uppercase font-semibold text-white/60 hover:text-white transition-colors"
              >
                <span aria-hidden>←</span> {I18N[lang].nav.overseas}
              </Link>
              <h1 className="h-display mt-4 text-white" style={{ fontSize: "clamp(30px, 4.4vw, 56px)" }}>
                {sr.title}
              </h1>
              <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-5" />
            </div>
            <TourSearch initial={filters} />
          </Container>
        </section>

        {/* ── Results (streamed) ── */}
        <section className="bg-brand-paper">
          <Suspense key={suspenseKey} fallback={<TourResultsSkeleton />}>
            <SearchResults filters={filters} depth={depth} />
          </Suspense>
        </section>
      </main>

      <Footer />
    </>
  );
}
