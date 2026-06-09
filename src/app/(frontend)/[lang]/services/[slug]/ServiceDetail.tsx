"use client";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { StickyCTA } from "@/components/StickyCTA";
import { Process, Contact, Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { useSite, RevealObserver } from "@/lib/site-context";
import { localeHref } from "@/lib/locale";

export function ServiceDetail({ slug }: { slug: string }) {
  const { t, lang } = useSite();
  const items = t.pillars.items;
  const it = items.find((i) => i.slug === slug);
  if (!it) return null;
  const others = items.filter((i) => i.slug !== slug);
  const tr = (th: string, en: string, zh: string) => (lang === "th" ? th : lang === "zh" ? zh : en);

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* Hero — service photo + navy overlay */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden text-white">
          <Image src={it.img} alt={it.title} fill priority sizes="100vw" className="object-cover -z-10" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-brand-ink via-brand-ink/55 to-brand-ink/35" />
          <div aria-hidden className="absolute inset-0 -z-10 mix-blend-multiply bg-brand-blue/25" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-brand-ink/75 to-transparent" />

          <Container className="relative pt-40 pb-14 md:pb-20">
            {/* Breadcrumb */}
            <nav className="reveal mb-6 flex items-center gap-2.5 text-[11px] tracking-wide-cap uppercase text-white/65">
              <Link href={localeHref("/", lang)} className="transition-colors hover:text-white">{tr("หน้าแรก", "Home", "首页")}</Link>
              <span>/</span>
              <Link href={localeHref("/services", lang)} className="transition-colors hover:text-white">{tr("บริการ", "Services", "服务")}</Link>
              <span>/</span>
              <span className="text-white">{it.title}</span>
            </nav>

            <span aria-hidden className="block w-12 h-px bg-brand-red mb-6" />
            <h1 className="reveal h-display text-white" style={{ fontSize: "clamp(40px, 7vw, 92px)" }}>
              {it.title}
            </h1>
            <p className="reveal mt-5 max-w-[60ch] text-[16px] md:text-[18px] font-light leading-[1.7] text-white/80">
              {it.body}
            </p>

            <div className="reveal mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn btn-red">
                {tr("ขอใบเสนอราคาฟรี", "Request a free quote", "免费索取报价")}
                <span className="arrow">→</span>
              </a>
              <a
                href={`https://line.me/R/ti/p/${t.contact.direct.line}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-light"
              >
                LINE {t.contact.direct.line}
              </a>
            </div>
          </Container>
        </section>

        {/* How we work — reused */}
        <Process />

        {/* Other services */}
        <section className="bg-brand-paper border-y border-brand-line py-20 md:py-28">
          <Container>
            <div className="reveal mb-12 md:mb-16">
              <span className="eyebrow">{tr("บริการอื่น ๆ", "More services", "其他服务")}</span>
              <h2 className="h-display mt-5 text-brand-ink" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
                {tr("สำรวจบริการทั้งหมด", "Explore all services", "查看全部服务")}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {others.map((o, i) => (
                <Link
                  key={o.slug}
                  href={localeHref(`/services/${o.slug}`, lang)}
                  className="reveal card-lift group relative flex flex-col overflow-hidden rounded-xl bg-white border border-brand-line"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={o.img} alt={o.title} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-ink/35 to-transparent" />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="h-display text-brand-ink text-[17px] md:text-[19px] leading-[1.2]">{o.title}</h3>
                    <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] tracking-wide-cap uppercase font-semibold text-brand-blue transition-colors group-hover:text-brand-red">
                      {t.pillars.cta}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact form — reused (has id="contact") */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
