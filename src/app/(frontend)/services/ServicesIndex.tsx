"use client";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { StickyCTA } from "@/components/StickyCTA";
import { Contact, Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { useSite, RevealObserver } from "@/lib/site-context";

export function ServicesIndex() {
  const { t } = useSite();
  const p = t.pillars;

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* Navy header — keeps the (white) nav legible without a photo hero */}
        <section className="relative overflow-hidden bg-brand-blue text-white">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-brand-red" />
          <Container className="relative pt-36 md:pt-44 pb-16 md:pb-20 text-center">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.55)" }}>{p.eyebrow}</span>
            <h1 className="h-display mt-6 text-white" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>{p.title}</h1>
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-6" />
            <p className="mt-6 max-w-[56ch] mx-auto text-[16px] md:text-[18px] font-light leading-[1.7] text-white/70">{p.sub}</p>
          </Container>
        </section>

        {/* All 8 services */}
        <section className="bg-brand-paper border-b border-brand-line py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {p.items.map((it, i) => (
                <Link
                  key={it.slug}
                  href={`/services/${it.slug}`}
                  className="reveal card-lift group relative flex flex-col overflow-hidden rounded-xl bg-white border border-brand-line"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={it.img} alt={it.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-ink/35 to-transparent" />
                    <div aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-brand-red transition-[width] duration-500 group-hover:w-full" />
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <h3 className="text-brand-blue font-semibold text-[22px] md:text-[26px] leading-[1.15] tracking-[-0.01em]">{it.title}</h3>
                    <p className="mt-2.5 text-[12.5px] md:text-[13px] text-brand-mute font-light leading-[1.6] line-clamp-2 flex-1">{it.body}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-wide-cap uppercase font-semibold text-brand-blue transition-colors group-hover:text-brand-red">
                      {p.cta}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
