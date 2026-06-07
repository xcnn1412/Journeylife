import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { RevealObserver } from "@/lib/site-context";
import { getPayloadClient, mediaImage } from "@/lib/payload";

// Statically cached + ISR (was force-dynamic = a DB query on every request).
// Content edits revalidate instantly via revalidatePath() in the Posts hooks;
// this 10-min window is just a safety-net fallback.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "ผลงานของเรา · JOURNEYLIFE",
  description: "รวมผลงานกรุ๊ปทัวร์ สัมมนา และอีเวนต์องค์กรที่ JOURNEYLIFE ดูแลให้องค์กรชั้นนำ",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    depth: 1,
    limit: 60,
    // Only the fields the cards render — skips fetching the heavy rich-text
    // `content` JSON for every post (big payload + DB savings).
    select: { title: true, slug: true, excerpt: true, cover: true },
  });

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* Navy header (keeps the white nav legible) */}
        <section className="relative overflow-hidden bg-brand-blue text-white">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-brand-red" />
          <Container className="relative pt-36 md:pt-44 pb-16 md:pb-20 text-center">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.55)" }}>Portfolio</span>
            <h1 className="h-display mt-6 text-white" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>ผลงานของเรา</h1>
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-6" />
            <p className="mt-6 max-w-[56ch] mx-auto text-[16px] md:text-[18px] font-light leading-[1.7] text-white/70">
              ทริปจริง องค์กรจริง ความประทับใจจริง — ผลงานที่เราภูมิใจ
            </p>
          </Container>
        </section>

        {/* Posts */}
        <section className="bg-brand-paper border-b border-brand-line py-16 md:py-24">
          <Container>
            {docs.length === 0 ? (
              <p className="text-center text-brand-mute py-16">ยังไม่มีผลงานเผยแพร่ในขณะนี้</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {docs.map((post) => {
                  const cover = mediaImage(post.cover);
                  return (
                    <Link
                      key={post.id}
                      href={`/portfolio/${post.slug}`}
                      className="reveal card-lift group relative flex flex-col overflow-hidden rounded-xl bg-white border border-brand-line"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-brand-ink">
                        {cover && (
                          <Image src={cover.src} alt={cover.alt || post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                        )}
                        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-ink/35 to-transparent" />
                      </div>
                      <div className="flex flex-1 flex-col p-5 md:p-6">
                        <h2 className="text-brand-blue font-semibold text-[20px] md:text-[22px] leading-tight">{post.title}</h2>
                        {post.excerpt && (
                          <p className="mt-2.5 text-[13px] text-brand-mute font-light leading-[1.6] line-clamp-2 flex-1">{post.excerpt}</p>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-wide-cap uppercase font-semibold text-brand-blue transition-colors group-hover:text-brand-red">
                          อ่านต่อ
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
