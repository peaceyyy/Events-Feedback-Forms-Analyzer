"use client";

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

const USCAbstractBackground = ({ isDark = true }: { isDark?: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      '#4CAF50',  // USC Green
      '#FF9800',  // USC Orange
      '#4285f4',  // Google Blue
      '#81C784',  // Light Green
      '#FFB74D',  // Light Orange
    ];

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Distribute particles in a grid-like pattern with jitter for natural look
      const cols = 3;
      const rows = 3;
      const cellW = w / cols;
      const cellH = h / rows;
      
      for (let i = 0; i < 8; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        // Place in cell center with random offset (±40% of cell size)
        const baseX = col * cellW + cellW / 2;
        const baseY = row * cellH + cellH / 2;
        const jitterX = (Math.random() - 0.5) * cellW * 0.8;
        const jitterY = (Math.random() - 0.5) * cellH * 0.8;
        
        newParticles.push({
          id: i,
          x: Math.max(50, Math.min(w - 50, baseX + jitterX)),
          y: Math.max(50, Math.min(h - 50, baseY + jitterY)),
          vx: (Math.random() - 0.5) * 0.2,  // Slower drift
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 60 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    
    // Animate particles with proper edge handling and gentle centering force
    const animateParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const centerX = w / 2;
      const centerY = h / 2;
      
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx;
        let newVy = particle.vy;

        // Ultra-subtle centering force to prevent long-term drift (barely perceptible)
        const distFromCenterX = particle.x - centerX;
        const distFromCenterY = particle.y - centerY;
        const centeringStrength = 0.0003;  // 7x weaker than before
        newVx -= distFromCenterX * centeringStrength;
        newVy -= distFromCenterY * centeringStrength;

        // Bounce and clamp to prevent edge-sticking
        if (newX <= 0) {
          newX = 0;
          newVx = Math.abs(newVx);
        } else if (newX >= w) {
          newX = w;
          newVx = -Math.abs(newVx);
        }

        if (newY <= 0) {
          newY = 0;
          newVy = Math.abs(newVy);
        } else if (newY >= h) {
          newY = h;
          newVy = -Math.abs(newVy);
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      }));
    };

    const intervalId = setInterval(animateParticles, 80);  // Slower update rate for smoother ambient feel
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', generateParticles);
    };
  }, []);

  if (!isDark) return null; // Only show in dark mode to keep light mode clean

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          {/* Gradient definitions for USC colors */}
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
        
        {particles.map((particle) => (
          <g key={particle.id}>
            {/* Main particle blob */}
            <circle
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill={`url(#${
                particle.color === '#4CAF50' ? 'uscGreenGradient' :
                particle.color === '#FF9800' ? 'uscOrangeGradient' : 'googleBlueGradient'
              })`}
              opacity={particle.opacity}
            >
              <animate
                attributeName="r"
                values={`${particle.size};${particle.size * 1.2};${particle.size}`}
                dur="6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={`${particle.opacity};${particle.opacity * 1.5};${particle.opacity}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Subtle connecting lines between particles */}
            {particles
              .filter(p => p.id > particle.id)
              .map(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Scale threshold with viewport size for better distribution
                const threshold = Math.min(window.innerWidth, window.innerHeight) * 0.4;
                
                if (distance < threshold) {
                  return (
                    <line
                      key={`line-${particle.id}-${otherParticle.id}`}
                      x1={particle.x}
                      y1={particle.y}
                      x2={otherParticle.x}
                      y2={otherParticle.y}
                      stroke={particle.color}
                      strokeWidth="1"
                      opacity={Math.max(0.05, (threshold - distance) / threshold * 0.25)}
                    />
                  );
                }
                return null;
              })}
          </g>
        ))}
                
      </svg>
    </div>
  );
};

export default USCAbstractBackground;