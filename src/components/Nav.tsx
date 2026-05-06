"use client";
import Link from "next/link";
import Image from "next/image";
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
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!/^\d/.test(value)) { setShown(value); return; }
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
  }, [value]);
  return <span ref={ref}>{shown}</span>;
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

  const links = [
    { k: "incentive" as const, href: "#why" },
    { k: "services" as const, href: "#services" },
    { k: "destinations" as const, href: "#destinations" },
    { k: "clients" as const, href: "#clients" },
    { k: "contact" as const, href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl border-b border-brand-line shadow-[0_1px_0_rgba(10,16,36,.04)]" : "bg-transparent"}`}>
      {/* Dark scrim — anchors nav text on dark hero so it doesn't sink into the bg */}
      {onDark && (
        <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/55 via-black/25 to-transparent pointer-events-none -z-10" />
      )}
      <div className={`max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? "py-3.5" : "py-6"}`}>
        <Link href="#top" className={`no-underline ${onDark ? "[filter:drop-shadow(0_2px_6px_rgba(0,0,0,.45))]" : ""}`}><Logo size={32} dark={onDark}/></Link>
        <div className="hidden lg:flex items-center gap-10">
          {links.map(l => (
            <a
              key={l.k}
              href={l.href}
              className={`nav-link text-[11px] tracking-wide-cap uppercase font-semibold transition-colors ${onDark ? "text-white hover:text-brand-red [text-shadow:0_1px_4px_rgba(0,0,0,.5)]" : "text-brand-ink"}`}
            >
              {t.nav[l.k]}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex border transition-colors ${onDark ? "border-white/60 [box-shadow:0_2px_8px_rgba(0,0,0,.25)]" : "border-brand-line"}`}>
            {(["th", "en"] as const).map(L => (
              <button
                key={L}
                onClick={() => setLang(L)}
                className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] transition-all ${
                  lang === L
                    ? onDark ? "bg-white text-brand-ink" : "bg-brand-ink text-white"
                    : onDark ? "bg-black/25 text-white hover:bg-black/40" : "bg-transparent text-brand-mute hover:text-brand-ink"
                }`}
              >
                {L.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="#contact"
            className={`btn btn-red hidden md:inline-flex !px-5 !py-3 !text-[11px] ${onDark ? "[box-shadow:0_8px_24px_-8px_rgba(200,16,46,.55)]" : ""}`}
          >
            {t.cta.quote}<span className="arrow">→</span>
          </a>
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
            <a key={l.k} href={l.href} onClick={() => setOpen(false)} className="block py-3.5 text-[13px] font-semibold tracking-[0.22em] uppercase border-b border-brand-line no-underline text-brand-ink">{t.nav[l.k]}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="btn btn-red mt-5 w-full justify-center">{t.cta.quote}</a>
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
      className="relative min-h-screen w-full overflow-hidden text-white flex flex-col"
    >
      {/* Background image — full bleed */}
      <Image
        src="/herosection/herobackground.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center -z-10"
      />

      {/* Atmospheric overlays — top fade, bottom fade, vignette, brand-tint */}
      <div aria-hidden className="absolute inset-0 z-0 bg-linear-to-b from-brand-ink/55 via-brand-ink/15 to-brand-ink/85" />
      <div aria-hidden className="absolute inset-0 z-0 bg-linear-to-t from-black/60 via-transparent to-black/25" />
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 28%, rgba(6,10,30,.6) 100%)" }}
      />
      {/* Subtle red signature accent — bottom-left vertical */}
      <div aria-hidden className="absolute bottom-0 left-0 w-0.5 h-[44%] bg-linear-to-t from-brand-red to-transparent z-[1]" />

      {/* Content frame */}
      <div className="relative z-[2] flex-1 flex flex-col max-w-[1500px] mx-auto w-full px-6 md:px-12 pt-28 md:pt-32 pb-10 md:pb-14">
        {/* Top eyebrow */}
        <div className="reveal flex items-center gap-3 text-[10px] md:text-[11px] tracking-wide-cap uppercase font-medium text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,.5)]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          {t.hero.eyebrow}
        </div>

        {/* Headline — anchored in upper area so it doesn't overlap the figure in the bg */}
        <div className="reveal mt-6 md:mt-8">
          <div className="relative text-center">
            {/* Soft dark halo behind text — keeps headline from sinking into the busy bg */}
            <div
              aria-hidden
              className="absolute inset-x-[-8%] top-[-12%] bottom-[-18%] pointer-events-none -z-[1]"
              style={{ background: "radial-gradient(ellipse at center, rgba(6,10,30,.55) 0%, rgba(6,10,30,.22) 45%, transparent 75%)" }}
            />
            <h1
              className="relative h-display drop-shadow-[0_8px_40px_rgba(0,0,0,.65)]"
              style={{ fontSize: "clamp(48px, 9.4vw, 156px)", lineHeight: 0.94, letterSpacing: "-0.04em" }}
            >
              <span className="block text-white">{t.hero.title1}</span>
              <span className="block h-italic text-brand-cream mt-1 drop-shadow-[0_6px_24px_rgba(230,201,138,.4)]">
                {t.hero.title2}
              </span>
            </h1>

            {/* English subheader — small caps, line-flanked, sits right below the headline */}
            <div className="relative mt-6 md:mt-8 flex items-center justify-center gap-5 md:gap-6 text-[15px] md:text-[18px] tracking-[0.36em] uppercase font-medium text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,.6)]">
              <span className="block w-10 md:w-16 h-px bg-white/45" />
              <span>{t.hero.sub}</span>
              <span className="block w-10 md:w-16 h-px bg-white/45" />
            </div>
          </div>
        </div>

        {/* Spacer — keeps middle of hero clear so the figure breathes */}
        <div className="flex-1" />

        {/* Bottom row — CTA pill (left) + tagline (right) */}
        <div className="reveal grid md:grid-cols-[auto_1fr] items-end gap-8 md:gap-12">
          {/* Pill CTA — mirrors reference */}
          <a
            href="#destinations"
            className="group flex items-center gap-2 bg-white/95 hover:bg-white text-brand-ink rounded-full p-1.5 pl-6 md:pl-8 self-start w-fit shadow-[0_10px_40px_-12px_rgba(0,0,0,.6)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_50px_-14px_rgba(0,0,0,.7)] hover:-translate-y-0.5"
          >
            <span className="text-[11px] md:text-[12px] tracking-wide-cap uppercase font-semibold py-2 whitespace-nowrap">
              {t.hero.cta2}
            </span>
            <span className="grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-brand-ink text-white transition-all duration-500 group-hover:bg-brand-red group-hover:rotate-[-5deg]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8 H13 M9 4 L13 8 L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>

          {/* Bottom-right tagline */}
          <p className="text-[11px] md:text-[12px] tracking-wide-cap uppercase text-white/75 leading-[1.85] max-w-[52ch] md:justify-self-end md:text-right font-light">
            {t.hero.lede}
          </p>
        </div>

        {/* Scroll cue */}
        <div className="reveal mt-10 md:mt-12 pt-6 border-t border-white/15 flex justify-end text-[10px] md:text-[11px] tracking-wide-cap uppercase font-medium text-white/65">
          <span className="inline-flex items-center gap-3">
            <span className="w-6 h-px bg-white/40" />
            <span>scroll</span>
          </span>
        </div>
      </div>
    </section>
  );
}
