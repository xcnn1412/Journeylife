"use client";
import { useMemo } from "react";
import type { Scored } from "@/lib/country-atlas";
import { WORLD_LAND } from "@/lib/world-geo";

/* ──────────────────────────────────────────────────────────
   WORLD DOT MAP — a lightweight equirectangular world rendered
   as a faint lat/lng grid plus one glowing dot per country. No
   map library: dots are placed by a linear lat/lng projection,
   and they cluster into recognisable continents on their own.
   As the quiz narrows, low-score dots dim and the Top-3 pulse.
   ────────────────────────────────────────────────────────── */

const W = 1000;
const H = 480;
// Crop the empty polar bands so the inhabited latitudes fill the panel.
const LAT_TOP = 80;
const LAT_BOTTOM = -55;

function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * W;
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * H;
  return [x, Math.max(0, Math.min(H, y))];
}

type DotState = "top" | "active" | "dim";

export function WorldDotMap({
  scored,
  cutoff,
  topSet,
  showLabels,
}: {
  scored: Scored[];
  cutoff: number;
  topSet: Set<string>; // th names that must always stay lit (current Top 3)
  showLabels: boolean; // label the Top 3 on the results step
}) {
  const dots = useMemo(
    () =>
      scored.map((s) => {
        const [x, y] = project(s.c.lat, s.c.lng);
        const isTop = topSet.has(s.c.th);
        const state: DotState = isTop ? "top" : s.normalized >= cutoff ? "active" : "dim";
        const core = 2.4 + s.normalized * 2.6;
        return { key: s.c.th, th: s.c.th, x, y, state, core };
      }),
    [scored, cutoff, topSet],
  );

  // Land outline — same projection as the dots, so they stay aligned.
  const landD = useMemo(
    () =>
      WORLD_LAND.map((ring) =>
        ring
          .map(([lng, lat], i) => {
            const [x, y] = project(lat, lng);
            return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ") + "Z",
      ).join(" "),
    [],
  );

  // Graticule lines (every 30° lng / 20° lat).
  const vLines = useMemo(() => Array.from({ length: 11 }, (_, i) => ((i + 1) * 30) / 360 * W), []);
  const hLines = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const lat = LAT_TOP - (i + 1) * 20;
        return ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * H;
      }),
    [],
  );

  // "Route" path linking the Top-3 (results step) — dots are already rank-ordered.
  const routeD = useMemo(() => {
    const top = dots.filter((d) => d.state === "top");
    if (top.length < 2) return "";
    return top.map((d, i) => `${i ? "L" : "M"}${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(" ");
  }, [dots]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      role="img"
      aria-label="แผนที่โลกแสดงปลายทางที่กำลังกรอง"
    >
      <defs>
        <radialGradient id="rf-sky" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="#102d63" />
          <stop offset="100%" stopColor="#061a3d" />
        </radialGradient>
        {/* Dot-matrix texture for the landmasses */}
        <pattern id="rf-landdots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.7" cy="1.7" r="1" fill="#a9c2f0" opacity="0.5" />
        </pattern>
        {/* Sweeping AI scan beam */}
        <linearGradient id="rf-scanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e6c98a" stopOpacity="0" />
          <stop offset="50%" stopColor="#e6c98a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e6c98a" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="url(#rf-sky)" />

      {/* Graticule */}
      <g stroke="#ffffff" strokeWidth="1" opacity="0.05">
        {vLines.map((x, i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x} y2={H} />
        ))}
        {hLines.map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2={W} y2={y} />
        ))}
      </g>

      {/* Landmasses — solid tint + dotted texture + faint coastline */}
      <g>
        <path d={landD} fill="#1a3f7a" opacity="0.5" />
        <path d={landD} fill="url(#rf-landdots)" />
        <path d={landD} fill="none" stroke="#82a2de" strokeWidth="1" strokeLinejoin="round" opacity="0.22" />
      </g>

      {/* AI scan beam */}
      <g className="rf-scan">
        <rect x="-90" y="0" width="180" height={H} fill="url(#rf-scanGrad)" />
        <line x1="0" y1="0" x2="0" y2={H} stroke="#e6c98a" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Route between the Top-3 */}
      {showLabels && routeD && (
        <g>
          <path d={routeD} fill="none" stroke="#e6c98a" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" opacity="0.3" />
          <path d={routeD} className="rf-route" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
        </g>
      )}

      {/* Country dots */}
      <g>
        {dots.map((d) => (
          <g key={d.key} className="rf-dot" data-state={d.state} transform={`translate(${d.x},${d.y})`}>
            <circle className="rf-halo" r={d.core * 2.6} />
            <circle className="rf-core" r={d.core} />
            <title>{d.th}</title>
          </g>
        ))}
      </g>

      {/* Top-3 labels (results step only) */}
      {showLabels && (
        <g className="rf-labels">
          {dots
            .filter((d) => d.state === "top")
            .map((d) => (
              <text
                key={`l${d.key}`}
                x={d.x + (d.x > W - 130 ? -10 : 10)}
                y={d.y - 8}
                textAnchor={d.x > W - 130 ? "end" : "start"}
                className="rf-label"
              >
                {d.th}
              </text>
            ))}
        </g>
      )}
    </svg>
  );
}
