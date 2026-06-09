import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { StickyCTA } from "@/components/StickyCTA";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PostBody } from "@/components/richtext";
import { Contact, Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { RevealObserver } from "@/lib/site-context";
import { isLocale, localeAlternates, localeHref, type Locale } from "@/lib/locale";
import { getPayloadClient, mediaImage } from "@/lib/payload";

// Statically cached + ISR. The public page is prerendered (draft mode reads as
// false during prerender); preview requests carry the __prerender_bypass cookie
// (set by /next/preview) and render dynamically with draft data.
export const revalidate = 600;

// Prerender published posts at build time; new slugs render on-demand then cache.
export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      select: { slug: true },
      depth: 0,
      limit: 1000,
    });
    return docs.map((d) => ({ slug: String(d.slug) })).filter((p) => p.slug);
  } catch {
    return []; // DB unreachable at build → fall back to fully on-demand ISR
  }
}

// cache() dedupes the query shared by generateMetadata + the page in one request.
const getPost = cache(async (slug: string, draft = false) => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    // In draft (preview) mode show any status; otherwise published only.
    where: draft ? { slug: { equals: slug } } : { slug: { equals: slug }, _status: { equals: "published" } },
    draft,
    depth: 2,
    limit: 1,
  });
  return docs[0] ?? null;
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  const post = await getPost(slug);
  if (!post) return {};
  const og = mediaImage(post.cover, "og");
  return {
    title: `${post.title} · ผลงาน · JOURNEYLIFE`,
    description: post.excerpt || undefined,
    alternates: localeAlternates(l, `/portfolio/${slug}`),
    openGraph: { title: post.title, description: post.excerpt || undefined, images: og ? [og.src] : undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : "th";
  const crumbHome = lang === "th" ? "หน้าแรก" : lang === "zh" ? "首页" : "Home";
  const crumbWork = lang === "th" ? "ผลงาน" : lang === "zh" ? "作品案例" : "Our work";
  const allWork = lang === "th" ? "ผลงานทั้งหมด" : lang === "zh" ? "全部作品" : "All work";
  const { isEnabled: isDraft } = await draftMode();
  const post = await getPost(slug, isDraft);
  if (!post) notFound();

  const cover = mediaImage(post.cover, "og");

  return (
    <>
      {isDraft && <LivePreviewListener />}
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
              <Link href={localeHref("/", lang)} className="transition-colors hover:text-white">{crumbHome}</Link>
              <span>/</span>
              <Link href={localeHref("/portfolio", lang)} className="transition-colors hover:text-white">{crumbWork}</Link>
            </nav>
            <span aria-hidden className="block w-12 h-px bg-brand-red mb-6" />
            <h1 className="reveal h-display text-white" style={{ fontSize: "clamp(36px, 6vw, 84px)" }}>{post.title}</h1>
            {post.excerpt && <p className="reveal mt-5 max-w-[60ch] text-[16px] md:text-[18px] font-light leading-[1.7] text-white/80">{post.excerpt}</p>}
          </Container>
        </section>

        {/* Body */}
        <section className="bg-white py-16 md:py-24">
          <Container className="max-w-[820px]">
            {post.content && <PostBody content={post.content} className="rich" />}

            <div className="mt-14 pt-8 border-t border-brand-line flex justify-center">
              <Link href={localeHref("/portfolio", lang)} className="btn btn-ghost-dark">
                <span>←</span> {allWork}
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
