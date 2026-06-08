"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type Country, flagImg } from "@/lib/tour-destinations";

/* Searchable country dropdown with real flag images (flagcdn). Native <select>
   can't render images, so this is a custom combobox. Submits via a hidden input
   so the surrounding <form> still picks the value up by `name`.

   The open panel is rendered in a portal with fixed positioning so it can never
   be clipped by an ancestor's `overflow-hidden` (the search form lives inside
   sections that clip their decorative layers). */

export interface OptionGroup {
  label?: string;
  items: Country[];
}

interface PanelPos {
  left: number;
  top: number;
  width: number;
  maxH: number;
}

function Flag({ th }: { th: string }) {
  const src = flagImg(th);
  if (!src) return <span className="text-[14px] leading-none">🌍</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={20}
      height={15}
      loading="lazy"
      className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-black/10"
    />
  );
}

export function FlagSelect({
  value,
  onChange,
  name,
  placeholder,
  searchPlaceholder,
  noMatch,
  groups,
  fieldClass,
}: {
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder: string;
  searchPlaceholder: string;
  noMatch: string;
  groups: OptionGroup[];
  fieldClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<PanelPos>({ left: 0, top: 0, width: 0, maxH: 320 });
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Measure the trigger and place the fixed panel just below it.
  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rb = el.getBoundingClientRect();
    const top = rb.bottom + 6;
    setPos({ left: rb.left, top, width: rb.width, maxH: Math.max(200, window.innerHeight - top - 12) });
  };

  const openMenu = () => {
    place(); // event handler (not effect) → setState here is fine
    setOpen(true);
  };

  // Close on outside click / Escape; keep the panel open when interacting with it.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onMove = () => place(); // reposition on scroll/resize (callback → setState ok)
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  const selected = groups.flatMap((g) => g.items).find((c) => c.th === value);
  const ql = q.trim().toLowerCase();
  const filtered = groups
    .map((g) => ({
      label: g.label,
      items: g.items.filter((c) => !ql || c.th.toLowerCase().includes(ql) || c.en.toLowerCase().includes(ql)),
    }))
    .filter((g) => g.items.length);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    setQ("");
  }

  const panel = open && typeof document !== "undefined" && (
    <div
      ref={panelRef}
      style={{ position: "fixed", left: pos.left, top: pos.top, width: pos.width, maxHeight: pos.maxH }}
      className="z-[80] flex flex-col overflow-hidden rounded-xl border border-brand-line bg-white shadow-[0_24px_60px_-20px_rgba(10,16,36,.45)]"
    >
      <div className="shrink-0 border-b border-brand-line p-2">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg bg-brand-paper px-3 py-2 text-[13px] text-brand-ink outline-none placeholder:text-brand-mute/60"
        />
      </div>

      <ul role="listbox" className="flex-1 overflow-auto py-1">
        <li>
          <button type="button" onClick={() => pick("")} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-brand-mute hover:bg-brand-paper">
            {placeholder}
          </button>
        </li>
        {filtered.map((g, gi) => (
          <Fragment key={gi}>
            {g.label && (
              <li className="px-3 pt-2.5 pb-1 text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute/70">{g.label}</li>
            )}
            {g.items.map((c) => (
              <li key={c.th}>
                <button
                  type="button"
                  onClick={() => pick(c.th)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13.5px] hover:bg-brand-paper ${
                    c.th === value ? "bg-brand-blue/5 font-semibold text-brand-blue" : "text-brand-ink"
                  }`}
                >
                  <Flag th={c.th} />
                  <span className="truncate">{c.th}</span>
                  <span className="ml-auto text-[11px] text-brand-mute/70">{c.en}</span>
                </button>
              </li>
            ))}
          </Fragment>
        ))}
        {!filtered.length && (
          <li className="px-3 py-5 text-center text-[13px] text-brand-mute">{noMatch}</li>
        )}
      </ul>
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${fieldClass} flex items-center gap-2 text-left`}
      >
        {selected ? (
          <>
            <Flag th={selected.th} />
            <span className="truncate">{selected.th} · {selected.en}</span>
          </>
        ) : (
          <span className="text-brand-mute/60">{placeholder}</span>
        )}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-auto shrink-0 text-brand-mute transition-transform ${open ? "rotate-180" : ""}`} aria-hidden><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {panel && createPortal(panel, document.body)}
    </div>
  );
}
