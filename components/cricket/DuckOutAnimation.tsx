'use client';

import { useEffect, useState } from 'react';

interface DuckOutAnimationProps {
  playerName: string;
  show: boolean;
  onComplete?: () => void;
}

export default function DuckOutAnimation({ playerName, show, onComplete }: DuckOutAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden">
      {/* Dark sad overlay */}
      <div className="absolute inset-0 bg-black/60" style={{ animation: 'fadeInOut 4s ease-in-out' }} />
      
      {/* Duck walking across screen */}
      <div className="absolute duck-walking">
        <div className="flex items-end gap-2">
          {/* Sad Duck Character */}
          <div className="relative">
            {/* Duck body */}
            <svg width="120" height="100" viewBox="0 0 120 100" className="duck-body">
              {/* Body */}
              <ellipse cx="60" cy="65" rx="45" ry="30" fill="#FFD700" />
              {/* Head */}
              <circle cx="90" cy="40" r="25" fill="#FFD700" />
              {/* Sad eye */}
              <circle cx="95" cy="35" r="6" fill="white" />
              <circle cx="97" cy="37" r="3" fill="black" />
              {/* Tear drop */}
              <path d="M100 42 Q102 50 100 55 Q98 50 100 42" fill="#87CEEB" className="tear-drop" />
              {/* Sad beak */}
              <path d="M110 45 L125 50 L110 55 Z" fill="#FF6B35" />
              {/* Frown */}
              <path d="M85 50 Q90 45 100 48" stroke="black" strokeWidth="2" fill="none" />
              {/* Wing */}
              <ellipse cx="50" cy="60" rx="20" ry="15" fill="#E6C200" />
              {/* Feet */}
              <path d="M40 90 L30 100 L45 100 L40 90" fill="#FF6B35" />
              <path d="M70 90 L60 100 L75 100 L70 90" fill="#FF6B35" />
            </svg>
            
            {/* Rain cloud above duck */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <svg width="60" height="40" viewBox="0 0 60 40" className="rain-cloud">
                <ellipse cx="30" cy="20" rx="25" ry="15" fill="#555" />
                <ellipse cx="15" cy="22" rx="12" ry="10" fill="#555" />
                <ellipse cx="45" cy="22" rx="12" ry="10" fill="#555" />
                {/* Rain drops */}
                <line x1="20" y1="32" x2="18" y2="40" stroke="#87CEEB" strokeWidth="2" className="rain-drop-1" />
                <line x1="30" y1="32" x2="28" y2="40" stroke="#87CEEB" strokeWidth="2" className="rain-drop-2" />
                <line x1="40" y1="32" x2="38" y2="40" stroke="#87CEEB" strokeWidth="2" className="rain-drop-3" />
              </svg>
            </div>
          </div>
          
          {/* Bat being dragged */}
          <div className="bat-drag">
            <svg width="80" height="30" viewBox="0 0 80 30">
              {/* Bat handle */}
              <rect x="0" y="10" width="25" height="10" rx="2" fill="#8B4513" />
              {/* Bat blade */}
              <rect x="25" y="5" width="50" height="20" rx="3" fill="#D2691E" />
              <rect x="30" y="8" width="40" height="14" rx="2" fill="#DEB887" />
            </svg>
          </div>
        </div>
      </div>

      {/* Player name and message */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center duck-text">
        <div className="text-5xl font-black text-destructive mb-2">DUCK!</div>
        <div className="text-3xl font-bold text-foreground mb-4">{playerName}</div>
        <div className="text-xl text-muted-foreground">Out for 0 runs</div>
        <div className="text-6xl mt-4 opacity-70">0️</div>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes duckWalk {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-200px);
          }
        }

        @keyframes duckBobble {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(-2deg);
          }
          75% {
            transform: translateY(-5px) rotate(2deg);
          }
        }

        @keyframes batDrag {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes tearFall {
          0%, 100% {
            opacity: 1;
            transform: translateY(0);
          }
          50% {
            opacity: 0.5;
            transform: translateY(5px);
          }
        }

        @keyframes rainDrop {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(15px);
          }
        }

        @keyframes duckTextAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
        }

        .duck-walking {
          animation: duckWalk 4s linear forwards;
          bottom: 20%;
        }

        .duck-body {
          animation: duckBobble 0.5s ease-in-out infinite;
        }

        .bat-drag {
          animation: batDrag 0.3s ease-in-out infinite;
          transform-origin: left center;
        }

        .tear-drop {
          animation: tearFall 1s ease-in-out infinite;
        }

        .rain-drop-1 {
          animation: rainDrop 0.8s ease-in infinite;
        }

        .rain-drop-2 {
          animation: rainDrop 0.8s ease-in infinite 0.2s;
        }

        .rain-drop-3 {
          animation: rainDrop 0.8s ease-in infinite 0.4s;
        }

        .duck-text {
          animation: duckTextAppear 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
