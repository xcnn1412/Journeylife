import { Container } from "@/components/sections/_layout";
import { I18N } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

/** น้องเจอร์นี่ขับเครื่องบิน — โชว์ระหว่างรอผลค้นหา (encode ช่องว่างในชื่อโฟลเดอร์ไทย). */
const MASCOT = encodeURI("/source/น้องเจอร์นี่ png/น้องเจอร์นี่ขับเครื่องบิน.png");

/**
 * Placeholder shown while the upstream tour search streams in. Leads with the
 * น้องเจอร์นี่-flying-a-plane mascot + a friendly line so the wait feels calm,
 * then mirrors the <TourResults> grid (square banner + body) so the layout
 * doesn't shift when the real cards swap in. Pure server component — no JS
 * shipped; motion is CSS-only and respects prefers-reduced-motion.
 */
export function TourResultsSkeleton({ cards = 6, lang = "th" }: { cards?: number; lang?: Locale }) {
  const t = I18N[lang].overseasPackages.searchResults;

  return (
    <Container className="py-12 md:py-16">
      {/* ── น้องเจอร์นี่กำลังบินหาทัวร์ (ลดความรีบเร่งระหว่างรอ) ── */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-brand-line bg-linear-to-b from-white to-brand-paper px-6 py-10 text-center md:py-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-glow-tr" />

        <div className="relative mx-auto w-40 md:w-48">
          {/* เส้นทางบินประวิ่ง ๆ ข้างหลังน้อง */}
          <svg
            aria-hidden
            viewBox="0 0 220 64"
            className="absolute -left-8 top-1/2 w-[140%] -translate-y-1/2 text-brand-red/45"
          >
            <path
              d="M2 54 Q 80 8 218 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="2 11"
              className="jl-trail"
            />
          </svg>

          {/* eslint-disable-next-line @next/next/no-img-element -- decorative mascot, not LCP; avoids optimizer on a Thai-named file */}
          <img
            src={MASCOT}
            alt=""
            width={192}
            height={192}
            draggable={false}
            className="relative mx-auto w-full select-none mascot-fly drop-shadow-[0_18px_30px_rgba(13,43,94,.22)]"
          />
        </div>

        <h2 className="mt-6 h-display text-brand-blue" style={{ fontSize: "clamp(20px, 3vw, 28px)" }}>
          {t.loadingTitle}
        </h2>
        <p className="mt-2.5 inline-flex items-center gap-1.5 text-[14px] text-brand-mute">
          {t.loadingSub}
          <span aria-hidden className="ml-0.5 inline-flex items-center gap-1">
            <span className="jl-load-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-red" style={{ animationDelay: "0s" }} />
            <span className="jl-load-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-red" style={{ animationDelay: ".2s" }} />
            <span className="jl-load-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-red" style={{ animationDelay: ".4s" }} />
          </span>
        </p>
      </div>

      {/* ── โครงการ์ดผลลัพธ์ (กันเลย์เอาต์ขยับตอนของจริงสตรีมเข้า) ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl bg-white border border-brand-line">
            <div className="aspect-square w-full bg-brand-line/60 animate-pulse" />
            <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
              <div className="h-3 w-24 rounded bg-brand-line/70 animate-pulse" />
              <div className="h-4 w-full rounded bg-brand-line/70 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-brand-line/70 animate-pulse" />
              <div className="mt-auto pt-4">
                <div className="h-6 w-28 rounded bg-brand-line/70 animate-pulse" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-9 rounded bg-brand-line/70 animate-pulse" />
                  <div className="h-9 rounded bg-brand-line/70 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">{t.loadingTitle}</span>
    </Container>
  );
}
