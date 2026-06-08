"use client";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer, Clients } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { useSite, RevealObserver } from "@/lib/site-context";
import teamStory from "../../../../public/about/team-story.jpg";
import njeImg from "../../../../public/about/nje.jpg";
import licenceImg from "../../../../public/about/licence.webp";
import groupImg from "../../../../public/about/group.jpg";

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
            <p className="mt-6 max-w-[60ch] mx-auto text-[16px] md:text-[18px] font-light leading-[1.7] text-white/70">{a.sub}</p>

            {/* Proof line — credential chips */}
            <ul className="mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {a.proof.map((p, i) => (
                <li
                  key={i}
                  className="reveal inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-[11px] md:text-[12px] font-medium tracking-[0.04em] text-white/80 backdrop-blur-sm"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                  {p}
                </li>
              ))}
            </ul>
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
                    src={teamStory}
                    alt="ทีมงาน Journey Life"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    placeholder="blur"
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

        {/* ── New Journey Experience — split: text left · photo right ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <div className="relative grid lg:grid-cols-2 items-stretch">
            {/* Text panel — centered */}
            <div className="relative flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-16 md:py-24 lg:py-28 order-2 lg:order-1">
              {/* Ambient glow + oversized quote watermark (centered behind title) */}
              <div aria-hidden className="absolute top-1/4 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-brand-blue-soft/10 blur-3xl pointer-events-none" />
              <span
                aria-hidden
                className="absolute top-6 left-1/2 -translate-x-1/2 select-none leading-none text-brand-red/12 font-serif pointer-events-none"
                style={{ fontSize: "clamp(120px, 14vw, 200px)" }}
              >
                &ldquo;
              </span>

              <div className="relative flex flex-col items-center max-w-[52ch]">
                <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] tracking-wide-cap uppercase font-semibold text-white/55">
                  <span aria-hidden className="h-px w-8 bg-brand-red" />
                  {a.njeEyebrow}
                  <span aria-hidden className="h-px w-8 bg-brand-red" />
                </span>

                <h2
                  className="reveal h-display mt-7 bg-linear-to-br from-white via-white to-white/65 bg-clip-text text-transparent"
                  style={{ fontSize: "clamp(28px, 3.4vw, 50px)", lineHeight: 1.22 }}
                >
                  {a.njeTitle}
                </h2>

                <span aria-hidden className="block w-12 h-px bg-brand-red mt-8" />

                <p className="reveal mt-7 text-[15px] md:text-[17px] font-light leading-[1.9] text-white/75">
                  {a.njeSub}
                </p>

                {/* Keyword chips */}
                <ul className="reveal mt-9 flex flex-wrap justify-center gap-2.5">
                  {a.njeTags.map((tag, i) => (
                    <li
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/6 px-3.5 py-1.5 text-[11px] md:text-[12px] font-medium tracking-[0.02em] text-white/80 backdrop-blur-sm transition-colors hover:border-brand-red/50 hover:text-white"
                    >
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-red/80" />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Photo */}
            <div className="relative min-h-80 sm:min-h-105 lg:min-h-140 order-1 lg:order-2">
              <Image
                src={njeImg}
                alt="ทีมงาน Journey Life ระหว่างการเดินทาง"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                className="object-cover object-center"
              />
              {/* Soft navy blend into the text panel on desktop */}
              <div aria-hidden className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-linear-to-r from-brand-blue to-transparent" />
              {/* Bottom navy fade so it seats into the next band */}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-brand-blue-deep/70 to-transparent lg:hidden" />
            </div>
          </div>
        </section>

        {/* ── 13 years · licence credential ── */}
        <section className="relative overflow-hidden bg-brand-paper py-16 md:py-28">
          {/* Soft cream wash + red signature accent */}
          <div aria-hidden className="absolute top-0 left-0 w-1 h-24 bg-linear-to-b from-brand-red to-transparent" />
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text */}
              <div className="reveal order-2 lg:order-1">
                <span className="eyebrow">{a.certEyebrow}</span>
                <h2 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(30px, 4.4vw, 60px)" }}>{a.certTitle}</h2>
                <span aria-hidden className="block w-12 h-px bg-brand-red mt-6" />
                <p className="mt-7 text-[15px] md:text-[17px] text-brand-mute font-light leading-[1.9] max-w-[54ch]">{a.certSub}</p>

                {/* Verified callout */}
                <div className="mt-9 inline-flex items-center gap-3 rounded-full border border-brand-line bg-white px-5 py-3 shadow-[0_10px_30px_-16px_rgba(10,16,36,.4)]">
                  <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-brand-blue text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                  </span>
                  <span className="text-[13px] font-medium text-brand-ink">{a.certVerified}</span>
                </div>
              </div>

              {/* Licence document — framed */}
              <div className="reveal order-1 lg:order-2 flex justify-center">
                <figure className="relative w-full max-w-[360px]">
                  {/* Gold halo behind */}
                  <div aria-hidden className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-brand-cream/40 via-transparent to-brand-blue/10 blur-xl" />
                  {/* Framed document */}
                  <div className="relative rounded-xl bg-white p-3 sm:p-4 border border-brand-line shadow-[0_40px_80px_-32px_rgba(10,16,36,.45)]">
                    <Image
                      src={licenceImg}
                      alt="ใบอนุญาตประกอบธุรกิจนำเที่ยว เลขที่ 11/11057"
                      placeholder="blur"
                      sizes="(max-width: 1024px) 90vw, 360px"
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                  {/* Caption badge */}
                  <figcaption className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-blue px-5 py-2.5 text-center text-white shadow-[0_18px_40px_-16px_rgba(13,43,94,.7)]">
                    <span className="block text-[9px] tracking-wide-cap uppercase text-white/55 leading-none">{a.certCaption}</span>
                    <span className="block h-display text-[15px] leading-none mt-1">{a.certNo}</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Scale band — "no journey is impossible" (full-bleed group photo) ── */}
        <section className="relative overflow-hidden text-white">
          <Image
            src={groupImg}
            alt="กรุ๊ปองค์กรขนาดใหญ่ที่ Journey Life ดูแล"
            fill
            sizes="100vw"
            placeholder="blur"
            className="object-cover object-center -z-20"
          />
          {/* Navy cinematic overlays for legibility */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-brand-ink/72" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-ink/85 via-brand-blue-deep/55 to-brand-ink/85" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,10,30,.7)_100%)]" />

          <Container className="relative py-24 md:py-36 text-center">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.6)" }}>{a.scaleEyebrow}</span>
            <h2
              className="reveal h-display mt-7 text-white mx-auto max-w-[20ch]"
              style={{ fontSize: "clamp(30px, 5vw, 68px)", lineHeight: 1.12 }}
            >
              {a.scaleTitle}
            </h2>
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-7" />

            {/* Scale indicator — from → to */}
            <div className="reveal mt-9 flex items-center justify-center gap-4 sm:gap-6">
              <span className="h-display text-[26px] sm:text-[34px] md:text-[44px] text-white leading-none">{a.scaleFrom}</span>
              <span aria-hidden className="flex items-center gap-1.5 text-brand-red">
                <span className="h-px w-8 sm:w-14 bg-brand-red/70" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <span className="h-display text-[34px] sm:text-[46px] md:text-[60px] text-brand-cream leading-none">{a.scaleTo}</span>
            </div>

            <p className="reveal mt-8 mx-auto max-w-[56ch] text-[15px] md:text-[18px] font-light leading-[1.85] text-white/80">
              {a.scaleSub}
            </p>
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

        {/* ── Clients — trusted-by wall (shared with homepage) ── */}
        <Clients />

        {/* ── CTA band ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white py-16 md:py-24">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-ink" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,.07),transparent_55%)] pointer-events-none" />
          <Container className="relative text-center">
            <h2 className="reveal h-display text-white" style={{ fontSize: "clamp(26px, 3.6vw, 50px)" }}>{a.ctaTitle}</h2>
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-6" />
            <div className="reveal mt-9">
              <Link href="/contact" className="btn btn-red">
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
