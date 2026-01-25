'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  match: any;
  onMatchDetailsChange: (updates: any) => void;
  onTeamALogoChange: (logo: string) => void;
  onTeamBLogoChange: (logo: string) => void;
}

export default function Header({ match, onMatchDetailsChange, onTeamALogoChange, onTeamBLogoChange }: HeaderProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onLogoChange: (logo: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onLogoChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-primary">NJ.cric-scorer</h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{match.currentDate}</p>
            <p className="text-lg font-semibold text-primary">{match.currentTime}</p>
            <p className="text-sm text-primary mt-1">🟢 LIVE</p>
          </div>
        </div>

        <Button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mb-4"
        >
          {showDetails ? 'Hide Match Details' : 'Show Match Details'}
        </Button>

        {showDetails && (
          <div className="space-y-4 bg-background rounded-lg p-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Team A Section */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-accent">Team A Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, onTeamALogoChange)}
                    className="mt-1 w-full text-sm"
                  />
                  {match.teamALogo && (
                    <img src={match.teamALogo || "/placeholder.svg"} alt="Team A" className="w-16 h-16 rounded mt-2" />
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-accent">Team A Name</label>
                  <input
                    type="text"
                    value={match.teamAName}
                    onChange={(e) => onMatchDetailsChange({ teamAName: e.target.value })}
                    className="mt-1 w-full bg-input text-foreground rounded px-3 py-2 border border-border"
                  />
                </div>
              </div>

              {/* Team B Section */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-accent">Team B Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, onTeamBLogoChange)}
                    className="mt-1 w-full text-sm"
                  />
                  {match.teamBLogo && (
                    <img src={match.teamBLogo || "/placeholder.svg"} alt="Team B" className="w-16 h-16 rounded mt-2" />
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-accent">Team B Name</label>
                  <input
                    type="text"
                    value={match.teamBName}
                    onChange={(e) => onMatchDetailsChange({ teamBName: e.target.value })}
                    className="mt-1 w-full bg-input text-foreground rounded px-3 py-2 border border-border"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-accent">Toss Winner</label>
                <select
                  value={match.tossWinner}
                  onChange={(e) => onMatchDetailsChange({ tossWinner: e.target.value })}
                  className="mt-1 w-full bg-input text-foreground rounded px-3 py-2 border border-border"
                >
                  <option value="Team A">Team A</option>
                  <option value="Team B">Team B</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-accent">Decision</label>
                <select
                  value={match.decision}
                  onChange={(e) => onMatchDetailsChange({ decision: e.target.value })}
                  className="mt-1 w-full bg-input text-foreground rounded px-3 py-2 border border-border"
                >
                  <option value="Batting">Batting</option>
                  <option value="Bowling">Bowling</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-accent">Total Overs</label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={match.totalOvers}
                  onChange={(e) => onMatchDetailsChange({ totalOvers: parseInt(e.target.value) })}
                  className="mt-1 w-full bg-input text-foreground rounded px-3 py-2 border border-border"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={match.chasingMode}
                  onChange={(e) => onMatchDetailsChange({ chasingMode: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-accent">Chasing Mode</span>
              </label>
            </div>

            {match.chasingMode && (
              <div>
                <label className="text-sm font-semibold text-accent">Target Score</label>
                <input
                  type="number"
                  value={match.target}
                  onChange={(e) => onMatchDetailsChange({ target: parseInt(e.target.value) })}
                  className="mt-1 w-full bg-input text-foreground rounded px-3 py-2 border border-border"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
