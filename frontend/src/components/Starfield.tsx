"use client";

import { useState, useEffect } from 'react';

interface Star {
  id: number;
  x: string;
  y: string;
  size: number;
  animationDuration: string;
  animationDelay: string;
  type: 'white' | 'green' | 'orange' | 'blue' | 'yellow';
  numX: number; // Numeric position for constellation calculations
  numY: number;
}

interface ShootingStar {
  id: number;
  x: string;
  y: string;
  type: 'green' | 'orange';
  animationDelay: string;
}

interface ConstellationLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  angle: number;
  type: 'green' | 'orange';
  animationDelay: string;
}

const Starfield = ({ starCount = 150 }: { starCount?: number }) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [constellationLines, setConstellationLines] = useState<ConstellationLine[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const starTypes: Array<'white' | 'green' | 'orange' | 'blue' | 'yellow'> = 
        ['white', 'green', 'orange', 'blue', 'yellow'];
      
      // Weight distribution for USC colors
      const typeWeights = {
        white: 0.6,    // 60% white stars (classic starfield)
        green: 0.15,   // 15% USC green
        orange: 0.15,  // 15% USC orange  
        blue: 0.07,    // 7% Google blue
        yellow: 0.03   // 3% Google yellow (subtle accent)
      };
      
      for (let i = 0; i < starCount; i++) {
        const rand = Math.random();
        let type: Star['type'] = 'white';
        
        if (rand < typeWeights.yellow) type = 'yellow';
        else if (rand < typeWeights.yellow + typeWeights.blue) type = 'blue';
        else if (rand < typeWeights.yellow + typeWeights.blue + typeWeights.orange) type = 'orange';
        else if (rand < typeWeights.yellow + typeWeights.blue + typeWeights.orange + typeWeights.green) type = 'green';
        
        const numX = Math.random() * 100;
        const numY = Math.random() * 100;
        
        newStars.push({
          id: i,
          x: `${numX}%`,
          y: `${numY}%`,
          numX,
          numY,
          size: Math.random() * 1.8 + 0.4, // Star size between 0.4px and 2.2px
          animationDuration: `${Math.random() * 6 + 4}s`, // Duration between 4s and 10s
          animationDelay: `${Math.random() * 10}s`,
          type
        });
      }
      return newStars;
    };

    const generateConstellationLines = (stars: Star[]) => {
      const lines: ConstellationLine[] = [];
      const maxLines = Math.floor(starCount / 20); // More lines for better constellation effect
      
      for (let i = 0; i < maxLines; i++) {
        const star1 = stars[Math.floor(Math.random() * stars.length)];
        const star2 = stars[Math.floor(Math.random() * stars.length)];
        
        if (star1.id !== star2.id) {
          const distance = Math.sqrt(
            Math.pow(star2.numX - star1.numX, 2) + Math.pow(star2.numY - star1.numY, 2)
          );
          
          // Only connect nearby stars (max 20% of screen distance for tighter constellations)
          if (distance < 20) {
            const angle = Math.atan2(star2.numY - star1.numY, star2.numX - star1.numX) * 180 / Math.PI;
            
            lines.push({
              id: i,
              x1: star1.numX,
              y1: star1.numY,
              x2: star2.numX,
              y2: star2.numY,
              length: distance,
              angle,
              type: Math.random() > 0.4 ? 'green' : 'orange', // Favor green slightly
              animationDelay: `${Math.random() * 6 + 2}s`,
            });
          }
        }
      }
      return lines;
    };

    const newStars = generateStars();
    setStars(newStars);
    setConstellationLines(generateConstellationLines(newStars));

    const generateShootingStars = () => {
      const newShootingStars: ShootingStar[] = [];
      // Generate 3-5 shooting stars with USC colors
      const count = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < count; i++) {
        newShootingStars.push({
          id: i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          type: Math.random() > 0.5 ? 'green' : 'orange',
          animationDelay: `${Math.random() * 8}s`,
        });
      }
      setShootingStars(newShootingStars);
    };

    generateStars();
    generateShootingStars();

    // Regenerate shooting stars periodically for dynamic effect
    const shootingStarInterval = setInterval(generateShootingStars, 12000);
    
    // Regenerate constellation lines periodically for evolving patterns
    const constellationInterval = setInterval(() => {
      setConstellationLines(generateConstellationLines(newStars));
    }, 25000);
    
    return () => {
      clearInterval(shootingStarInterval);
      clearInterval(constellationInterval);
    };
  }, [starCount]);

  return (
    <div className="starfield-container">
      {/* Constellation Lines - Rendered first so stars appear on top */}
      {constellationLines.map((line) => (
        <div
          key={`constellation-${line.id}`}
          className={`constellation-line constellation-line-${line.type}`}
          style={{
            left: `${line.x1}%`,
            top: `${line.y1}%`,
            width: `${line.length}%`,
            transform: `rotate(${line.angle}deg)`,
            transformOrigin: '0 50%',
            animationDelay: line.animationDelay,
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
            animationDelay: star.animationDelay 
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