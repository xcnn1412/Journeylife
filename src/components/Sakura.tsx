"use client";
import { useMemo } from "react";

function Petal({ size = 16, hue = "soft" }: { size?: number; hue?: "soft" | "blush" | "white" }) {
  const grad = {
    soft:  ["#ffe0ec", "#ffb6cf", "#f48fb1"],
    blush: ["#fff0f5", "#ffd0e0", "#f5a3c0"],
    white: ["#ffffff", "#fff5f8", "#ffe5ee"],
  }[hue];
  const id = `g-${hue}-${size}`;

  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor={grad[0]} />
          <stop offset="55%" stopColor={grad[1]} />
          <stop offset="100%" stopColor={grad[2]} />
        </radialGradient>
        <radialGradient id={`${id}-c`} cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#fff8d4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff8d4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g>
        {[0, 72, 144, 216, 288].map(angle => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              d="M 0 0
                 C -10 -8, -16 -22, -8 -38
                 C -4 -42, -2 -44, 0 -46
                 C 2 -44, 4 -42, 8 -38
                 C 16 -22, 10 -8, 0 0 Z
                 M 0 -46
                 C -2 -44, -2 -42, 0 -41
                 C 2 -42, 2 -44, 0 -46 Z"
              fill={`url(#${id})`}
              stroke="rgba(244,143,177,.35)"
              strokeWidth="0.6"
            />
            <path d="M 0 -2 Q -2 -18, 0 -38" stroke="rgba(255,255,255,.55)" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          </g>
        ))}
        <circle r="6" fill={`url(#${id}-c)`} />
        <circle r="2" fill="#f5a3c0" opacity="0.6" />
        {[0, 72, 144, 216, 288].map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="0" x2="0" y2="-5" stroke="#e893b0" strokeWidth="0.5" strokeLinecap="round" />
            <circle cx="0" cy="-5.5" r="0.7" fill="#fff5d0" />
          </g>
        ))}
      </g>
    </svg>
  );
}

interface SakuraProps { count?: number; }
export function Sakura({ count = 38 }: SakuraProps) {
  const petals = useMemo(() => Array.from({ length: count }).map((_, i) => {
    const r = (n: number) => Math.sin(i * 9.13 + n) * 0.5 + 0.5;
    return {
      id: i,
      left: r(1) * 100,
      delay: -r(2) * 22,
      duration: 14 + r(3) * 14,
      size: 14 + r(4) * 18,
      sway: 50 + r(5) * 110,
      swayDur: 4 + r(6) * 5,
      spinDur: 6 + r(7) * 8,
      hue: (["soft", "blush", "white"] as const)[i % 3],
      tilt: r(8) * 360,
      opacity: 0.7 + r(9) * 0.3,
      delaySway: r(2) * 5,
    };
  }), [count]);

  return (
    <div className="sakura-layer" aria-hidden>
      {petals.map(p => (
        <div key={p.id} className="petal-fall" style={{
          left: `${p.left}%`,
          animationDelay: `${p.delay}s`,
          ['--dur' as string]: `${p.duration}s`,
        } as React.CSSProperties}>
          <div className="petal-sway" style={{
            ['--sway' as string]: `${p.sway}px`,
            ['--swayDur' as string]: `${p.swayDur}s`,
            animationDelay: `${p.delaySway}s`,
          } as React.CSSProperties}>
            <div className="petal-spin" style={{
              ['--spinDur' as string]: `${p.spinDur}s`,
              opacity: p.opacity,
              filter: "drop-shadow(0 2px 4px rgba(244,143,177,.25))",
              transform: `rotate(${p.tilt}deg)`,
            } as React.CSSProperties}>
              <Petal size={p.size} hue={p.hue} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
