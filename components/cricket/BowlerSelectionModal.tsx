'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Player {
  id: number;
  name: string;
  role: string;
}

interface BowlerSelectionModalProps {
  show: boolean;
  team: string;
  bowlers: Player[];
  currentBowler: Player | null;
  onSelect: (bowler: Player) => void;
}

export default function BowlerSelectionModal({
  show,
  team,
  bowlers,
  currentBowler,
  onSelect
}: BowlerSelectionModalProps) {
  if (!show) return null;

  // Filter out current bowler
  const availableBowlers = bowlers.filter(b => b.id !== currentBowler?.id);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card border-border animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">Select Next Bowler</h2>
            <p className="text-muted-foreground">{team} - New Over Starting</p>
          </div>

          <div className="bg-muted/20 p-3 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Current Bowler</p>
            <p className="text-lg font-semibold text-foreground">{currentBowler?.name}</p>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            <p className="text-sm font-semibold text-muted-foreground">Available Bowlers</p>
            {availableBowlers.length > 0 ? (
              availableBowlers.map(bowler => (
                <Button
                  key={bowler.id}
                  onClick={() => onSelect(bowler)}
                  variant="outline"
                  className="w-full justify-start border-border hover:border-primary hover:bg-primary/10 transition"
                >
                  <span className="flex-1 text-left">{bowler.name}</span>
                  <span className="text-xs text-muted-foreground">{bowler.role}</span>
                </Button>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No other bowlers available</p>
                <Button
                  onClick={() => onSelect(currentBowler!)}
                  className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue with {currentBowler?.name}
                </Button>
              </div>
            )}
          </div>

          {availableBowlers.length > 0 && (
            <Button
              onClick={() => onSelect(currentBowler!)}
              variant="outline"
              className="w-full border-secondary text-secondary hover:bg-secondary/10"
            >
              Keep {currentBowler?.name}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
