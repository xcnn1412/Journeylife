import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { StickyCTA } from "@/components/StickyCTA";
import { TourSearch } from "@/components/TourSearch";
import { TourResults } from "@/components/TourResults";
import { RevealObserver } from "@/lib/site-context";
import { searchTours, SEARCH_KEYS } from "@/lib/tour-search";

export const metadata: Metadata = {
  title: "ผลการค้นหาทัวร์ · JOURNEYLIFE",
  description: "ค้นหาแพ็กเกจทัวร์ต่างประเทศคุณภาพจาก Journey Life — เลือกประเทศ เมือง ช่วงราคา และจำนวนวัน",
  robots: { index: false, follow: true }, // search permutations shouldn't be indexed
  alternates: { canonical: "/outboundtrip" },
};

type SP = Record<string, string | string[] | undefined>;

export default async function SearchPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const params: Record<string, string> = {};
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
    if (v) params[k] = v;
  }

  const { results, fullUrl } = await searchTours(params);

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* ── Header + refine form ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <Container className="relative pt-32 md:pt-40 pb-12 md:pb-16">
            <div className="mb-8 text-center">
              <Link
                href="/outboundtrip"
                className="inline-flex items-center gap-1.5 text-[12px] tracking-wide-cap uppercase font-semibold text-white/60 hover:text-white transition-colors"
              >
                <span aria-hidden>←</span> ทัวร์ต่างประเทศ
              </Link>
              <h1 className="h-display mt-4 text-white" style={{ fontSize: "clamp(30px, 4.4vw, 56px)" }}>
                ผลการค้นหาทัวร์
              </h1>
              <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-5" />
            </div>
            <TourSearch />
          </Container>
        </section>

        {/* ── Results ── */}
        <section className="bg-brand-paper">
          <TourResults results={results} seeAllUrl={fullUrl} />
        </section>
      </main>

      <Footer />
    </>
  );
}
