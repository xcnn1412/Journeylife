"use client";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav, AnimNum } from "@/components/Nav";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { useSite, RevealObserver } from "@/lib/site-context";

/* Team photos in /public/team-gallery (resized from /public/source/ทีมงาน). */
const TEAM = Array.from({ length: 14 }, (_, i) => `${String(i + 1).padStart(2, "0")}.jpg`);

/** Fixed-height / auto-width marquee row (reuses .logo-marquee + .photo-cell). */
function TeamRow({ photos, reverse, dur }: { photos: string[]; reverse?: boolean; dur: string }) {
  return (
    <div className={`logo-row${reverse ? " rev" : ""}`} style={{ "--dur": dur } as CSSProperties}>
      {[0, 1].map((copy) =>
        photos.map((file) => (
          <div key={`${copy}-${file}`} className={copy === 1 ? "photo-cell logo-dup" : "photo-cell"}>
            <img
              src={`/team-gallery/${file}`}
              alt={copy === 0 ? "ทีมงานมืออาชีพของ Journey Life" : ""}
              aria-hidden={copy === 1}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        )),
      )}
    </div>
  );
}

export function AboutUs() {
  const { t } = useSite();
  const a = t.about;

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* ── Hero — navy header ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-brand-red" />
          <Container className="relative pt-36 md:pt-44 pb-16 md:pb-20 text-center">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.55)" }}>{a.eyebrow}</span>
            <h1 className="h-display mt-6 text-white" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>{a.title}</h1>
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-6" />
            <p className="mt-6 max-w-[56ch] mx-auto text-[16px] md:text-[18px] font-light leading-[1.7] text-white/70">{a.sub}</p>
          </Container>
        </section>

        {/* ── Story ── */}
        <section className="bg-brand-paper py-16 md:py-28">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="reveal">
                <span className="eyebrow">{a.storyEyebrow}</span>
                <h2 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(28px, 3.6vw, 48px)" }}>{a.storyTitle}</h2>
                <span aria-hidden className="block w-12 h-px bg-brand-red mt-6" />
                <div className="mt-7 space-y-5">
                  {a.story.map((para, i) => (
                    <p key={i} className="text-[15px] md:text-[17px] text-brand-mute font-light leading-[1.8]">{para}</p>
                  ))}
                </div>
              </div>

              <div className="reveal relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-line shadow-[0_30px_70px_-30px_rgba(10,16,36,.4)]">
                  <Image
                    src="/team-gallery/02.jpg"
                    alt="ทีมงาน Journey Life"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-ink/30 to-transparent" />
                </div>
                {/* License badge */}
                <div className="absolute -bottom-5 left-5 rounded-xl bg-brand-blue px-5 py-3 text-white shadow-[0_18px_40px_-16px_rgba(13,43,94,.7)]">
                  <div className="text-[9px] tracking-wide-cap uppercase text-white/55">TAT licence</div>
                  <div className="h-display text-[20px] leading-none mt-1">11/11057</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Stats band ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white py-16 md:py-20">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <Container className="relative">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {t.hero.stats.map((s, i) => (
                <div key={i} className="reveal bg-brand-blue py-9 md:py-12 text-center" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="h-display text-[40px] md:text-[56px] text-white leading-none"><AnimNum value={s.num} /></div>
                  <div className="mt-3 text-[11px] md:text-[12px] tracking-wide-cap uppercase text-white/55 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Values ── */}
        <section className="bg-white py-16 md:py-28">
          <Container>
            <div className="reveal text-center max-w-[52ch] mx-auto mb-12 md:mb-16">
              <span className="eyebrow">{a.valuesEyebrow}</span>
              <h2 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(28px, 3.6vw, 48px)" }}>{a.valuesTitle}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {a.values.map((v, i) => (
                <div
                  key={i}
                  className="reveal card-lift rounded-xl border border-brand-line bg-brand-paper p-6 md:p-7"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="h-display text-brand-red text-[24px]">{`0${i + 1}`}</div>
                  <h3 className="text-brand-blue font-semibold text-[18px] md:text-[20px] mt-4 leading-[1.2]">{v.title}</h3>
                  <p className="mt-2.5 text-[13px] text-brand-mute font-light leading-[1.65]">{v.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Team marquee ── */}
        <section className="bg-brand-paper pt-16 md:pt-24 pb-16 md:pb-24 overflow-hidden">
          <Container>
            <div className="reveal text-center">
              <span className="eyebrow">{a.teamEyebrow}</span>
              <h2 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(26px, 3.2vw, 44px)" }}>{a.teamTitle}</h2>
            </div>
          </Container>
          <div className="reveal logo-marquee overflow-hidden select-none mt-10 md:mt-14">
            <TeamRow photos={TEAM} dur="80s" />
          </div>
        </section>

        {/* ── CTA band ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white py-16 md:py-24">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-ink" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,.07),transparent_55%)] pointer-events-none" />
          <Container className="relative text-center">
            <h2 className="reveal h-display text-white" style={{ fontSize: "clamp(26px, 3.6vw, 50px)" }}>{a.ctaTitle}</h2>
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-6" />
            <div className="reveal mt-9">
              <Link href="/#contact" className="btn btn-red">
                {a.ctaBtn}
                <span className="arrow">→</span>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
