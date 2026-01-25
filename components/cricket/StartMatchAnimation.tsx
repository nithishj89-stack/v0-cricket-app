'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StartMatchAnimationProps {
  show: boolean;
  teamAName: string;
  teamBName: string;
  onStart: () => void;
}

export default function StartMatchAnimation({
  show,
  teamAName,
  teamBName,
  onStart
}: StartMatchAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (show && !hasStarted) {
      setIsAnimating(true);
    }
  }, [show, hasStarted]);

  const handleStartClick = () => {
    setHasStarted(true);
    // Trigger final animation
    setTimeout(() => {
      onStart();
    }, 1000);
  };

  if (!show) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-500 ${
      isAnimating ? 'bg-black/70' : 'bg-black/0'
    } backdrop-blur-sm`}>
      <div className={`space-y-8 transform transition-all duration-1000 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}>
        {/* Team vs Team */}
        <div className="text-center space-y-4">
          <div className={`text-4xl font-bold text-primary transform transition-all duration-1000 ${
            isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-32 opacity-0'
          }`}>
            {teamAName}
          </div>

          <div className="text-3xl font-bold text-secondary animate-pulse">VS</div>

          <div className={`text-4xl font-bold text-accent transform transition-all duration-1000 ${
            isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'
          }`}>
            {teamBName}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleStartClick}
            disabled={hasStarted}
            className={`
              bg-gradient-to-r from-primary to-secondary text-background
              hover:from-primary/90 hover:to-secondary/90
              font-bold text-xl px-12 py-8 rounded-lg
              transform transition-all duration-300
              ${hasStarted ? 'scale-95 opacity-50' : 'hover:scale-110 active:scale-95'}
              animate-pulse
            `}
          >
            {hasStarted ? 'Starting...' : 'START MATCH'}
          </Button>
        </div>

        {/* Loading Indicator */}
        {hasStarted && (
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-bounce w-3 h-3 bg-primary rounded-full" style={{ animationDelay: '0s' }} />
            <div className="animate-bounce w-3 h-3 bg-secondary rounded-full" style={{ animationDelay: '0.1s' }} />
            <div className="animate-bounce w-3 h-3 bg-accent rounded-full" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInTeams {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
