"use client";
import { useSite } from "@/lib/site-context";
import { Logo } from "../Nav";
import { Container } from "./_layout";

export function Footer() {
  const { t } = useSite();
  return (
    <footer className="bg-brand-ink text-white pt-20 pb-8 relative overflow-hidden">
      {/* Hairline brand-red glow at top */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-red to-transparent" />

      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 max-w-[360px]">
            <Logo size={32} dark />
            <p className="mt-7 text-[14px] leading-[1.7] text-white/60 font-light">{t.footer.tagline}</p>
          </div>
          {t.footer.cols.map((col, i) => (
            <div key={i}>
              <div className="text-[10px] tracking-wide-cap uppercase font-semibold text-white/40 mb-5">{col.title}</div>
              <ul className="list-none p-0 m-0 grid gap-3">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a href="#" className="text-[13px] no-underline text-white/80 hover:text-brand-red transition-colors duration-300 font-light">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 pt-7 border-t border-white/10 flex justify-between flex-wrap gap-4 text-[10px] tracking-wide-cap uppercase text-white/40 font-medium">
          <span>{t.footer.legal}</span>
          <span>BANGKOK · TOKYO · ZURICH</span>
        </div>
      </Container>
    </footer>
  );
}
