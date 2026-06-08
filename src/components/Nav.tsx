"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/site-context";

export function Logo({ size = 36, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M8 22 C 8 11, 16 4, 24 4 C 32 4, 40 11, 40 22 L 40 44 L 33 44 L 33 22 C 33 16, 29 11, 24 11 C 19 11, 15 16, 15 22 L 15 44 L 8 44 Z" stroke="#c8102e" strokeWidth="2.5" fill="none"/>
        <path d="M22 14 L 28 14 L 28 32 C 28 36, 25 38, 22 38 C 19 38, 17 36, 17 33" stroke="#c8102e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
      <div className="leading-none">
        <div className={`wordmark text-[18px] ${dark ? "text-white" : "text-brand-ink"}`}>JOURNEY<span className="text-brand-red">LIFE</span></div>
        <div className={`text-[9px] tracking-wide-cap mt-1.5 font-medium uppercase ${dark ? "text-white/60" : "text-brand-mute"}`}>Inspire your trip · est. 2014</div>
      </div>
    </div>
  );
}

export function AnimNum({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isNumeric = /^\d/.test(value);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    // Non-numeric values render `value` directly (below) — no state sync needed.
    if (!isNumeric) return;
    const num = parseInt(value.replace(/[^\d]/g, ""), 10);
    const suffix = value.replace(/^\d+/, "");
    const node = ref.current; if (!node) return;
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) {
        const start = performance.now(); const dur = 1300;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          setShown(Math.round(num * e) + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick); io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(node); return () => io.disconnect();
  }, [value, isNumeric]);
  return <span ref={ref}>{isNumeric ? shown : value}</span>;
}

