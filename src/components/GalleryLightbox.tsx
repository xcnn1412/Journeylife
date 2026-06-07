"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export type GalleryPic = {
  /** Optimized 'card' size for the grid. */
  src: string;
  /** Full-resolution master image, shown in the lightbox. */
  full: string;
  alt: string;
  width: number;
  height: number;
  caption: string | null;
};

/** A grid tile that opens the lightbox on click.
 *  `style={{ margin: 0 }}` (inline) cancels the `.rich img { margin }` rule — that
 *  rule is UNLAYERED in globals.css, so a Tailwind utility (layered) can't beat it
 *  regardless of specificity; only an inline style (or !important) wins. Without
 *  this the fill image is pushed down and the dark container edge shows at the top. */
const noMargin = { margin: 0 } as const;

function Tile({ pic, sizes, onOpen }: { pic: GalleryPic; sizes: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={pic.caption || pic.alt || "ดูรูปขนาดเต็ม"}
      className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border-0 bg-brand-ink p-0"
    >
      <Image
        src={pic.src}
        alt={pic.caption || pic.alt}
        fill
        sizes={sizes}
        style={noMargin}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </button>
  );
}

export function GalleryLightbox({ layout, images }: { layout: string; images: GalleryPic[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? i : (i + images.length - 1) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  let grid: ReactNode;
  if (layout === "carousel") {
    grid = (
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3">
        {images.map((g, i) => (
          <figure key={i} className="m-0 w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[40%]">
            <Tile pic={g} sizes="(max-width: 640px) 82vw, 40vw" onOpen={() => setOpen(i)} />
            {g.caption && <figcaption className="mt-2 text-[12px] text-brand-mute">{g.caption}</figcaption>}
          </figure>
        ))}
      </div>
    );
  } else if (layout === "masonry") {
    grid = (
      <div className="columns-2 gap-3 md:columns-3">
        {images.map((g, i) => (
          <figure key={i} className="m-0 mb-3 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={g.caption || g.alt || "ดูรูปขนาดเต็ม"}
              className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
            >
              <Image
                src={g.src}
                alt={g.caption || g.alt}
                width={g.width}
                height={g.height}
                sizes="(max-width: 768px) 50vw, 33vw"
                style={noMargin}
                className="h-auto w-full rounded-xl bg-brand-ink"
              />
            </button>
            {g.caption && <figcaption className="mt-1.5 text-[12px] text-brand-mute">{g.caption}</figcaption>}
          </figure>
        ))}
      </div>
    );
  } else {
    const cols = layout === "grid3" ? "sm:grid-cols-3" : "sm:grid-cols-2";
    grid = (
      <div className={`grid grid-cols-2 gap-3 md:gap-4 ${cols}`}>
        {images.map((g, i) => (
          <figure key={i} className="m-0">
            <Tile pic={g} sizes="(max-width: 768px) 50vw, 380px" onOpen={() => setOpen(i)} />
            {g.caption && <figcaption className="mt-2 text-[12px] text-brand-mute">{g.caption}</figcaption>}
          </figure>
        ))}
      </div>
    );
  }

  const current = open === null ? null : images[open];

  return (
    <div className="not-prose my-9">
      {grid}

      {current &&
        createPortal(
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="ปิด"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-white/10 text-2xl leading-none text-white/90 transition-colors hover:bg-white/20"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="รูปก่อนหน้า"
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border-0 bg-white/10 text-3xl leading-none text-white/90 transition-colors hover:bg-white/20 md:left-6"
            >
              ‹
            </button>
          )}

          <figure className="m-0 flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={current.full}
              alt={current.caption || current.alt}
              width={current.width}
              height={current.height}
              sizes="92vw"
              style={noMargin}
              className="h-auto max-h-[86vh] w-auto max-w-[92vw] rounded-lg object-contain"
            />
            {current.caption && (
              <figcaption className="mt-3 text-center text-[13px] text-white/80">{current.caption}</figcaption>
            )}
          </figure>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="รูปถัดไป"
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border-0 bg-white/10 text-3xl leading-none text-white/90 transition-colors hover:bg-white/20 md:right-6"
            >
              ›
            </button>
          )}
        </div>,
          document.body,
        )}
    </div>
  );
}
