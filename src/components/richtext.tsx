import type { ComponentProps } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { CalloutBlock, CtaBlock, GalleryBlock, Media, QuoteBlock, ReviewsBlock, StatsBlock, VideoBlock } from "@/payload-types";
import { GalleryLightbox, type GalleryPic } from "./GalleryLightbox";

/* ── Callout ─────────────────────────────────────────────── */
const CALLOUT_STYLES: Record<NonNullable<CalloutBlock["style"]>, { wrap: string; icon: string }> = {
  info: { wrap: "border-brand-blue/60 bg-brand-blue/[0.04]", icon: "ℹ️" },
  tip: { wrap: "border-brand-cream bg-brand-cream/15", icon: "💡" },
  highlight: { wrap: "border-brand-red/60 bg-brand-red/[0.04]", icon: "⭐" },
  warning: { wrap: "border-amber-500/70 bg-amber-50", icon: "⚠️" },
};

function Callout({ style, title, body }: CalloutBlock) {
  const s = CALLOUT_STYLES[style ?? "info"];
  return (
    <div className={`not-prose my-7 rounded-xl border-l-4 p-5 md:p-6 ${s.wrap}`}>
      <div className="flex gap-3">
        <span aria-hidden className="text-xl leading-none select-none">{s.icon}</span>
        <div className="min-w-0">
          {title && <p className="mb-1 font-semibold text-brand-blue">{title}</p>}
          <p className="whitespace-pre-line text-[15px] leading-[1.7] text-brand-ink/85">{body}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Quote / testimonial ─────────────────────────────────── */
function Quote({ quote, author, role }: QuoteBlock) {
  return (
    <figure className="not-prose my-9 border-l-4 border-brand-red pl-5 md:pl-7">
      <blockquote className="text-[20px] md:text-[24px] font-light italic leading-[1.5] text-brand-blue">
        “{quote}”
      </blockquote>
      {(author || role) && (
        <figcaption className="mt-3 text-[13px] tracking-wide-cap uppercase text-brand-mute">
          {author}
          {author && role ? " · " : ""}
          {role}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Key numbers ─────────────────────────────────────────── */
function Stats({ items }: StatsBlock) {
  const list = items ?? [];
  if (list.length === 0) return null;
  return (
    <div className="not-prose my-9 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
      {list.map((it) => (
        <div key={it.id} className="rounded-xl border border-brand-line bg-brand-paper p-5 text-center">
          <div className="text-[30px] md:text-[36px] font-semibold leading-none text-brand-blue">{it.value}</div>
          <div className="mt-2 text-[12px] leading-snug text-brand-mute">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Gallery ─────────────────────────────────────────────── */
function toPic(image: number | Media, caption?: string | null): GalleryPic | null {
  if (!image || typeof image !== "object") return null;
  const card = image.sizes?.card;
  const src = card?.url || image.url;
  if (!src) return null;
  return {
    src,
    full: image.url || src, // master (full-res) for the click-to-zoom lightbox
    alt: image.alt || "",
    width: card?.width || image.width || 1200,
    height: card?.height || image.height || 800,
    caption: caption ?? null,
  };
}

function Gallery({ layout, images }: GalleryBlock) {
  const pics = (images ?? []).map((g) => toPic(g.image, g.caption)).filter((p): p is GalleryPic => p !== null);
  if (pics.length === 0) return null;
  return <GalleryLightbox layout={layout ?? "grid2"} images={pics} />;
}

/* ── Customer reviews ────────────────────────────────────── */
const AVATAR_COLORS = ["#0d2b5e", "#c8102e", "#b8924a", "#1f7a5c", "#5b3fa0", "#0b6e8f"];
function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div aria-label={`${rating} จาก 5 ดาว`} className="flex gap-0.5 text-[15px] leading-none">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden style={{ color: n <= rating ? "#f5a623" : "#d9dbe2" }}>★</span>
      ))}
    </div>
  );
}

function ReviewCard({ name, rating, date, text }: NonNullable<ReviewsBlock["items"]>[number]) {
  const stars = Number(rating ?? "5") || 5;
  const initial = (name?.trim()?.[0] || "?").toUpperCase();
  return (
    <figure className="m-0 flex flex-col rounded-xl border border-brand-line bg-white p-5 shadow-[0_1px_3px_rgba(10,16,36,0.06)]">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[16px] font-semibold text-white"
          style={{ background: avatarColor(name || "?") }}
        >
          {initial}
        </span>
        <div className="min-w-0">
          <div className="truncate font-semibold leading-tight text-brand-ink">{name}</div>
          {date && <div className="text-[12px] text-brand-mute">{date}</div>}
        </div>
      </div>
      <div className="mt-3">
        <Stars rating={stars} />
      </div>
      <p className="mt-2.5 text-[14px] leading-[1.65] text-brand-mute">{text}</p>
    </figure>
  );
}

function Reviews({ heading, items }: ReviewsBlock) {
  const list = items ?? [];
  if (list.length === 0) return null;
  return (
    <div className="not-prose my-10">
      {heading && <h3 className="mt-0 mb-5 text-center text-[22px] font-semibold text-brand-blue md:text-[26px]">{heading}</h3>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <ReviewCard key={r.id} {...r} />
        ))}
      </div>
    </div>
  );
}

/* ── Video embed ─────────────────────────────────────────── */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const m = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
      if (m) return `https://www.youtube.com/embed/${m[2]}`;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

function Video({ url, caption }: VideoBlock) {
  const embed = toEmbedUrl(url);
  return (
    <figure className="not-prose my-9 m-0">
      {embed ? (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-brand-ink">
          <iframe
            src={embed}
            title={caption || "Video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand-red underline">
          {url}
        </a>
      )}
      {caption && <figcaption className="mt-2 text-center text-[12px] text-brand-mute">{caption}</figcaption>}
    </figure>
  );
}

/* ── Call to action ──────────────────────────────────────── */
function Cta({ heading, description, buttonLabel, buttonHref }: CtaBlock) {
  return (
    <div className="not-prose my-10 rounded-2xl bg-brand-blue px-6 py-9 md:px-10 md:py-11 text-center text-white">
      <span aria-hidden className="mx-auto mb-5 block h-px w-12 bg-brand-red" />
      <h3 className="mt-0 text-[22px] md:text-[28px] font-semibold leading-tight">{heading}</h3>
      {description && <p className="mx-auto mt-3 max-w-[52ch] text-[15px] font-light leading-[1.7] text-white/75">{description}</p>}
      <a href={buttonHref} className="btn btn-red mt-6 no-underline">
        {buttonLabel}
      </a>
    </div>
  );
}

/* ── Converters: map each block slug to its renderer ─────── */
const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    callout: ({ node }: { node: { fields: CalloutBlock } }) => <Callout {...node.fields} />,
    quote: ({ node }: { node: { fields: QuoteBlock } }) => <Quote {...node.fields} />,
    reviews: ({ node }: { node: { fields: ReviewsBlock } }) => <Reviews {...node.fields} />,
    stats: ({ node }: { node: { fields: StatsBlock } }) => <Stats {...node.fields} />,
    gallery: ({ node }: { node: { fields: GalleryBlock } }) => <Gallery {...node.fields} />,
    video: ({ node }: { node: { fields: VideoBlock } }) => <Video {...node.fields} />,
    cta: ({ node }: { node: { fields: CtaBlock } }) => <Cta {...node.fields} />,
  },
});

/** Renders portfolio post rich text, including the custom blog widgets. */
export function PostBody({ content, className }: { content: ComponentProps<typeof RichText>["data"]; className?: string }) {
  return <RichText data={content} converters={jsxConverters} className={className} />;
}
