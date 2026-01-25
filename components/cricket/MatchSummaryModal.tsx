'use client';

import { Button } from '@/components/ui/button';

interface MatchSummaryModalProps {
  summary: any;
}

export default function MatchSummaryModal({ summary }: MatchSummaryModalProps) {
  const handleClose = () => {
    // You can implement close functionality here if needed
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border-2 border-primary shadow-2xl max-w-lg w-full slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-center">
          <h1 className="text-3xl font-bold text-primary-foreground">Match Summary</h1>
          <p className="text-sm text-primary-foreground/80 mt-2">✓ Match Completed</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Teams and Result */}
          <div className="bg-background rounded-lg p-6 border border-border">
            <div className="text-center">
              <p className="text-lg font-bold text-primary mb-2">Final Result</p>
              <p className="text-2xl font-bold text-accent">{summary.result}</p>
            </div>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 text-center border border-border">
              <p className="text-3xl font-bold text-secondary">{summary.runs}</p>
              <p className="text-sm text-muted-foreground mt-1">Runs</p>
            </div>
            <div className="bg-background rounded-lg p-4 text-center border border-border">
              <p className="text-3xl font-bold text-destructive">{summary.wickets}</p>
              <p className="text-sm text-muted-foreground mt-1">Wickets</p>
            </div>
          </div>

          {/* Overs Summary */}
          <div className="bg-background rounded-lg p-4 text-center border border-border">
            <p className="text-3xl font-bold text-primary">
              {summary.overs}.{summary.balls}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Overs</p>
          </div>

          {/* Summary Details */}
          <div className="bg-input rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Team A: <span className="text-primary font-semibold">{summary.teamA}</span></p>
            <p className="text-sm text-muted-foreground">Team B: <span className="text-primary font-semibold">{summary.teamB}</span></p>
            <p className="text-sm text-muted-foreground">Final Score: <span className="text-secondary font-semibold">{summary.runs}/{summary.wickets}</span></p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-background px-6 py-4 border-t border-border rounded-b-lg flex gap-2">
          <Button
            onClick={handleClose}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          >
            Close
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
          >
            Start New Match
          </Button>
        </div>
      </div>
    </div>
  );
}
