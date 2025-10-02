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
      
      // Generate floating abstract particles
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 60 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    
    // Animate particles
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        // Bounce off edges
        vx: particle.x <= 0 || particle.x >= window.innerWidth ? -particle.vx : particle.vx,
        vy: particle.y <= 0 || particle.y >= window.innerHeight ? -particle.vy : particle.vy,
      })));
    };

    const intervalId = setInterval(animateParticles, 50);
    
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
                const distance = Math.sqrt(
                  Math.pow(particle.x - otherParticle.x, 2) + 
                  Math.pow(particle.y - otherParticle.y, 2)
                );
                
                // Only draw lines between nearby particles
                if (distance < 300) {
                  return (
                    <line
                      key={`line-${particle.id}-${otherParticle.id}`}
                      x1={particle.x}
                      y1={particle.y}
                      x2={otherParticle.x}
                      y2={otherParticle.y}
                      stroke={particle.color}
                      strokeWidth="1"
                      opacity={Math.max(0.1, (300 - distance) / 300 * 0.3)}
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