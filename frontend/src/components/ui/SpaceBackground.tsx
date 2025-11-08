"use client";

import { useEffect, useMemo, useState } from 'react';

// Unified background: stars + seven faint constellations + USC drifting blobs

interface Star {
  id: number;
  xPct: number; // 0..100
  yPct: number; // 0..100
  size: number;
  type: 'white' | 'green' | 'orange' | 'blue' | 'yellow';
  twinkleDur: string;
  twinkleDelay: string;
}

interface ShootingStar {
  id: number;
  x: string;
  y: string;
  type: 'green' | 'orange';
  animationDelay: string;
}

interface ConstellationLine {
  id: string;
  x1: number; // percent
  y1: number; // percent
  x2: number;
  y2: number;
  length: number; // percent of width
  angle: number; // degrees
  type: 'green' | 'orange';
  animDuration: string; // subtle twinkle duration
  animDelay: string; // desync
}

interface Particle {
  id: number;
  x: number; // px
  y: number; // px
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function createSessionRng() {
  // Session-stable RNG so layout doesn't jump on reloads during a session
  let seed = 0;
  try {
    const stored = window.sessionStorage.getItem('combinedbg.seed');
    if (stored) seed = parseInt(stored, 10) >>> 0;
    else {
      seed = Math.floor(Math.random() * 1e9) >>> 0;
      window.sessionStorage.setItem('combinedbg.seed', String(seed));
    }
  } catch {
    seed = Math.floor(Math.random() * 1e9) >>> 0;
  }
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export default function SpaceBackground({
  isDark = true,
  starCount = 150,
  enableShooting = true,
}: {
  isDark?: boolean;
  starCount?: number;
  enableShooting?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  // --- Aesthetic Controls ---
  const LINE_COLOR_GREEN = '129, 199, 132'; // A soft green
  const LINE_COLOR_ORANGE = '255, 183, 77'; // A soft orange
  const LINE_OPACITY_BASE = 0.16; // Base brightness of the line
  const LINE_OPACITY_TWINKLE_MIN = 0.5; // Brightness at the dimmest point of twinkle
  const LINE_OPACITY_TWINKLE_MAX = 1; // Brightness at the peak of the twinkle

  const rng = useMemo(() => (typeof window !== 'undefined' ? createSessionRng() : Math.random), []);

  // --- Stars (static layout, CSS twinkle) ---
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [constellationLines, setConstellationLines] = useState<ConstellationLine[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const typeWeights = { white: 0.6, green: 0.15, orange: 0.15, blue: 0.07, yellow: 0.03 };
    const total = typeWeights.white + typeWeights.green + typeWeights.orange + typeWeights.blue + typeWeights.yellow;

    const s: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const rType = rng() * total;
      let type: Star['type'] = 'white';
      const t1 = typeWeights.yellow;
      const t2 = t1 + typeWeights.blue;
      const t3 = t2 + typeWeights.orange;
      const t4 = t3 + typeWeights.green;
      if (rType < t1) type = 'yellow';
      else if (rType < t2) type = 'blue';
      else if (rType < t3) type = 'orange';
      else if (rType < t4) type = 'green';
      else type = 'white';

      const xPct = rng() * 100;
      const yPct = rng() * 100;
      s.push({
        id: i,
        xPct,
        yPct,
        size: rng() * 1.8 + 0.4,
        type,
        twinkleDur: reduceMotion ? '0s' : `${rng() * 6 + 4}s`,
        twinkleDelay: reduceMotion ? '0s' : `${rng() * 10}s`,
      });
    }
    setStars(s);

    // Build exactly up to 7 faint lines between nearest neighbors
    const buildConstellations = (starData: Star[]): ConstellationLine[] => {
      const lines: ConstellationLine[] = [];
      const k = 2;
      const maxDist = 18; // percent, more permissive for visibility
      const connectProb = 0.45; // 50% chance to connect nearest neighbors
      const maxLines = 15; // strict cap to avoid clutter

      for (const a of starData) {
        if (lines.length >= maxLines) break;
        const others = starData.filter(o => o.id !== a.id);
        const sorted = others
          .map(o => ({ o, dx: o.xPct - a.xPct, dy: o.yPct - a.yPct }))
          .map(({ o, dx, dy }) => ({ o, dist: Math.sqrt(dx * dx + dy * dy), dx, dy }))
          .sort((x, y) => x.dist - y.dist)
          .slice(0, k);
        for (const { o, dist, dx, dy } of sorted) {
          if (lines.length >= maxLines) break;
          if (dist <= maxDist && rng() < connectProb) {
            const id = a.id < o.id ? `${a.id}-${o.id}` : `${o.id}-${a.id}`;
            if (!lines.find(l => l.id === id)) {
              const angle = Math.atan2(dy, dx) * 180 / Math.PI;
              lines.push({
                id,
                x1: a.xPct,
                y1: a.yPct,
                x2: o.xPct,
                y2: o.yPct,
                length: dist,
                angle,
                type: (a.id + o.id) % 2 === 0 ? 'green' : 'orange',
                animDuration: `${8 + rng() * 6}s`,
                animDelay: `${rng() * 8}s`,
              });
            }
          }
        }
      }
      return lines;
    };

    const built = buildConstellations(s);
    setConstellationLines(built);

    // Shooting stars (optional)
    const makeShooters = () => {
      if (!enableShooting || reduceMotion) {
        setShootingStars([]);
        return;
      }
      const arr: ShootingStar[] = [];
      const count = Math.floor(rng() * 4) + 4; // 4-7
      for (let i = 0; i < count; i++) {
        arr.push({
          id: i,
          x: `${rng() * 100}%`,
          y: `${rng() * 100}%`,
          type: rng() > 0.5 ? 'green' : 'orange',
          animationDelay: `${rng() * 8}s`,
        });
      }
      setShootingStars(arr);
    };

    makeShooters();
    let interval: number | null = null;
    if (enableShooting && !reduceMotion) {
      interval = window.setInterval(makeShooters, 8000); // more frequent
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [starCount, enableShooting, reduceMotion, rng]);

  // --- USC blob particles (animated drift) ---
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    if (!isDark || typeof window === 'undefined') return;

    const colors = ['#4CAF50', '#FF9800', '#4285f4', '#81C784', '#FFB74D'];
    const gen = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cols = 3, rows = 3;
      const cellW = w / cols, cellH = h / rows;
      const out: Particle[] = [];
      for (let i = 0; i < 8; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const baseX = col * cellW + cellW / 2;
        const baseY = row * cellH + cellH / 2;
        const jitterX = (Math.random() - 0.5) * cellW * 0.8;
        const jitterY = (Math.random() - 0.5) * cellH * 0.8;
        out.push({
          id: i,
          x: Math.max(50, Math.min(w - 50, baseX + jitterX)),
          y: Math.max(50, Math.min(h - 50, baseY + jitterY)),
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 60 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setParticles(out);
    };

    gen();
    const onResize = () => gen();
    window.addEventListener('resize', onResize);

    if (reduceMotion) {
      // Static when reduced motion is preferred
      return () => window.removeEventListener('resize', onResize);
    }

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2, cy = h / 2;
      setParticles(prev => prev.map(p => {
        let x = p.x + p.vx;
        let y = p.y + p.vy;
        let vx = p.vx;
        let vy = p.vy;
        const k = 0.0003; // ultra-subtle centering
        vx -= (p.x - cx) * k;
        vy -= (p.y - cy) * k;
        if (x <= 0) { x = 0; vx = Math.abs(vx); }
        else if (x >= w) { x = w; vx = -Math.abs(vx); }
        if (y <= 0) { y = 0; vy = Math.abs(vy); }
        else if (y >= h) { y = h; vy = -Math.abs(vy); }
        return { ...p, x, y, vx, vy };
      }));
    };

    const interval = window.setInterval(tick, 80);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('resize', onResize);
    };
  }, [isDark, reduceMotion]);

  return (
    <div className="starfield-container">
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-70" style={{ zIndex: -1 }} />
      )}

