"use client";
import type { CSSProperties } from "react";
import { useSite } from "@/lib/site-context";
import { Container, SectionHeading } from "./_layout";

/* Client logos live in /public/source/logo. Order is curated so recognisable
   brands lead each row; numbered files round out the wall. */
const LOGOS = [
  "singha.png", "ptt.png", "honda.png", "scb.png", "cimb.png", "amway.png",
  "kerry.png", "kubota.png", "brother.png", "sony.png", "fwd.png", "bualuang.png",
  "grundfos.png", "freewill.png", "azbil.png", "nida.png", "ksc.png", "nt.png",
  "qyou.png", "bevchain.png", "ingrredion.png", "sanki.png", "nbd.png", "cot.png",
  "eway.png", "hitacho.png", "showa.png", "sein.png", "nasanasco.png", "tmhwst.png",
  "31-768x768.png", "32-768x768.png", "33-768x768.png", "34-768x768.png",
  "35-768x768.png", "36-768x768.png", "38-768x768.png", "39-768x768.png",
  "40-768x768.png", "41-768x768.png", "42-768x768.png", "43-768x768.png",
  "44-768x768.png", "45-768x768.png", "46-768x768.png", "47-768x768.png",
  "48-768x768.png", "49-768x768.png",
];

const PER_ROW = Math.ceil(LOGOS.length / 3);
const ROWS = [
  LOGOS.slice(0, PER_ROW),
  LOGOS.slice(PER_ROW, PER_ROW * 2),
  LOGOS.slice(PER_ROW * 2),
];

/** One marquee row. Content is rendered twice so a -50% scroll loops seamlessly;
    the second copy is aria-hidden and dropped under reduced-motion. */
function LogoRow({ logos, reverse, dur }: { logos: string[]; reverse?: boolean; dur: string }) {
  return (
    <div className={`logo-row${reverse ? " rev" : ""}`} style={{ "--dur": dur } as CSSProperties}>
      {[0, 1].map((copy) =>
        logos.map((file) => (
          <div key={`${copy}-${file}`} className={copy === 1 ? "logo-cell logo-dup" : "logo-cell"}>
            <img
              src={`/source/logo/${file}`}
              alt={copy === 0 ? "โลโก้ลูกค้าองค์กรของ Journey Life" : ""}
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

export function Clients() {
  const { t } = useSite();
  return (
    <section id="clients" className="py-16 sm:py-24 md:py-36 bg-white">
      <Container>
        <div className="reveal text-center max-w-[60ch] mx-auto mb-12 md:mb-16">
          <SectionHeading eyebrow={t.clients.eyebrow} title={t.clients.title} />
          <p className="text-[15px] sm:text-[17px] text-brand-mute mt-6 font-light">
            {t.clients.subheader}
          </p>
        </div>
      </Container>

      {/* full-bleed logo wall — three rows drifting in alternating directions */}
      <div className="reveal logo-marquee overflow-hidden select-none">
        <LogoRow logos={ROWS[0]} dur="64s" />
        <LogoRow logos={ROWS[1]} dur="78s" reverse />
        <LogoRow logos={ROWS[2]} dur="70s" />
      </div>

      <Container>
        <div className="reveal mt-16 md:mt-24 max-w-[64ch] mx-auto text-center">
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="mx-auto mb-7">
            <path d="M0 28 L0 16 C 0 8, 5 2, 14 0 L 14 4 C 8 6, 6 10, 6 14 L 14 14 L 14 28 Z M22 28 L22 16 C 22 8, 27 2, 36 0 L 36 4 C 30 6, 28 10, 28 14 L 36 14 L 36 28 Z" fill="#0d2b5e"/>
          </svg>
          <blockquote className="h-display text-[20px] sm:text-[24px] md:text-[32px] leading-[1.4] text-brand-ink m-0">
            &ldquo;{t.testimonial.quote}&rdquo;
          </blockquote>
          <footer className="text-[11px] tracking-wide-cap uppercase font-medium text-brand-mute mt-7">
            — {t.testimonial.who}
          </footer>
        </div>
      </Container>
    </section>
  );
}
