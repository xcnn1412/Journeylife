"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TourPeriod } from "@/lib/tour-detail";

/* ──────────────────────────────────────────────────────────
   BOOKING FORM MODAL — the in-house "online booking" pop-up
   (replaces the old external booking.php link). A branded lead
   form: prefilled tour + departure, contact + qualifying fields
   for the sales team, an in-form LINE discount CTA, and a success
   state that funnels to LINE.

   No backend yet → submit shows a success view and lets the lead
   reach the team via LINE. Wire a POST in `onSubmit` to persist.
   ────────────────────────────────────────────────────────── */

export interface BookingFormCopy {
  title: string;
  program: string;
  period: string;
  priceLabel: string;
  name: string;
  namePh: string;
  phone: string;
  phonePh: string;
  email: string;
  emailPh: string;
  lineId: string;
  lineIdPh: string;
  channel: string;
  channels: readonly string[];
  intent: string;
  intents: readonly string[];
  adults: string;
  children: string;
  notes: string;
  notesPh: string;
  required: string;
  optional: string;
  submit: string;
  lineCtaTitle: string;
  lineCtaSub: string;
  lineCta: string;
  discountNote: string;
  sentTitle: string;
  sentSub: string;
  sentLine: string;
  copySummary: string;
  copied: string;
  close: string;
  summaryTitle: string;
}

const LineGlyph = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" />
  </svg>
);

const LINE = "#06C755";
const labelCls = "block text-[12px] font-semibold text-brand-ink mb-1.5";
const fieldCls =
  "w-full rounded-lg border border-brand-line bg-white px-3.5 py-2.5 text-[14px] text-brand-ink placeholder:text-brand-mute/55 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15";

/* Custom departure dropdown — native <select> can't style its option list, so
   this renders a rich, branded panel (date + price + struck original). The panel
   is portalled above the modal (z-120 > modal z-100) so it's never clipped. */
