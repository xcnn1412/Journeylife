"use client";

/* Presentational quiz step — renders the current question, its options (single
   = radio / multi = checkbox), the live "matching destinations" counter, and the
   Back / Skip / Next controls. All state lives in RouteFinder. */

export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizCopy {
  step: string;
  of: string;
  counter: string;
  multiHint: string;
  skip: string;
  back: string;
  next: string;
  finish: string;
}

export function QuizPanel({
  title,
  hint,
  options,
  multi,
  selected,
  onSelect,
  stepIndex,
  stepCount,
  litCount,
  copy,
  isLast,
  canBack,
  onBack,
  onSkip,
  onNext,
}: {
  title: string;
  hint: string;
  options: readonly QuizOption[];
  multi: boolean;
  selected: string[];
  onSelect: (value: string) => void;
  stepIndex: number;
  stepCount: number;
  litCount: number;
  copy: QuizCopy;
  isLast: boolean;
  canBack: boolean;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Progress + counter */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] tracking-wide-cap uppercase font-semibold text-brand-mute">
          {copy.step} {stepIndex + 1} {copy.of} {stepCount}
        </span>
        <span
          aria-live="polite"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/8 px-3 py-1 text-[11px] font-semibold text-brand-blue"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
          {copy.counter}: <span className="tabular-nums">{litCount}</span>
        </span>
      </div>

      {/* Step dots */}
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {Array.from({ length: stepCount }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < stepIndex ? "bg-brand-red" : i === stepIndex ? "bg-brand-blue" : "bg-brand-line"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <h3 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(20px, 2.4vw, 28px)" }}>
        {title}
      </h3>
      {(hint || multi) && (
        <p className="mt-1.5 text-[12.5px] text-brand-mute font-light">{hint || copy.multiHint}</p>
      )}

      {/* Options */}
      <div role={multi ? "group" : "radiogroup"} className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={on}
              onClick={() => onSelect(o.value)}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14px] font-medium transition-all ${
                on
                  ? "border-brand-blue bg-linear-to-br from-brand-blue/8 to-brand-blue/[0.02] text-brand-blue ring-1 ring-brand-blue/20 shadow-[0_10px_26px_-14px_rgba(13,43,94,.6)]"
                  : "border-brand-line bg-white text-brand-ink hover:-translate-y-px hover:border-brand-blue/40 hover:bg-brand-paper"
              }`}
            >
              <span
                aria-hidden
                className={`grid h-5 w-5 shrink-0 place-items-center border transition-colors ${
                  multi ? "rounded-[6px]" : "rounded-full"
                } ${on ? "border-brand-blue bg-brand-blue text-white" : "border-brand-line bg-white text-transparent"}`}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span className="leading-snug">{o.label}</span>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={!canBack}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-mute transition-colors hover:text-brand-ink disabled:opacity-0"
        >
          <span aria-hidden>←</span> {copy.back}
        </button>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSkip}
            className="text-[13px] font-semibold text-brand-mute transition-colors hover:text-brand-ink"
          >
            {copy.skip}
          </button>
          <button type="button" onClick={onNext} className="btn btn-red">
            {isLast ? copy.finish : copy.next}
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
