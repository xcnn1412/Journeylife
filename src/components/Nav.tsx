"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/site-context";
import { Sakura } from "./Sakura";

export function Logo({ size = 36, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M8 22 C 8 11, 16 4, 24 4 C 32 4, 40 11, 40 22 L 40 44 L 33 44 L 33 22 C 33 16, 29 11, 24 11 C 19 11, 15 16, 15 22 L 15 44 L 8 44 Z" stroke="#c8102e" strokeWidth="2.5" fill="none"/>
        <path d="M22 14 L 28 14 L 28 32 C 28 36, 25 38, 22 38 C 19 38, 17 36, 17 33" stroke="#c8102e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
      <div className="leading-none">
        <div className={`wordmark text-[18px] ${dark ? "text-white" : "text-brand-ink"}`}>JOURNEY<span className="text-brand-red">LIFE</span></div>
        <div className={`text-[9px] tracking-wide-cap mt-1.5 font-medium uppercase ${dark ? "text-white/50" : "text-brand-mute"}`}>Inspire your trip · est. 2014</div>
      </div>
    </div>
  );
}

function AnimNum({ value }: { value: string }) {
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

  const links = [
    { k: "incentive" as const, href: "#why" },
    { k: "services" as const, href: "#services" },
    { k: "destinations" as const, href: "#destinations" },
    { k: "clients" as const, href: "#clients" },
    { k: "contact" as const, href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl border-b border-brand-line shadow-[0_1px_0_rgba(10,16,36,.04)]" : "bg-transparent"}`}>
      <div className={`max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? "py-3.5" : "py-6"}`}>
        <Link href="#top" className="no-underline"><Logo size={32}/></Link>
        <div className="hidden lg:flex items-center gap-10">
          {links.map(l => (
            <a key={l.k} href={l.href} className="nav-link text-[11px] tracking-wide-cap uppercase font-semibold text-brand-ink">{t.nav[l.k]}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border border-brand-line">
            {(["th", "en"] as const).map(L => (
              <button key={L} onClick={() => setLang(L)}
                className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] transition-all ${lang === L ? "bg-brand-ink text-white" : "bg-transparent text-brand-mute hover:text-brand-ink"}`}>
                {L.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="#contact" className="btn btn-red hidden md:inline-flex !px-5 !py-3 !text-[11px]">{t.cta.quote}<span className="arrow">→</span></a>
          <button className="lg:hidden border border-brand-line p-2.5 hover:bg-brand-ink hover:text-white transition-colors" aria-label="menu" onClick={() => setOpen(!open)}>
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

export function Hero() {
  const { t, lang } = useSite();
  return (
    <section id="top" className="relative bg-white text-brand-ink overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 min-h-[100vh] flex flex-col">
      {/* Ambient glow accents */}
      <div aria-hidden className="absolute inset-0 hero-glow-tr"/>
      <div aria-hidden className="absolute inset-0 hero-glow-bl"/>
      {/* Diagonal navy tint top-right */}
      <div aria-hidden className="absolute top-0 right-0 w-[42%] h-[58%] bg-brand-blue/[.025]" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%)" }}/>
      {/* Vertical red accent line */}
      <div aria-hidden className="absolute bottom-0 left-0 w-0.5 h-[40%] bg-linear-to-t from-brand-red to-transparent"/>

      <Sakura count={22}/>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-[2] flex-1 flex items-center w-full">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-20 items-center w-full">
          <div>
            <div className="reveal eyebrow">{t.hero.eyebrow}</div>
            <h1 className="reveal h-display mt-8" style={{ fontSize: "clamp(48px, 7.4vw, 112px)", transitionDelay: "80ms" }}>
              <span className="block">{t.hero.title1}</span>
              <span className="block h-italic text-brand-red mt-1">{t.hero.title2}</span>
            </h1>
            <p className="reveal mt-8 text-[17px] md:text-[19px] text-brand-mute max-w-[54ch] leading-[1.65] font-light" style={{ transitionDelay: "160ms", textWrap: "pretty" }}>{t.hero.lede}</p>

            <div className="reveal flex flex-wrap gap-3 mt-10" style={{ transitionDelay: "240ms" }}>
              <a href="#contact" className="btn btn-red">{t.hero.cta1}<span className="arrow">→</span></a>
              <a href="#destinations" className="btn btn-ghost-dark">{t.hero.cta2}</a>
            </div>

            <div className="reveal mt-12 pt-7 border-t border-brand-line flex items-center gap-3 text-[11px] text-brand-mute tracking-wide-cap uppercase font-medium" style={{ transitionDelay: "320ms" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"/>
              {t.hero.badge}
            </div>
          </div>

          <div className="reveal relative" style={{ transitionDelay: "200ms" }}>
            <div className="relative group">
              <div className="ph-img card-lift" style={{ aspectRatio: "4 / 5" }}>
                <span>Hokkaido · Incentive 2026</span>
              </div>
              {/* File label — top-left */}
              <div className="absolute -top-5 -left-5 bg-brand-red text-white px-5 py-3 text-[10px] tracking-wide-cap font-medium uppercase shadow-lift">
                <div>File Nº 2026 / 04</div>
                <div className="opacity-80 mt-0.5">Confidential · Corporate Incentive</div>
              </div>
              {/* Stat plate — bottom-right, gently floating */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 bg-brand-blue text-white p-6 md:p-7 max-w-[260px] shadow-lux float-soft">
                <div className="text-[10px] tracking-wide-cap text-white/60 uppercase font-medium">{lang === "th" ? "ทริปล่าสุด" : "Latest delivered"}</div>
                <div className="h-display text-[34px] md:text-[42px] mt-1.5">Hokkaido</div>
                <div className="text-[11px] mt-1 text-white/70 tracking-wide-cap uppercase font-medium">412 pax · 6 days · jan 2026</div>
                <div className="mt-4 pt-4 border-t border-white/15 flex items-baseline justify-between">
                  <span className="text-[10px] tracking-wide-cap text-white/60 uppercase font-medium">Rating</span>
                  <span className="h-display text-2xl">4.97<span className="text-base text-white/50">/5</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-[2] w-full mt-14 md:mt-20">
        <div className="reveal grid grid-cols-2 md:grid-cols-4 border-t border-brand-line pt-10">
          {t.hero.stats.map((s, i) => (
            <div key={i} className={`px-4 ${i > 0 ? "md:border-l border-brand-line" : ""} ${i === 1 || i === 3 ? "border-l border-brand-line md:border-l" : ""}`}>
              <div className="h-display text-[44px] md:text-[60px] text-brand-ink leading-none"><AnimNum value={s.num}/></div>
              <div className="text-[10px] text-brand-mute mt-4 tracking-wide-cap uppercase font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