function PeriodSelect({
  periods,
  value,
  onChange,
}: {
  periods: TourPeriod[];
  value: number;
  onChange: (i: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0, maxH: 320 });
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selected = periods[value];

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rb = el.getBoundingClientRect();
    const top = rb.bottom + 6;
    setPos({ left: rb.left, top, width: rb.width, maxH: Math.max(200, window.innerHeight - top - 12) });
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onMove = () => place();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  const pick = (i: number) => {
    onChange(i);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            place();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${fieldCls} flex items-center justify-between gap-2 text-left`}
      >
        <span className="min-w-0 truncate">
          <span className="font-semibold text-brand-ink">{selected?.date}</span>
          {selected && <span className="ml-1.5 text-[13px] font-bold text-brand-red">{selected.price}</span>}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-brand-mute transition-transform ${open ? "rotate-180" : ""}`} aria-hidden><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", left: pos.left, top: pos.top, width: pos.width, maxHeight: pos.maxH }}
            className="z-[120] flex flex-col overflow-hidden rounded-xl border border-brand-line bg-white shadow-[0_28px_64px_-18px_rgba(10,16,36,.5)]"
          >
            <ul role="listbox" className="flex-1 overflow-auto py-1">
              {periods.map((p, i) => {
                const on = i === value;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      role="option"
                      onClick={() => pick(i)}
                      aria-selected={on}
                      className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors ${on ? "bg-brand-blue/[0.06]" : "hover:bg-brand-paper"}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {on ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-blue" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
                        ) : (
                          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-line" />
                        )}
                        <span className={`truncate text-[13.5px] ${on ? "font-bold text-brand-blue" : "font-semibold text-brand-ink"}`}>{p.date}</span>
                      </span>
                      <span className="shrink-0 text-right leading-tight">
                        {p.original && <span className="block text-[10px] text-brand-mute line-through">{p.original}</span>}
                        <span className="block text-[13px] font-bold text-brand-red">{p.price}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}

export function BookingFormModal({
  code,
  title,
  periods,
  defaultIndex,
  lineHref,
  copy,
  onClose,
}: {
  code: string;
  title: string;
  periods: TourPeriod[];
  defaultIndex: number;
  lineHref: string;
  copy: BookingFormCopy;
  onClose: () => void;
}) {
  const [periodIdx, setPeriodIdx] = useState(defaultIndex);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [channel, setChannel] = useState("");
  const [intent, setIntent] = useState("");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Scroll lock + ESC.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const period = periods[periodIdx];
  const summary = [
    `📋 ${copy.summaryTitle}`,
    `${copy.program}: ${code} ${title}`,
    `${copy.period}: ${period?.date ?? "-"} (${period?.price ?? "-"})`,
    `${copy.name}: ${name}`,
    `${copy.phone}: ${phone}`,
    email && `${copy.email}: ${email}`,
    lineId && `LINE: ${lineId}`,
    `${copy.adults}: ${adults} · ${copy.children}: ${children}`,
    channel && `${copy.channel}: ${channel}`,
    intent && `${copy.intent}: ${intent}`,
    notes && `${copy.notes}: ${notes}`,
  ]
    .filter(Boolean)
    .join("\n");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // No backend yet — show success + funnel to LINE. To persist the lead,
    // POST `summary`/the fields to a Payload collection · email · or webhook here.
    setSent(true);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = summary;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const chipCls = (on: boolean) =>
    `rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
      on ? "bg-brand-blue text-white" : "bg-brand-paper text-brand-ink ring-1 ring-brand-line hover:ring-brand-blue/45"
    }`;
  const req = <span className="text-brand-red">*</span>;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
      <div className="rf-backdrop absolute inset-0 bg-brand-ink/70 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="rf-panel relative z-[1] flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_50px_120px_-30px_rgba(6,26,61,.8)] md:max-w-[860px]"
      >
        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-between gap-3 border-b border-brand-line px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-blue text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </span>
            <h2 className="text-[16px] font-bold text-brand-ink">{copy.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={copy.close} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-brand-mute transition-colors hover:bg-brand-paper hover:text-brand-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto">
          {sent ? (
            /* ── Success ── */
            <div className="px-5 py-8 text-center sm:px-6">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              <h3 className="h-display mt-5 text-[20px] text-brand-ink">{copy.sentTitle}</h3>
              <p className="mx-auto mt-2 max-w-[340px] text-[13px] leading-[1.7] text-brand-mute">{copy.sentSub}</p>

              <a
                href={lineHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-bold text-white shadow-[0_14px_28px_-12px_rgba(6,199,85,.7)] transition-transform hover:-translate-y-px"
                style={{ backgroundColor: LINE }}
              >
                <LineGlyph /> {copy.sentLine}
              </a>
              <button
                type="button"
                onClick={copySummary}
                className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand-line px-4 py-2.5 text-[13px] font-semibold text-brand-ink transition-colors hover:bg-brand-paper"
              >
                {copied ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                )}
                {copied ? copy.copied : copy.copySummary}
              </button>
            </div>
          ) : (
            <div className="md:grid md:grid-cols-[270px_1fr]">
              {/* LEFT — trip + LINE promo (sidebar on desktop/tablet, top on mobile) */}
              <div className="border-b border-brand-line bg-brand-paper/50 p-5 sm:px-6 md:border-b-0 md:border-r md:px-5">
                <span className={labelCls}>{copy.program}</span>
                <div className="rounded-lg border border-brand-line bg-white px-3.5 py-2.5 text-[13.5px] font-medium text-brand-ink">
                  <span className="font-bold text-brand-blue">{code}</span> {title}
                </div>

                <div className="mt-4">
                  <span className={labelCls}>{copy.period} {req}</span>
                  <PeriodSelect periods={periods} value={periodIdx} onChange={setPeriodIdx} />
                </div>

                {/* LINE discount CTA */}
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-linear-to-br from-[#06C755]/12 to-[#06C755]/5 p-3 ring-1 ring-[#06C755]/25">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: LINE }}>
                    <LineGlyph size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-brand-ink">{copy.lineCtaTitle}</p>
                    <p className="text-[11.5px] text-brand-mute">{copy.lineCtaSub}<span aria-hidden> *</span></p>
                  </div>
                </div>
                <a href={lineHref} target="_blank" rel="noopener noreferrer" className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[12.5px] font-bold text-white" style={{ backgroundColor: LINE }}>
                  <LineGlyph size={15} /> {copy.lineCta}
                </a>
                <p className="mt-2 text-[10.5px] text-brand-mute">* {copy.discountNote}</p>
              </div>

              {/* RIGHT — contact form */}
              <form onSubmit={onSubmit} className="p-5 sm:px-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label htmlFor="bf-name" className={labelCls}>{copy.name} {req}</label>
                    <input id="bf-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder={copy.namePh} className={fieldCls} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="bf-phone" className={labelCls}>{copy.phone} {req}</label>
                    <input id="bf-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={copy.phonePh} className={fieldCls} />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="bf-email" className={labelCls}>{copy.email} <span className="font-normal text-brand-mute/70">({copy.optional})</span></label>
                    <input id="bf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={copy.emailPh} className={fieldCls} />
                  </div>

                  {/* LINE ID */}
                  <div className="sm:col-span-2">
                    <label htmlFor="bf-line" className={labelCls}>{copy.lineId} <span className="font-normal text-brand-mute/70">({copy.optional})</span></label>
                    <input id="bf-line" value={lineId} onChange={(e) => setLineId(e.target.value)} placeholder={copy.lineIdPh} className={fieldCls} />
                  </div>

                  {/* Preferred channel */}
                  <div className="sm:col-span-2">
                    <span className={labelCls}>{copy.channel}</span>
                    <div className="flex flex-wrap gap-2">
                      {copy.channels.map((ch) => (
                        <button key={ch} type="button" onClick={() => setChannel((c) => (c === ch ? "" : ch))} className={chipCls(channel === ch)}>
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intent */}
                  <div className="sm:col-span-2">
                    <span className={labelCls}>{copy.intent}</span>
                    <div className="flex flex-wrap gap-2">
                      {copy.intents.map((it) => (
                        <button key={it} type="button" onClick={() => setIntent((c) => (c === it ? "" : it))} className={chipCls(intent === it)}>
                          {it}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pax */}
                  <div>
                    <label htmlFor="bf-adults" className={labelCls}>{copy.adults}</label>
                    <input id="bf-adults" type="number" min={1} value={adults} onChange={(e) => setAdults(e.target.value)} className={fieldCls} />
                  </div>
                  <div>
                    <label htmlFor="bf-children" className={labelCls}>{copy.children}</label>
                    <input id="bf-children" type="number" min={0} value={children} onChange={(e) => setChildren(e.target.value)} className={fieldCls} />
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2">
                    <label htmlFor="bf-notes" className={labelCls}>{copy.notes} <span className="font-normal text-brand-mute/70">({copy.optional})</span></label>
                    <textarea id="bf-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={copy.notesPh} className={`${fieldCls} resize-none`} />
                  </div>
                </div>

                <button type="submit" className="btn btn-red mt-5 w-full justify-center">
                  {copy.submit}
                  <span className="arrow">→</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
