import type { CSSProperties, ReactNode } from "react";

const HEADING_STYLE: CSSProperties = { fontSize: "clamp(30px, 5.2vw, 72px)" };

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`max-w-[1400px] mx-auto px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

/* Eyebrow + h2 — the recurring section-title pair.
   Pass `invert` for white-on-dark variants. */
export function SectionHeading({
  eyebrow,
  title,
  invert = false,
}: {
  eyebrow: string;
  title: string;
  invert?: boolean;
}) {
  return (
    <>
      <span
        className="eyebrow"
        style={invert ? { color: "rgba(255,255,255,.5)" } : undefined}
      >
        {eyebrow}
      </span>
      <h2
        className={invert ? "h-display mt-6 text-white" : "h-display mt-6"}
        style={HEADING_STYLE}
      >
        {title}
      </h2>
    </>
  );
}
