import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Nav } from "@/components/Nav";
import { StickyCTA } from "@/components/StickyCTA";
import { Contact, Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { RevealObserver } from "@/lib/site-context";
import { getPayloadClient, mediaImage } from "@/lib/payload";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug }, _status: { equals: "published" } },
    depth: 2,
    limit: 1,
  });
  return docs[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const og = mediaImage(post.cover, "og");
  return {
    title: `${post.title} · ผลงาน · JOURNEYLIFE`,
    description: post.excerpt || undefined,
    alternates: { canonical: `/portfolio/${slug}` },
    openGraph: { title: post.title, description: post.excerpt || undefined, images: og ? [og.src] : undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const cover = mediaImage(post.cover, "og");
  const gallery = (post.gallery ?? [])
    .map((g) => mediaImage(g.image, "card"))
    .filter((x): x is { src: string; alt: string } => Boolean(x));

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[56vh] items-end overflow-hidden text-white">
          {cover && <Image src={cover.src} alt={cover.alt || post.title} fill priority sizes="100vw" className="object-cover -z-10" />}
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-brand-ink via-brand-ink/55 to-brand-ink/40" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-brand-ink/75 to-transparent" />
          <Container className="relative pt-40 pb-14 md:pb-20">
            <nav className="reveal mb-6 flex items-center gap-2.5 text-[11px] tracking-wide-cap uppercase text-white/65">
              <Link href="/" className="transition-colors hover:text-white">หน้าแรก</Link>
              <span>/</span>
              <Link href="/portfolio" className="transition-colors hover:text-white">ผลงาน</Link>
            </nav>
            <span aria-hidden className="block w-12 h-px bg-brand-red mb-6" />
            <h1 className="reveal h-display text-white" style={{ fontSize: "clamp(36px, 6vw, 84px)" }}>{post.title}</h1>
            {post.excerpt && <p className="reveal mt-5 max-w-[60ch] text-[16px] md:text-[18px] font-light leading-[1.7] text-white/80">{post.excerpt}</p>}
          </Container>
        </section>

        {/* Body */}
        <section className="bg-white py-16 md:py-24">
          <Container className="max-w-[820px]">
            {post.content && <RichText data={post.content} className="rich" />}

            {gallery.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-4 md:gap-5">
                {gallery.map((g, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-ink">
                    <Image src={g.src} alt={g.alt} fill sizes="(max-width: 768px) 50vw, 410px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-14 pt-8 border-t border-brand-line flex justify-center">
              <Link href="/portfolio" className="btn btn-ghost-dark">
                <span>←</span> ผลงานทั้งหมด
              </Link>
            </div>
          </Container>
        </section>

        {/* Contact (id="contact") */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
