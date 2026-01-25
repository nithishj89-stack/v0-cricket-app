'use client';

import React from "react";
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  type: 'circle' | 'star' | 'line';
}

interface CrackerAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function CrackerAnimation({ trigger, onComplete }: CrackerAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#00d84f', '#ffd700', '#ff3b30', '#00d84f', '#ffd700', '#ffffff', '#ff6b6b'];
    const types: ('circle' | 'star' | 'line')[] = ['circle', 'star', 'line'];
    const newParticles: Particle[] = [];
    const newBursts: { id: number; x: number; y: number }[] = [];

    // Create multiple burst points
    for (let b = 0; b < 5; b++) {
      const burstX = 20 + Math.random() * 60;
      const burstY = 20 + Math.random() * 60;
      newBursts.push({ id: b, x: burstX, y: burstY });

      // Create particles radiating from each burst
      for (let i = 0; i < 25; i++) {
        newParticles.push({
          id: b * 25 + i,
          x: burstX,
          y: burstY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 8,
          angle: (i / 25) * 360 + Math.random() * 20,
          velocity: 100 + Math.random() * 150,
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
    }

    setBursts(newBursts);
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      setBursts([]);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Burst flash effects */}
      {bursts.map(burst => (
        <div
          key={`burst-${burst.id}`}
          className="absolute burst-flash"
          style={{
            left: `${burst.x}%`,
            top: `${burst.y}%`,
          }}
        >
          <div className="w-32 h-32 rounded-full bg-primary/50 blur-xl" />
        </div>
      ))}

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute particle-fly"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            '--angle': `${particle.angle}deg`,
            '--velocity': `${particle.velocity}px`,
            '--delay': `${Math.random() * 0.3}s`,
          } as React.CSSProperties}
        >
          {particle.type === 'circle' && (
            <div
              className="rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
              }}
            />
          )}
          {particle.type === 'star' && (
            <svg width={particle.size * 2} height={particle.size * 2} viewBox="0 0 24 24">
              <path 
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={particle.color}
                style={{ filter: `drop-shadow(0 0 ${particle.size}px ${particle.color})` }}
              />
            </svg>
          )}
          {particle.type === 'line' && (
            <div
              className="rounded-full"
              style={{
                width: particle.size * 3,
                height: 3,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
                transform: `rotate(${particle.angle}deg)`
              }}
            />
          )}
        </div>
      ))}

      {/* Confetti streamers */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            '--fall-delay': `${Math.random() * 1}s`,
            '--fall-duration': `${2 + Math.random() * 2}s`,
            '--sway': `${(Math.random() - 0.5) * 100}px`,
          } as React.CSSProperties}
        >
          <div 
            className="w-2 h-6 rounded-sm"
            style={{ 
              backgroundColor: ['#00d84f', '#ffd700', '#ff3b30', '#ffffff'][Math.floor(Math.random() * 4)],
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes burstFlash {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes particleFly {
          0% {
            transform: rotate(var(--angle)) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle)) translateX(var(--velocity)) scale(0);
            opacity: 0;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--sway)) rotate(720deg);
            opacity: 0;
          }
        }

        .burst-flash {
          animation: burstFlash 0.6s ease-out forwards;
        }

        .particle-fly {
          animation: particleFly 1.5s ease-out forwards;
          animation-delay: var(--delay);
        }

        .confetti-fall {
          animation: confettiFall var(--fall-duration) ease-in forwards;
          animation-delay: var(--fall-delay);
        }
      `}</style>
    </div>
  );
}
