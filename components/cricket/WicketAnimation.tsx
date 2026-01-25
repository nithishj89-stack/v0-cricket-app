'use client';

import React from "react"

import { useEffect, useState } from 'react';

interface WicketAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export default function WicketAnimation({ show, onComplete }: WicketAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [stumps, setStumps] = useState<{ id: number; rotation: number; x: number }[]>([]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Create flying stumps
      setStumps([
        { id: 1, rotation: -45, x: -60 },
        { id: 2, rotation: 15, x: 0 },
        { id: 3, rotation: 45, x: 60 }
      ]);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setStumps([]);
        onComplete?.();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
      {/* Dark overlay flash */}
      <div className="absolute inset-0 bg-destructive/20 animate-pulse" />
      
      {/* Wicket text */}
      <div className="relative z-10 text-center wicket-popup">
        <div className="text-7xl font-black text-destructive mb-4 tracking-wider animate-bounce">
          WICKET!
        </div>
        <div className="text-3xl text-foreground font-bold">OUT!</div>
        
        {/* Flying stumps */}
        <div className="relative h-32 mt-8">
          {stumps.map(stump => (
            <div
              key={stump.id}
              className="absolute left-1/2 flying-stump"
              style={{
                '--rotation': `${stump.rotation}deg`,
                '--x': `${stump.x}px`,
              } as React.CSSProperties}
            >
              <div className="w-2 h-20 bg-secondary rounded-sm shadow-lg" />
            </div>
          ))}
        </div>
        
        {/* Bails flying */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
          <div className="flying-bail-1 w-8 h-1 bg-secondary rounded-full" />
          <div className="flying-bail-2 w-8 h-1 bg-secondary rounded-full mt-2" />
        </div>
      </div>

      <style>{`
        @keyframes wicketPopup {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          30% {
            transform: scale(1.2) rotate(5deg);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotate(0deg);
          }
          100% {
            transform: scale(0.8) rotate(-5deg);
            opacity: 0;
          }
        }

        @keyframes flyStump {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(var(--x)) translateY(-150px) rotate(var(--rotation));
            opacity: 0;
          }
        }

        @keyframes flyBail1 {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-80px) translateY(-120px) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes flyBail2 {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(80px) translateY(-100px) rotate(-540deg);
            opacity: 0;
          }
        }

        .wicket-popup {
          animation: wicketPopup 2s ease-out forwards;
        }

        .flying-stump {
          animation: flyStump 1s ease-out forwards;
          animation-delay: 0.2s;
        }

        .flying-bail-1 {
          animation: flyBail1 1.2s ease-out forwards;
          animation-delay: 0.1s;
        }

        .flying-bail-2 {
          animation: flyBail2 1.2s ease-out forwards;
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  );
}
