"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSite } from "@/lib/site-context";
import {
  type Answers,
  QUESTION_RULES,
  STEP_COUNT,
  cutoffFor,
  rankCountries,
} from "@/lib/country-atlas";
import { WorldDotMap } from "./WorldDotMap";
import { QuizPanel } from "./QuizPanel";
import { ResultCards } from "./ResultCards";

/* ──────────────────────────────────────────────────────────
   ROUTE FINDER — "ค้นหาด้วยเจอร์นี่ AI"
   A trigger button + a full-screen modal quiz. Five questions
   progressively score the 73 destinations (rule-based, no API);
   the world map dims as the field narrows, ending on a Top-3
   that links into the existing on-site tour search.
   ────────────────────────────────────────────────────────── */

export function RouteFinderButton({ className = "" }: { className?: string }) {
  const { t } = useSite();
  const rf = t.overseasPackages.routeFinder;
  const [open, setOpen] = useState(false);

  return (
    <>
      <span className={`relative inline-flex ${className}`}>
        {/* pulsing aura */}
        <span aria-hidden className="rf-cta-glow pointer-events-none absolute -inset-1.5 rounded-full bg-brand-red/55 blur-lg" />
        <button type="button" onClick={() => setOpen(true)} className="btn rf-cta text-white">
          <span aria-hidden className="rf-cta-sheen" />
          <span className="relative z-[2] inline-flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="-ml-0.5">
              <path className="rf-twinkle" d="M12 2.5 13.6 8l5.4 1.6L13.6 11 12 16.5 10.4 11 5 9.6 10.4 8 12 2.5Z" />
              <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" opacity=".7" />
            </svg>
            {rf.trigger}
            <span className="arrow">→</span>
          </span>
        </button>
      </span>
      {/* Mount only while open → a fresh mount resets the quiz; unmount cleans up. */}
      {open && <RouteFinderModal onClose={() => setOpen(false)} />}
    </>
  );
}

