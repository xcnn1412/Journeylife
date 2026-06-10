import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections";
import { StickyCTA } from "@/components/StickyCTA";
import { TourDetailView } from "@/components/TourDetailView";
import { RevealObserver } from "@/lib/site-context";
import { isLocale, localeAlternates, LOCALES, type Locale } from "@/lib/locale";
import { getTourDetail } from "@/lib/tour-detail";
import { getHotDeals } from "@/lib/hot-deals";

// ISR — each tour page caches for 10 minutes (matches the booking data).
export const revalidate = 600;

// Pre-render the currently-promoted tours (the ones most likely to be opened)
// so their first visit is served from the cache instead of a cold upstream
// scrape. Any other id still renders on demand (dynamicParams defaults to true).
export async function generateStaticParams() {
  const deals = await getHotDeals();
  const ids = [...new Set(deals.map((d) => d.id))];
  return LOCALES.flatMap((lang) => ids.map((id) => ({ lang, id })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  const tour = await getTourDetail(id);
  if (!tour) return { title: "ไม่พบโปรแกรมทัวร์ · JOURNEYLIFE" };
  return {
    title: `${tour.title} · JOURNEYLIFE`,
    description: tour.highlights.slice(0, 3).join(" · ") || tour.title,
    alternates: localeAlternates(l, `/outboundtrip/tour/${id}`),
    openGraph: { title: tour.title, images: tour.image ? [tour.image] : undefined },
  };
}

export default async function TourPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { id } = await params;
  const tour = await getTourDetail(id);
  if (!tour) notFound();

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />
      <main>
        <TourDetailView tour={tour} />
      </main>
      <Footer />
    </>
  );
}
