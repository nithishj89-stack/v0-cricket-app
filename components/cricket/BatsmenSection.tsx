'use client';

import { useState } from 'react';

interface Batsman {
  id: number;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isStriker: boolean;
}

interface BatsmenSectionProps {
  batsmen: Batsman[];
  onBatsmanNameChange: (id: number, name: string) => void;
}

export default function BatsmenSection({ batsmen, onBatsmanNameChange }: BatsmenSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const getStrikeRate = (batsman: Batsman) => {
    return batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(2) : '0.00';
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-2xl font-bold text-primary mb-4">Batsmen</h2>
      <div className="space-y-3">
        {batsmen.map((batsman) => (
          <div
            key={batsman.id}
            className={`bg-background rounded-lg p-4 border-2 transition-all ${
              batsman.isStriker
                ? 'border-primary shadow-lg shadow-primary/50'
                : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                {batsman.isStriker && <span className="text-2xl">🏏</span>}
                <div>
                  {editingId === batsman.id ? (
                    <input
                      type="text"
                      value={batsman.name}
                      onChange={(e) => onBatsmanNameChange(batsman.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                      className="bg-input text-foreground rounded px-2 py-1 border border-border text-sm"
                    />
                  ) : (
                    <p
                      onClick={() => setEditingId(batsman.id)}
                      className="font-semibold text-foreground cursor-pointer hover:text-primary"
                    >
                      {batsman.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {batsman.isStriker ? 'Striker' : 'Non-Striker'}
                  </p>
                </div>
              </div>

              {/* Main Stats */}
              <div className="flex gap-6 text-right">
                <div>
                  <p className="text-2xl font-bold text-primary">{batsman.runs}</p>
                  <p className="text-xs text-muted-foreground">Runs</p>
                </div>
                <div>
                  <p className="text-xl text-foreground">{batsman.balls}</p>
                  <p className="text-xs text-muted-foreground">Balls</p>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border/50">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{batsman.fours}</p>
                <p className="text-xs text-muted-foreground">4s</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-secondary">{batsman.sixes}</p>
                <p className="text-xs text-muted-foreground">6s</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-accent">{getStrikeRate(batsman)}</p>
                <p className="text-xs text-muted-foreground">SR</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{(batsman.runs - batsman.fours * 4 - batsman.sixes * 6)}</p>
                <p className="text-xs text-muted-foreground">Singles</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