function RouteFinderModal({ onClose }: { onClose: () => void }) {
  const { t } = useSite();
  const rf = t.overseasPackages.routeFinder;
  const questions = rf.questions;
  const lineHref = `https://line.me/R/ti/p/${t.contact.direct.line}`;

  const [step, setStep] = useState(0);
  const [isResult, setIsResult] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  // Clear any pending auto-advance timer on unmount.
  useEffect(() => () => clearTimer(), []);

  // Scroll lock + ESC + focus trap.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const focusId = setTimeout(() => panelRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      clearTimeout(focusId);
    };
  }, [onClose]);

  // ── Scoring / map state ──
  const ranked = useMemo(() => rankCountries(answers), [answers]);
  const answeredSteps = isResult ? STEP_COUNT : step;
  const cutoff = cutoffFor(answeredSteps);
  const third = ranked[2]?.normalized ?? 0;
  const effCutoff = Math.min(cutoff, third); // keep at least the Top 3 lit
  const litCount = useMemo(() => ranked.filter((s) => s.normalized >= effCutoff).length, [ranked, effCutoff]);
  const top3 = useMemo(() => ranked.slice(0, 3), [ranked]);
  const topSet = useMemo(() => (isResult ? new Set(top3.map((s) => s.c.th)) : new Set<string>()), [isResult, top3]);

  const labelMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const q of questions) for (const o of q.options) m.set(`${q.id}:${o.value}`, o.label);
    return m;
  }, [questions]);

  if (typeof document === "undefined") return null;

  const q = questions[step];
  const rule = QUESTION_RULES[step];
  const multi = rule.type === "multi";
  const selected = answers[q.id] ?? [];
  const canBack = isResult || step > 0;

  const advance = () => {
    clearTimer();
    if (step < STEP_COUNT - 1) {
      setStep((s) => s + 1);
    } else {
      // Dramatise the "AI" by running a short analysis before revealing the Top 3.
      setAnalyzing(true);
      timer.current = setTimeout(() => {
        setAnalyzing(false);
        setIsResult(true);
      }, 1500);
    }
  };

  const onSelect = (value: string) => {
    if (multi) {
      const cur = answers[q.id] ?? [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      setAnswers((a) => ({ ...a, [q.id]: next }));
    } else {
      setAnswers((a) => ({ ...a, [q.id]: [value] }));
      clearTimer();
      timer.current = setTimeout(advance, 620); // let the map react before moving on
    }
  };

  const onBack = () => {
    clearTimer();
    if (isResult) {
      setIsResult(false);
      setStep(STEP_COUNT - 1);
    } else if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const onSkip = () => {
    setAnswers((a) => ({ ...a, [q.id]: [] }));
    advance();
  };

  const onRestart = () => {
    clearTimer();
    setStep(0);
    setIsResult(false);
    setAnalyzing(false);
    setAnswers({});
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
      <div className="rf-backdrop absolute inset-0 bg-brand-ink/70 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={rf.title}
        className="rf-panel relative z-[1] flex max-h-[92vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_50px_120px_-30px_rgba(6,26,61,.8)] outline-none"
      >
        {/* Luxe top accent */}
        <span aria-hidden className="h-[3px] w-full shrink-0 bg-linear-to-r from-brand-red via-brand-cream to-brand-blue" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-brand-line px-5 py-3.5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="rf-orb grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand-red to-[#a90c24] text-white">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2.5 13.6 8l5.4 1.6L13.6 11 12 16.5 10.4 11 5 9.6 10.4 8 12 2.5Z" />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-bold leading-tight text-brand-ink">{rf.title}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-brand-red to-[#a90c24] px-1.5 py-[1.5px] text-[9px] font-bold tracking-wide-cap uppercase text-white">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.5 13.6 8l5.4 1.6L13.6 11 12 16.5 10.4 11 5 9.6 10.4 8 12 2.5Z" />
                  </svg>
                  {rf.aiTag}
                </span>
                <span className="hidden truncate text-[11px] text-brand-mute sm:inline">{rf.subtitle}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={rf.close}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-brand-mute transition-colors hover:bg-brand-paper hover:text-brand-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — map | quiz/result */}
        <div className="relative grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1.15fr_1fr] lg:overflow-hidden">
          {/* Map */}
          <div className="relative min-h-[232px] overflow-hidden bg-brand-blue-deep sm:min-h-[280px] lg:min-h-0">
            <WorldDotMap scored={ranked} cutoff={effCutoff} topSet={topSet} showLabels={isResult} />
            {!isResult && (
              <div className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2.5 rounded-xl bg-brand-ink/55 px-3.5 py-2 text-white ring-1 ring-white/15 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span aria-hidden className="absolute inline-flex h-full w-full rounded-full bg-brand-cream opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cream" />
                </span>
                <span className="leading-none">
                  <span className="block text-[8.5px] font-semibold uppercase tracking-wide-cap text-brand-cream/90">{rf.aiTag}</span>
                  <span className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="text-[16px] font-bold tabular-nums leading-none">{litCount}</span>
                    <span className="text-[10px] text-white/55">{rf.counter}</span>
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Quiz / Result */}
          <div className="flex min-h-0 flex-col p-5 sm:p-7 lg:overflow-y-auto">
            {isResult ? (
              <ResultCards top={top3} labelMap={labelMap} copy={rf} lineHref={lineHref} onRestart={onRestart} />
            ) : (
              <QuizPanel
                title={q.title}
                hint={q.hint}
                options={q.options}
                multi={multi}
                selected={selected}
                onSelect={onSelect}
                stepIndex={step}
                stepCount={STEP_COUNT}
                litCount={litCount}
                copy={rf}
                isLast={step === STEP_COUNT - 1}
                canBack={canBack}
                onBack={onBack}
                onSkip={onSkip}
                onNext={advance}
              />
            )}
          </div>

          {/* AI analysing overlay */}
          {analyzing && (
            <div className="rf-analyzing absolute inset-0 z-20 grid place-items-center bg-brand-blue-deep/75 px-6 backdrop-blur-md">
              <div className="max-w-[320px] text-center">
                <span className="rf-orb mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-brand-red to-[#a90c24] text-white">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.5 13.6 8l5.4 1.6L13.6 11 12 16.5 10.4 11 5 9.6 10.4 8 12 2.5Z" />
                  </svg>
                </span>
                <h3 className="h-display mt-6 text-[19px] leading-snug text-white">{rf.analyzing}</h3>
                <p className="mt-2 text-[12px] text-white/55">{rf.analyzingSub}</p>
                <div className="mx-auto mt-5 h-1 w-44 overflow-hidden rounded-full bg-white/12">
                  <div className="rf-shimmer h-full w-1/2 bg-linear-to-r from-transparent via-brand-cream to-transparent" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
