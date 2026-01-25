'use client';

import { useState } from 'react';

interface Bowler {
  id: number;
  name: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
}

interface BowlerSectionProps {
  bowler: Bowler;
  onBowlerNameChange: (name: string) => void;
}

export default function BowlerSection({ bowler, onBowlerNameChange }: BowlerSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getEconomy = () => {
    const totalBalls = bowler.overs * 6 + bowler.balls;
    return totalBalls > 0 ? ((bowler.runs / totalBalls) * 6).toFixed(2) : '0.00';
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-2xl font-bold text-primary mb-4">Bowler</h2>
      <div className="bg-background rounded-lg p-6 border-2 border-primary">
        <div className="mb-4">
          {isEditing ? (
            <input
              type="text"
              value={bowler.name}
              onChange={(e) => onBowlerNameChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="bg-input text-foreground rounded px-3 py-2 border border-border w-full text-lg font-semibold"
            />
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className="text-2xl font-bold text-primary cursor-pointer hover:text-accent transition-colors"
            >
              {bowler.name}
            </p>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-input rounded p-4 text-center border border-border">
            <p className="text-3xl font-bold text-primary">{bowler.overs}</p>
            <p className="text-sm text-muted-foreground mt-1">Overs</p>
          </div>
          <div className="bg-input rounded p-4 text-center border border-border">
            <p className="text-lg text-muted-foreground">
              {bowler.overs}.{bowler.balls}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-input rounded p-4 text-center border border-border">
            <p className="text-3xl font-bold text-secondary">{bowler.runs}</p>
            <p className="text-sm text-muted-foreground mt-1">Runs Conceded</p>
          </div>
          <div className="bg-input rounded p-4 text-center border border-border">
            <p className="text-3xl font-bold text-destructive">{bowler.wickets}</p>
            <p className="text-sm text-muted-foreground mt-1">Wickets</p>
          </div>
        </div>

        {/* Economy Rate */}
        <div className="mt-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 text-center border border-primary/30">
          <p className="text-xs text-muted-foreground">Economy Rate</p>
          <p className="text-4xl font-bold text-primary mt-2">{getEconomy()}</p>
        </div>
      </div>
    </div>
  );
}
