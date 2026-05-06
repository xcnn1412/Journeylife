"use client";
import { useSite } from "@/lib/site-context";
import { Container, SectionHeading } from "./_layout";

export function Destinations() {
  const { t } = useSite();
  return (
    <section id="destinations" className="py-24 md:py-36 bg-white">
      <Container>
        <div className="reveal grid lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-16">
          <div>
            <SectionHeading eyebrow={t.destinations.eyebrow} title={t.destinations.title} />
          </div>
          <p className="text-[18px] text-brand-mute leading-[1.65] max-w-[56ch] font-light">
            {t.destinations.lede}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {t.destinations.items.map((it, i) => (
            <a
              key={i}
              href="#contact"
              className="reveal block group"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="relative overflow-hidden">
                <div
                  className="ph-img transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <span>{it.region}</span>
                </div>
                {/* Tags overlay */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                  <span className="bg-white text-brand-ink text-[10px] tracking-wide-cap uppercase font-semibold px-3 py-1.5 shadow-[0_2px_8px_rgba(10,16,36,.08)]">
                    {it.region}
                  </span>
                  <span className="bg-brand-red text-white text-[10px] tracking-wide-cap uppercase font-semibold px-3 py-1.5">
                    {it.pax}
                  </span>
                </div>
                {/* Bottom gradient overlay reveal on hover */}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-ink/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
              <div className="mt-6">
                <div className="text-[10px] tracking-wide-cap uppercase font-medium text-brand-mute">{it.tag}</div>
                <h3 className="h-display text-[26px] md:text-[30px] mt-2.5 group-hover:text-brand-red transition-colors duration-500">
                  {it.title}
                </h3>
                <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-brand-line group-hover:border-brand-red/50 transition-colors duration-500">
                  <span className="text-[11px] tracking-wide-cap uppercase font-medium text-brand-mute">{it.days}</span>
                  <span className="h-display text-[18px] text-brand-blue">{it.price}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-20">
          <a href="#contact" className="btn btn-blue">
            {t.destinations.cta}
            <span className="arrow">→</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