export function Nav() {
  const { t, lang, setLang } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  const onDark = !scrolled;

  // Absolute hrefs so the nav works from sub-pages (/services/*, /portfolio/*) too.
  // Order mirrors the homepage section flow.
  const links = [
    { k: "about" as const, href: "/aboutus" },
    { k: "services" as const, href: "/#our-services" },
    { k: "overseas" as const, href: "/outboundtrip" },
    { k: "clients" as const, href: "/#clients" },
    { k: "contact" as const, href: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl border-b border-brand-line shadow-[0_1px_0_rgba(10,16,36,.04)]" : "bg-transparent"}`}>
      {/* Dark scrim — anchors nav text on dark hero so it doesn't sink into the bg */}
      {onDark && (
        <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/55 via-black/25 to-transparent pointer-events-none -z-10" />
      )}
      <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? "py-3.5" : "py-5 md:py-6"}`}>
        <Link href="/" className={`no-underline ${onDark ? "[filter:drop-shadow(0_2px_6px_rgba(0,0,0,.45))]" : ""}`}><Logo size={32} dark={onDark}/></Link>
        <div className="hidden lg:flex items-center gap-4 xl:gap-7">
          {links.map(l => (
            <Link
              key={l.k}
              href={l.href}
              className={`nav-link text-[11px] tracking-[0.14em] uppercase font-semibold whitespace-nowrap transition-colors ${onDark ? "text-white hover:text-white [text-shadow:0_1px_4px_rgba(0,0,0,.5)]" : "text-brand-ink"}`}
            >
              {t.nav[l.k]}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className={`flex border transition-colors ${onDark ? "border-white/60 [box-shadow:0_2px_8px_rgba(0,0,0,.25)]" : "border-brand-line"}`}>
            {(["th", "en"] as const).map(L => (
              <button
                key={L}
                onClick={() => setLang(L)}
                className={`px-3 py-2 md:py-1.5 text-[10px] font-semibold tracking-[0.2em] transition-all ${
                  lang === L
                    ? onDark ? "bg-white text-brand-ink" : "bg-brand-ink text-white"
                    : onDark ? "bg-black/25 text-white hover:bg-black/40" : "bg-transparent text-brand-mute hover:text-brand-ink"
                }`}
              >
                {L.toUpperCase()}
              </button>
            ))}
          </div>
          <Link
            href="/contact"
            className={`btn hidden md:inline-flex !px-5 !py-3 !text-[11px] ${onDark ? "bg-white text-brand-blue hover:-translate-y-px [box-shadow:0_10px_30px_-10px_rgba(0,0,0,.5)]" : "btn-blue"}`}
          >
            {t.cta.quote}<span className="arrow">→</span>
          </Link>
          <button
            className={`lg:hidden border p-2.5 transition-colors ${onDark ? "border-white/60 text-white bg-black/25 hover:bg-white hover:text-brand-ink" : "border-brand-line text-brand-ink hover:bg-brand-ink hover:text-white"}`}
            aria-label="menu"
            onClick={() => setOpen(!open)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d={open ? "M3 3 L15 15 M15 3 L3 15" : "M2 5 H16 M2 13 H16"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-brand-line px-6 pb-6">
          {links.map(l => (
            <Link key={l.k} href={l.href} onClick={() => setOpen(false)} className="block py-3.5 text-[13px] font-semibold tracking-[0.22em] uppercase border-b border-brand-line no-underline text-brand-ink">{t.nav[l.k]}</Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-blue mt-5 w-full justify-center">{t.cta.quote}</Link>
        </div>
      )}
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────
   HERO — full-bleed cinematic landing
   ────────────────────────────────────────────────────────── */
export function Hero() {
  const { t } = useSite();
  return (
    <section
      id="top"
      className="relative min-h-svh w-full overflow-hidden text-white flex flex-col"
    >
      {/* Background video — full bleed, muted autoplay loop (poster = jpg for instant LCP) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/herosection/herobackground.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center -z-10"
      >
        <source src="/herosection/herosection.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric overlays — navy-dominant, luxury grade (60% of the palette) */}
      {/* 1 · deep navy gradient wash */}
      <div aria-hidden className="absolute inset-0 z-0 bg-linear-to-b from-brand-blue-deep/85 via-brand-ink/40 to-brand-ink/92" />
      {/* 2 · navy multiply tint — unifies the whole photo toward the brand navy */}
      <div aria-hidden className="absolute inset-0 z-0 mix-blend-multiply bg-brand-blue/35" />
      {/* 3 · cinematic vignette */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 78% 66% at 50% 42%, transparent 33%, rgba(6,10,30,.8) 100%)" }}
      />
      {/* 4 · top scrim — anchors the nav on the photo */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-44 z-0 bg-linear-to-b from-brand-ink/75 to-transparent" />

      {/* Thin framed-photograph border — editorial luxury detail */}
      <div aria-hidden className="absolute inset-3 md:inset-5 z-[1] border border-white/12 pointer-events-none" />

      {/* Content frame */}
      <div className="relative z-[2] flex-1 flex flex-col max-w-[1480px] mx-auto w-full px-5 sm:px-8 md:px-16 pt-24 sm:pt-28 md:pt-32 pb-6 md:pb-9">
        {/* Top meta row — eyebrow (left) · reach (right) */}
        <div className="reveal flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 sm:gap-3.5 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.05em] sm:tracking-[0.28em] md:tracking-[0.32em] uppercase font-medium text-white/85 [text-shadow:0_1px_5px_rgba(0,0,0,.55)]">
            <span className="w-5 sm:w-8 h-px bg-brand-red shrink-0" />
            {t.hero.eyebrow}
          </span>
          <span className="hidden md:inline-block text-[10px] tracking-[0.34em] uppercase font-medium text-white/50">
            Bangkok · Worldwide
          </span>
        </div>

        {/* Headline group — vertically centered between the top meta row and the bottom bar */}
        <div className="reveal flex-1 flex flex-col justify-center py-8 sm:py-6">
          <div className="relative text-center">
            {/* Soft navy halo — lifts the headline off the busy photo */}
            <div
              aria-hidden
              className="absolute inset-x-[-10%] top-[-16%] bottom-[-24%] pointer-events-none -z-[1]"
              style={{ background: "radial-gradient(ellipse at center, rgba(6,10,30,.5) 0%, rgba(6,10,30,.18) 48%, transparent 76%)" }}
            />
            <h1
              className="relative h-display drop-shadow-[0_10px_44px_rgba(0,0,0,.6)]"
              style={{ fontSize: "clamp(32px, 7.6vw, 112px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
            >
              <span className="block text-white font-extralight">{t.hero.title1}</span>
              <span className="block text-white font-light mt-1.5">{t.hero.title2}</span>
            </h1>

            {/* Red hairline — the 10% accent */}
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-7 md:mt-9" />

            {/* Subheader */}
            <p className="mt-6 md:mt-7 text-[12px] md:text-[15px] tracking-[0.13em] font-light text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,.55)] max-w-[58ch] mx-auto text-balance">
              {t.hero.sub}
            </p>

            {/* CTAs — centered, right under the text */}
            <div className="mt-7 sm:mt-9 md:mt-11 mx-auto max-w-[340px] sm:max-w-none flex flex-col items-stretch gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 md:gap-3.5">
              {/* LINE OA — primary contact */}
              <a
                href={`https://line.me/R/ti/p/${t.contact.direct.line}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between sm:justify-start gap-3 bg-white text-brand-ink rounded-full py-2 pl-5 pr-2 w-full sm:w-fit shadow-[0_12px_44px_-14px_rgba(0,0,0,.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-16px_rgba(0,0,0,.8)]"
              >
                <span className="text-[11px] md:text-[12px] tracking-[0.08em] font-semibold whitespace-nowrap">LINE {t.contact.direct.line}</span>
                <span className="grid place-items-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#06C755] text-white transition-transform duration-500 group-hover:rotate-[-6deg]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z"/></svg>
                </span>
              </a>

              {/* Phone */}
              <a
                href={`tel:${t.contact.direct.phone.replace(/[^\d+]/g, "")}`}
                className="group inline-flex items-center justify-center sm:justify-start gap-2.5 w-full sm:w-fit rounded-full border border-white/30 hover:border-white/80 bg-white/5 hover:bg-white/15 backdrop-blur-md text-white text-[11px] md:text-[12px] tracking-[0.08em] font-medium py-3 sm:py-2.5 px-5 transition-all duration-300 [text-shadow:0_1px_4px_rgba(0,0,0,.5)]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 transition-opacity group-hover:opacity-100" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
                {t.contact.direct.phone}
              </a>

              {/* Email */}
              <a
                href={`mailto:${t.contact.direct.email}`}
                className="group inline-flex items-center justify-center sm:justify-start gap-2.5 w-full sm:w-fit rounded-full border border-white/30 hover:border-white/80 bg-white/5 hover:bg-white/15 backdrop-blur-md text-white text-[11px] md:text-[12px] tracking-[0.06em] font-medium py-3 sm:py-2.5 px-5 transition-all duration-300 [text-shadow:0_1px_4px_rgba(0,0,0,.5)]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 transition-opacity group-hover:opacity-100" aria-hidden><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
                {t.contact.direct.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar — tagline (left) + scroll cue (right) */}
        <div className="reveal pt-6 md:pt-7 border-t border-white/12 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between gap-5">
          <p className="hidden sm:block text-[12px] md:text-[13px] tracking-[0.03em] text-white/65 leading-[1.85] max-w-[46ch] font-light">
            {t.hero.lede}
          </p>
          <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-medium text-white/55 shrink-0">
            <span>scroll</span>
            <span aria-hidden className="relative h-8 w-px overflow-hidden bg-white/20">
              <span className="scroll-dot absolute inset-x-0 top-0 h-2 bg-brand-red" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
