import { Hero, Nav } from "@/components/Nav";
import {
  Clients,
  ContactStrip,
  Footer,
  HowWeWork,
  LuckyDraw,
  OverseasPackages,
  Pillars,
  Portfolio,
  Registration,
  TrustBar,
} from "@/components/sections";
import type { PortfolioCard } from "@/components/sections/portfolio";
import { StickyCTA } from "@/components/StickyCTA";
import { RevealObserver } from "@/lib/site-context";
import { getPayloadClient, mediaImage } from "@/lib/payload";

// Statically cached + ISR; the Posts hooks revalidate "/" on publish/edit.
export const revalidate = 600;

/** Latest published portfolio posts, shown as 1:1 cards in the "ผลงานของเรา" section. */
async function getPortfolioCards(): Promise<PortfolioCard[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      sort: "-publishedAt",
      depth: 1,
      limit: 6,
      select: { title: true, slug: true, cover: true },
    });
    return docs
      .map((d) => {
        const img = mediaImage(d.cover, "thumbnail"); // 1:1 cover
        return img ? { slug: String(d.slug), title: d.title, src: img.src, alt: img.alt || d.title } : null;
      })
      .filter((c): c is PortfolioCard => c !== null);
  } catch {
    return []; // DB unreachable → section just shows its heading + CTA
  }
}

export default async function Home() {
  const portfolioCards = await getPortfolioCards();

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* Lead — first impression */}
        <Hero />

        {/* Trust — credentials band */}
        <TrustBar />

        {/* Offer — what we do */}
        <Pillars />
        <OverseasPackages />
        <Registration />
        <LuckyDraw />

        {/* Proof of work + who trusts us */}
        <Portfolio posts={portfolioCards} />
        <Clients />

        {/* Conversion — 3-step path + lead form (owns the #contact anchor) */}
        <HowWeWork />

        {/* Contact channels — LINE / Messenger / Call / TikTok */}
        <ContactStrip />
      </main>

      <Footer />
    </>
  );
}
