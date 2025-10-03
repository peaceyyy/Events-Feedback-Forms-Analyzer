"use client";

import { useState, useEffect, useRef } from 'react';

interface Star {
  id: number;
  x: string;
  y: string;
  numX: number; // Numeric position (0-100) for constellation calculations
  numY: number;
  size: number;
  animationDuration: string;
  animationDelay: string;
  type: 'white' | 'green' | 'orange' | 'blue' | 'yellow';
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
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number; // in percent of width
  angle: number; // degrees
  type: 'green' | 'orange';
  animDuration: string; // subtle twinkle duration
  animDelay: string; // desync
}

const Starfield = ({ starCount = 150 }: { starCount?: number }) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [constellationLines, setConstellationLines] = useState<ConstellationLine[]>([]);

  useEffect(() => {
    // Debug toggles (no SSR impact since this is a client component)
    const debug = (typeof window !== 'undefined' && (window as any).__STARFIELD_DEBUG__) || {};
    const enableShooting: boolean =
      debug.enableShooting !== undefined ? !!debug.enableShooting : true;

    // Respect user motion preferences; reduce or disable animation if requested
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Deterministic RNG for session-stable layouts (reduces visual jumps on remount)
    let seed = 0;
    try {
      const stored = typeof window !== 'undefined' ? window.sessionStorage.getItem('starfield.seed') : null;
      if (stored) {
        seed = parseInt(stored, 10) >>> 0;
      } else {
        seed = Math.floor(Math.random() * 1e9) >>> 0;
        window.sessionStorage.setItem('starfield.seed', String(seed));
      }
    } catch {
      seed = Math.floor(Math.random() * 1e9) >>> 0; // Fallback if sessionStorage is unavailable
    }
    const rng = (() => {
      // LCG for cheap determinism; sufficient for layout randomness
      let s = seed >>> 0;
      return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 0x100000000;
      };
    })();

    const generateStars = () => {
      const newStars: Star[] = [];
      const typeWeights = {
        white: 0.6,
        green: 0.15,
        orange: 0.15,
        blue: 0.07,
        yellow: 0.03,
      };
      const total = typeWeights.white + typeWeights.green + typeWeights.orange + typeWeights.blue + typeWeights.yellow;

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

        const numX = rng() * 100;
        const numY = rng() * 100;
        newStars.push({
          id: i,
          x: `${numX}%`,
          y: `${numY}%`,
          numX,
          numY,
          size: rng() * 1.8 + 0.4,
          // If reduced motion is requested, disable twinkle via zero durations
          animationDuration: reduceMotion ? '0s' : `${rng() * 6 + 4}s`,
          animationDelay: reduceMotion ? '0s' : `${rng() * 10}s`,
          type,
        });
      }
      return newStars;
    };

    const generateShootingStars = () => {
      if (!enableShooting || reduceMotion) {
        setShootingStars([]);
        return;
      }
      const newShootingStars: ShootingStar[] = [];
      const count = Math.floor(rng() * 3) + 3; // 3-5
      for (let i = 0; i < count; i++) {
        newShootingStars.push({
          id: i,
          x: `${rng() * 100}%`,
          y: `${rng() * 100}%`,
          type: rng() > 0.5 ? 'green' : 'orange',
          animationDelay: reduceMotion ? '0s' : `${rng() * 8}s`,
        });
      }
      setShootingStars(newShootingStars);
    };

    // Build subtle, static constellation lines between nearest neighbors
    const buildConstellationLines = (starsInput: Star[]): ConstellationLine[] => {
      const lines: ConstellationLine[] = [];
      const k = 1; // fewer connections per star
      const maxDist = 16; // shorter distance yields sparser graph
      const connectProb = 0.45; // not every star will connect
      const maxLines = 7; // strict global cap

      for (const s of starsInput) {
        if (lines.length >= maxLines) break;
        const others = starsInput.filter(o => o.id !== s.id);
        const sorted = others
          .map(o => ({
            o,
            dx: o.numX - s.numX,
            dy: o.numY - s.numY,
          }))
          .map(({ o, dx, dy }) => ({ o, dist: Math.sqrt(dx * dx + dy * dy), dx, dy }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, k);

        for (const { o, dist, dx, dy } of sorted) {
          if (lines.length >= maxLines) break;
          if (dist <= maxDist && rng() < connectProb) {
            // Avoid duplicate lines by ordering ids
            const id = s.id < o.id ? `${s.id}-${o.id}` : `${o.id}-${s.id}`;
            if (!lines.find(l => l.id === id)) {
              const angle = Math.atan2(dy, dx) * 180 / Math.PI;
              lines.push({
                id,
                x1: s.numX,
                y1: s.numY,
                x2: o.numX,
                y2: o.numY,
                length: dist,
                angle,
                type: (s.id + o.id) % 2 === 0 ? 'green' : 'orange', // deterministic color
                animDuration: `${8 + rng() * 6}s`,
                animDelay: `${rng() * 8}s`,
              });
            }
          }
        }
      }
      return lines;
    };

    // Initial generation
    const initialStars = generateStars();
    setStars(initialStars);
    const built = buildConstellationLines(initialStars);
    setConstellationLines(built);
    if (typeof window !== 'undefined' && (window as any).console) {
      // Debug aid: verify we never exceed the cap visually
      console.debug('[Starfield] constellation lines:', built.length);
    }
    generateShootingStars();

    // Shooting star regeneration timer
    let shootingStarInterval: number | null = null;
    if (enableShooting && !reduceMotion) {
      shootingStarInterval = window.setInterval(generateShootingStars, 12000);
    }

    return () => {
      if (shootingStarInterval) window.clearInterval(shootingStarInterval);
    };
  }, [starCount]);

  return (
    <div className="starfield-container">
      <style jsx global>{`
        @keyframes starLineTwinkle {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.22; }
        }
      `}</style>
      {/* Constellation lines between stars (subtle, static) */}
      {constellationLines.map((line) => (
        <div
          key={`constellation-${line.id}`}
          data-starline="1"
          style={{
            position: 'absolute',
            left: `${line.x1}%`,
            top: `${line.y1}%`,
            width: `${line.length}%`,
            height: '1px', // crisp, thin line
            backgroundColor:
              line.type === 'green'
                ? 'rgba(129, 199, 132, 0.16)'
                : 'rgba(255, 183, 77, 0.16)',
            transform: `rotate(${line.angle}deg)`,
            transformOrigin: '0 50%',
            // override global CSS effects for subtler look
            boxShadow: 'none',
            filter: 'none',
            pointerEvents: 'none',
            animation: `starLineTwinkle ${line.animDuration} ease-in-out infinite`,
            animationDelay: line.animDelay,
          }}
        />
      ))}

      {/* Regular twinkling stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className={`star star-${star.type}`}
          style={{
            top: star.y,
            left: star.x,
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
          }}
        />
      ))}

      {/* Shooting stars with USC colors */}
      {shootingStars.map((shootingStar) => (
        <div
          key={`shooting-${shootingStar.id}`}
          className={`shooting-star shooting-star-${shootingStar.type}`}
          style={{
            top: shootingStar.y,
            left: shootingStar.x,
            animationDelay: shootingStar.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