      {isDark && (
        <style jsx global>{`
          @keyframes starLineTwinkle { 
            0%, 100% { opacity: ${LINE_OPACITY_TWINKLE_MIN}; } 
            50% { opacity: ${LINE_OPACITY_TWINKLE_MAX}; } 
          }
        `}</style>
      )}

      {/* Blob layer first (below stars/lines). SVG for gradients + subtle animations */}
      {isDark && (
        <svg className="absolute inset-0" width="100%" height="100%" style={{ zIndex: 0, pointerEvents: 'none' }}>
          <defs>
            <radialGradient id="uscGreenGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="uscOrangeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF9800" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="googleBlueGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4285f4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4285f4" stopOpacity="0" />
            </radialGradient>
          </defs>
          {particles.map(p => (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.size}
                fill={`url(#${p.color === '#4CAF50' ? 'uscGreenGradient' : p.color === '#FF9800' ? 'uscOrangeGradient' : 'googleBlueGradient'})`}
                opacity={p.opacity}
              >
                {!reduceMotion && (
                  <>
                    <animate attributeName="r" values={`${p.size};${p.size * 1.2};${p.size}`} dur="6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values={`${p.opacity};${p.opacity * 1.5};${p.opacity}`} dur="4s" repeatCount="indefinite" />
                  </>
                )}
              </circle>
            </g>
          ))}
        </svg>
      )}

      {/* Constellation lines (subtle, crisp) */}
      {isDark && constellationLines.map(line => (
        <div
          key={line.id}
          data-starline="1"
          style={{
            position: 'absolute',
            zIndex: 1,
            left: `${line.x1}%`,
            top: `${line.y1}%`,
            width: `${line.length}%`,
            height: '1px',
            backgroundColor: line.type === 'green' ? `rgba(${LINE_COLOR_GREEN}, ${LINE_OPACITY_BASE})` : `rgba(${LINE_COLOR_ORANGE}, ${LINE_OPACITY_BASE})`,
            transform: `rotate(${line.angle}deg)`,
            transformOrigin: '0 50%',
            boxShadow: 'none',
            filter: 'none',
            pointerEvents: 'none',
            animation: reduceMotion ? 'none' : `starLineTwinkle ${line.animDuration} ease-in-out infinite`,
            animationDelay: line.animDelay,
          }}
        />
      ))}

      {/* Stars above lines */}
      {isDark && stars.map(star => (
        <div
          key={`star-${star.id}`}
          className={`star star-${star.type}`}
          style={{
            position: 'absolute',
            zIndex: 2,
            top: `${star.yPct}%`,
            left: `${star.xPct}%`,
            width: star.size,
            height: star.size,
            animationDuration: star.twinkleDur,
            animationDelay: star.twinkleDelay,
          }}
        />
      ))}

      {/* Optional shooting stars (kept off by default) */}
      {isDark && enableShooting && shootingStars.map(s => (
        <div
          key={`shooting-${s.id}`}
          className={`shooting-star shooting-star-${s.type}`}
          style={{ top: s.y, left: s.x, animationDelay: s.animationDelay }}
        />
      ))}
    </div>
  );
      <style jsx global>{`
        @keyframes starLineTwinkle { 
          0%, 100% { opacity: ${LINE_OPACITY_TWINKLE_MIN}; } 
          50% { opacity: ${LINE_OPACITY_TWINKLE_MAX}; } 
        }
      `}</style>

      {/* Blob layer first (below stars/lines). SVG for gradients + subtle animations */}
      <svg className="absolute inset-0" width="100%" height="100%" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="uscGreenGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="uscOrangeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9800" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="googleBlueGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4285f4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4285f4" stopOpacity="0" />
          </radialGradient>
        </defs>
        {particles.map(p => (
          <g key={p.id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill={`url(#${p.color === '#4CAF50' ? 'uscGreenGradient' : p.color === '#FF9800' ? 'uscOrangeGradient' : 'googleBlueGradient'})`}
              opacity={p.opacity}
            >
              {!reduceMotion && (
                <>
                  <animate attributeName="r" values={`${p.size};${p.size * 1.2};${p.size}`} dur="6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values={`${p.opacity};${p.opacity * 1.5};${p.opacity}`} dur="4s" repeatCount="indefinite" />
                </>
              )}
            </circle>
          </g>
        ))}
      </svg>

      {/* Constellation lines (subtle, crisp) */}
      {constellationLines.map(line => (
        <div
          key={line.id}
          data-starline="1"
          style={{
            position: 'absolute',
            zIndex: 1,
            left: `${line.x1}%`,
            top: `${line.y1}%`,
            width: `${line.length}%`,
            height: '1px',
            backgroundColor: line.type === 'green' ? `rgba(${LINE_COLOR_GREEN}, ${LINE_OPACITY_BASE})` : `rgba(${LINE_COLOR_ORANGE}, ${LINE_OPACITY_BASE})`,
            transform: `rotate(${line.angle}deg)`,
            transformOrigin: '0 50%',
            boxShadow: 'none',
            filter: 'none',
            pointerEvents: 'none',
            animation: reduceMotion ? 'none' : `starLineTwinkle ${line.animDuration} ease-in-out infinite`,
            animationDelay: line.animDelay,
          }}
        />
      ))}

      {/* Stars above lines */}
      {stars.map(star => (
        <div
          key={`star-${star.id}`}
          className={`star star-${star.type}`}
          style={{
            position: 'absolute',
            zIndex: 2,
            top: `${star.yPct}%`,
            left: `${star.xPct}%`,
            width: star.size,
            height: star.size,
            animationDuration: star.twinkleDur,
            animationDelay: star.twinkleDelay,
          }}
        />
      ))}

      {/* Optional shooting stars (kept off by default) */}
      {enableShooting && shootingStars.map(s => (
        <div
          key={`shooting-${s.id}`}
          className={`shooting-star shooting-star-${s.type}`}
          style={{ top: s.y, left: s.x, animationDelay: s.animationDelay }}
        />
      ))}
    </div>
  );
}
