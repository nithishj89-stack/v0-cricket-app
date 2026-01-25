'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Player {
  id: number;
  name: string;
  role: string; // Batsman, Bowler, All-rounder
}

interface Team {
  name: string;
  players: Player[];
}

interface PlayerManagementProps {
  teamA: Team;
  teamB: Team;
  onStart: (teamA: Team, teamB: Team) => void;
}

export default function PlayerManagement({ teamA, teamB, onStart }: PlayerManagementProps) {
  const [editingTeam, setEditingTeam] = useState<'A' | 'B' | null>(null);
  const [localTeamA, setLocalTeamA] = useState<Team>(teamA);
  const [localTeamB, setLocalTeamB] = useState<Team>(teamB);

  const handlePlayerNameChange = (team: 'A' | 'B', playerId: number, newName: string) => {
    if (team === 'A') {
      setLocalTeamA(prev => ({
        ...prev,
        players: prev.players.map(p => p.id === playerId ? { ...p, name: newName } : p)
      }));
    } else {
      setLocalTeamB(prev => ({
        ...prev,
        players: prev.players.map(p => p.id === playerId ? { ...p, name: newName } : p)
      }));
    }
  };

  const handleStart = () => {
    if (editingTeam) {
      setEditingTeam(null);
    } else {
      onStart(localTeamA, localTeamB);
    }
  };

  const isEditing = editingTeam !== null;
  const currentTeam = editingTeam === 'A' ? localTeamA : editingTeam === 'B' ? localTeamB : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">Player Setup</h2>
            <p className="text-muted-foreground">Edit 11 players for each team</p>
          </div>

          {isEditing && currentTeam ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-accent">{currentTeam.name}</h3>
                <Button
                  variant="outline"
                  onClick={() => setEditingTeam(null)}
                  className="border-muted"
                >
                  ← Back
                </Button>
              </div>

              <div className="grid gap-3 max-h-[60vh] overflow-y-auto">
                {currentTeam.players.map((player, idx) => (
                  <div key={player.id} className="flex gap-2 items-center p-3 bg-muted/20 rounded-lg border border-border">
                    <span className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary rounded font-bold text-sm">
                      {idx + 1}
                    </span>
                    <Input
                      value={player.name}
                      onChange={(e) => handlePlayerNameChange(editingTeam, player.id, e.target.value)}
                      placeholder={`Player ${idx + 1}`}
                      className="flex-1 bg-background border-border"
                    />
                    <span className="px-3 py-2 bg-secondary/20 text-secondary rounded text-sm font-medium">
                      {player.role}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setEditingTeam(null)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Done Editing
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[
                { team: 'A', name: localTeamA.name, players: localTeamA.players },
                { team: 'B', name: localTeamB.name, players: localTeamB.players }
              ].map(({ team, name, players }) => (
                <div
                  key={team}
                  className="p-4 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition cursor-pointer"
                  onClick={() => setEditingTeam(team as 'A' | 'B')}
                >
                  <h3 className="font-bold text-lg text-foreground mb-3">{name}</h3>
                  <div className="space-y-2">
                    {players.slice(0, 3).map((p, idx) => (
                      <div key={p.id} className="text-sm text-muted-foreground">
                        {idx + 1}. {p.name}
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground/60 pt-2 border-t border-border">
                      +{players.length - 3} more players
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 border-primary text-primary hover:bg-primary/10 bg-transparent"
                  >
                    Edit Players
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setEditingTeam(null)}
              disabled={!isEditing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              {isEditing ? 'Back to Teams' : 'Start Match'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
