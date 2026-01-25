'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ControlPanelProps {
  onScoreUpdate: (runs: number, isExtra?: boolean, isBoundary?: boolean) => void;
  onWicket: () => void;
  onChangeStrike: () => void;
  onNewOver: () => void;
  onResetMatch: () => void;
  isMatchEnded: boolean;
}

export default function ControlPanel({
  onScoreUpdate,
  onWicket,
  onChangeStrike,
  onNewOver,
  onResetMatch,
  isMatchEnded
}: ControlPanelProps) {
  const [lastAction, setLastAction] = useState('');
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);

  const handleScoreClick = (runs: number, isExtra = false, isBoundary = false) => {
    if (isMatchEnded) return;
    onScoreUpdate(runs, isExtra, isBoundary);
    setAnimatingButton(`score-${runs}`);
    setTimeout(() => setAnimatingButton(null), 600);
    const boundaryType = isBoundary && runs === 4 ? '(Four!)' : isBoundary && runs === 6 ? '(SIX!)' : '';
    setLastAction(`${runs} runs ${boundaryType}${isExtra ? ' (Extra)' : ''}`);
  };

  const handleWicketClick = () => {
    if (isMatchEnded) return;
    onWicket();
    setAnimatingButton('wicket');
    setTimeout(() => setAnimatingButton(null), 800);
    setLastAction('Wicket!');
  };

  const scoreButtons = [
    { label: '+0', value: 0, variant: 'outline' },
    { label: '+1', value: 1, variant: 'default' },
    { label: '+2', value: 2, variant: 'default' },
    { label: '+3', value: 3, variant: 'default' },
    { label: '+4', value: 4, variant: 'default', isBoundary: true },
    { label: '+6', value: 6, variant: 'default', isBoundary: true }
  ];

  const extraButtons = [
    { label: 'Wide (+1)', value: 1, isExtra: true },
    { label: 'No Ball (+1)', value: 1, isExtra: true }
  ];

  return (
    <div className="space-y-4">
      {/* Score Buttons */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-primary mb-4">Scoring</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {scoreButtons.map((btn) => (
            <Button
              key={btn.label}
              onClick={() => handleScoreClick(btn.value, false, btn.isBoundary)}
              disabled={isMatchEnded}
              className={`
                ${btn.value === 4 || btn.value === 6 
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-secondary/50' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'}
                font-bold text-lg py-6 transition-all
                ${animatingButton === `score-${btn.value}` 
                  ? btn.value === 6 ? 'six-animation' : btn.value === 4 ? 'four-animation' : 'score-popup'
                  : ''
                }
              `}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Extra Runs */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-primary mb-4">Extras (No Legal Ball - Re-bowl)</h2>
        <p className="text-xs text-muted-foreground mb-3">Wide/No Ball adds 1 run to team. Bowler must bowl again.</p>
        <div className="grid grid-cols-2 gap-3">
          {extraButtons.map((btn) => (
            <Button
              key={btn.label}
              onClick={() => handleScoreClick(btn.value, btn.isExtra)}
              disabled={isMatchEnded}
              className="bg-orange-600 text-white hover:bg-orange-700 font-bold py-6 text-lg"
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Controls */}
      <div className="grid md:grid-cols-3 gap-3">
        <Button
          onClick={handleWicketClick}
          disabled={isMatchEnded}
          className="bg-destructive text-white hover:bg-destructive/90 font-bold py-6 text-lg"
        >
          Wicket
        </Button>
        <Button
          onClick={onChangeStrike}
          disabled={isMatchEnded}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg"
        >
          Change Strike
        </Button>
        <Button
          onClick={onNewOver}
          disabled={isMatchEnded}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg"
        >
          New Over
        </Button>
      </div>

      {/* Reset Match */}
      <div className="bg-card rounded-lg p-4 border border-border flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Last Action: {lastAction || 'None'}</p>
        <Button
          onClick={onResetMatch}
          className="bg-destructive text-white hover:bg-destructive/90 font-bold"
        >
          Reset Match
        </Button>
      </div>
    </div>
  );
}
