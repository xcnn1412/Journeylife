import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections";
import { StickyCTA } from "@/components/StickyCTA";
import { TourDetailView } from "@/components/TourDetailView";
import { RevealObserver } from "@/lib/site-context";
import { getTourDetail } from "@/lib/tour-detail";

// ISR — each tour page caches for 10 minutes (matches the booking data).
export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tour = await getTourDetail(id);
  if (!tour) return { title: "ไม่พบโปรแกรมทัวร์ · JOURNEYLIFE" };
  return {
    title: `${tour.title} · JOURNEYLIFE`,
    description: tour.highlights.slice(0, 3).join(" · ") || tour.title,
    alternates: { canonical: `/outboundtrip/tour/${id}` },
    openGraph: { title: tour.title, images: tour.image ? [tour.image] : undefined },
  };
}

export default async function TourPage({ params }: { params: Promise<{ id: string }> }) {
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
