'use client';

import React from "react"

import { useEffect, useState } from 'react';

interface BoundaryAnimationProps {
  type: 'four' | 'six' | null;
  onComplete?: () => void;
}

export default function BoundaryAnimation({ type, onComplete }: BoundaryAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (!isVisible || !type) return null;

  const isSix = type === 'six';

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40 overflow-hidden">
      {/* Background flash - removed fog effect */}

      {/* Main text */}
      <div className={`relative z-10 text-center ${isSix ? 'six-text' : 'four-text'}`}>
        <div
          className={`text-8xl font-black tracking-widest mb-4 ${isSix ? 'text-primary' : 'text-secondary'
            }`}
          style={{ textShadow: `0 0 40px ${isSix ? '#00d84f' : '#ffd700'}` }}
        >
          {isSix ? 'SIX!' : 'FOUR!'}
        </div>

        {/* Subtitle */}
        <div className="text-2xl text-foreground font-bold">
          {isSix ? 'OUT OF THE PARK!' : 'BOUNDARY!'}
        </div>

        {/* Cricket ball animation */}
        <div className={`absolute ${isSix ? 'flying-ball-six' : 'flying-ball-four'}`}>
          <div className="w-8 h-8 rounded-full bg-destructive shadow-lg flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-foreground/30" />
          </div>
        </div>
      </div>

      {/* Sparkles for six */}
      {isSix && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 0.5}s`,
                '--x': `${(Math.random() - 0.5) * 200}px`,
                '--y': `${(Math.random() - 0.5) * 200}px`,
              } as React.CSSProperties}
            >
              <div
                className="w-2 h-2 rounded-full bg-primary"
                style={{ boxShadow: '0 0 10px #00d84f' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Ground sparks for four */}
      {!isSix && (
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute ground-spark"
              style={{
                '--angle': `${(i / 12) * 360}deg`,
                '--distance': `${80 + Math.random() * 40}px`,
              } as React.CSSProperties}
            >
              <div
                className="w-3 h-3 rounded-full bg-secondary"
                style={{ boxShadow: '0 0 8px #ffd700' }}
              />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes flashBg {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes sixText {
          0% {
            transform: scale(0) rotate(-15deg);
            opacity: 0;
          }
          30% {
            transform: scale(1.3) rotate(5deg);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotate(0deg);
          }
          100% {
            transform: scale(0.8) translateY(-50px);
            opacity: 0;
          }
        }

        @keyframes fourText {
          0% {
            transform: scale(0) translateX(-50px);
            opacity: 0;
          }
          30% {
            transform: scale(1.2) translateX(20px);
            opacity: 1;
          }
          50% {
            transform: scale(1) translateX(0);
          }
          100% {
            transform: scale(0.8) translateX(50px);
            opacity: 0;
          }
        }

        @keyframes flyBallSix {
          0% {
            transform: translateY(100px) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-150px) scale(1.5);
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes flyBallFour {
          0% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(200px) translateY(50px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(0);
            opacity: 0;
          }
        }

        @keyframes groundSpark {
          0% {
            transform: rotate(var(--angle)) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle)) translateX(var(--distance)) scale(0);
            opacity: 0;
          }
        }

        .six-text {
          animation: sixText 2.5s ease-out forwards;
        }

        .four-text {
          animation: fourText 2.5s ease-out forwards;
        }

        .flying-ball-six {
          animation: flyBallSix 1.5s ease-out forwards;
          animation-delay: 0.2s;
        }

        .flying-ball-four {
          animation: flyBallFour 1.5s ease-out forwards;
          animation-delay: 0.2s;
        }

        .sparkle {
          animation: sparkle 1.5s ease-out forwards;
          animation-delay: var(--delay);
        }

        .ground-spark {
          animation: groundSpark 1s ease-out forwards;
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}
