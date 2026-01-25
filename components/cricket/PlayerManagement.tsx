'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { getUserTeams, Team as SavedTeam } from '@/lib/team-service';

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
  currentOvers: number;
  onStart: (teamA: Team, teamB: Team, overs: number, tournamentId?: string) => void;
}

export default function PlayerManagement({ teamA, teamB, currentOvers, onStart }: PlayerManagementProps) {
  const { user } = useAuth();
  const [editingTeam, setEditingTeam] = useState<'A' | 'B' | null>(null);
  const [localTeamA, setLocalTeamA] = useState<Team>(teamA);
  const [localTeamB, setLocalTeamB] = useState<Team>(teamB);

  // Loading Teams State
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);
  const [showSavedTeams, setShowSavedTeams] = useState<'A' | 'B' | null>(null);

  // Tournament State
  const [availableTournaments, setAvailableTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string | undefined>(undefined);
  const [localOvers, setLocalOvers] = useState(currentOvers);


  useEffect(() => {
    if (user) {
      getUserTeams(user.uid).then(setSavedTeams);
      import('@/lib/tournament-service').then(m => {
        m.getUserTournaments(user.uid).then(setAvailableTournaments);
      });
    }
  }, [user]);

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

  const handleLoadTeam = (team: 'A' | 'B', saved: SavedTeam) => {
    const formattedTeam: Team = {
      name: saved.name,
      players: saved.players.map(p => ({ ...p }))
    };
    if (team === 'A') setLocalTeamA(formattedTeam);
    else setLocalTeamB(formattedTeam);
    setShowSavedTeams(null);
  };

  const handleStart = () => {
    if (editingTeam) {
      setEditingTeam(null);
    } else {
      onStart(localTeamA, localTeamB, localOvers, selectedTournament);
    }
  };

  const isEditing = editingTeam !== null;
  const currentTeam = editingTeam === 'A' ? localTeamA : editingTeam === 'B' ? localTeamB : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">Match Setup</h2>
            <p className="text-muted-foreground">Setup your teams to begin the game</p>
          </div>

          {showSavedTeams ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Select Saved Team</h3>
                <Button variant="ghost" onClick={() => setShowSavedTeams(null)}>Close</Button>
              </div>
              <div className="grid gap-3">
                {savedTeams.map(t => (
                  <Button
                    key={t.id}
                    variant="outline"
                    className="w-full justify-between h-auto p-4 border-border hover:border-primary/50"
                    onClick={() => handleLoadTeam(showSavedTeams, t)}
                  >
                    <div className="text-left font-bold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.players.length} Players</div>
                  </Button>
                ))}
                {savedTeams.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No saved teams found. Manage them in your profile.
                  </div>
                )}
              </div>
            </div>
          ) : isEditing && currentTeam ? (
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

              <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
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
                    <select
                      className="bg-background border border-border rounded px-2 py-1 text-xs"
                      value={player.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        if (editingTeam === 'A') {
                          setLocalTeamA(prev => ({
                            ...prev,
                            players: prev.players.map(p => p.id === player.id ? { ...p, role: newRole } : p)
                          }));
                        } else {
                          setLocalTeamB(prev => ({
                            ...prev,
                            players: prev.players.map(p => p.id === player.id ? { ...p, role: newRole } : p)
                          }));
                        }
                      }}
                    >
                      <option>Batsman</option>
                      <option>Bowler</option>
                      <option>All-rounder</option>
                    </select>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setEditingTeam(null)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              >
                Done Editing
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[
                { team: 'A' as const, name: localTeamA.name, players: localTeamA.players },
                { team: 'B' as const, name: localTeamB.name, players: localTeamB.players }
              ].map(({ team, name, players }) => (
                <div key={team} className="space-y-2">
                  <div
                    className="p-4 bg-muted/20 rounded-xl border border-border hover:border-primary/50 transition cursor-pointer group relative overflow-hidden"
                    onClick={() => setEditingTeam(team)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-foreground">{name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded">Team {team}</span>
                    </div>
                    <div className="space-y-1.5 min-h-[80px]">
                      {players.slice(0, 3).map((p, idx) => (
                        <div key={p.id} className="text-xs text-muted-foreground flex justify-between">
                          <span>{p.name}</span>
                          <span className="opacity-50 text-[8px]">{p.role === 'All-rounder' ? 'ALL' : p.role.slice(0, 3).toUpperCase()}</span>
                        </div>
                      ))}
                      <div className="text-[10px] text-muted-foreground/60 pt-2 border-t border-border mt-2">
                        +{players.length - 3} more players
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3 border-border hover:bg-primary/10 group-hover:border-primary/50 transition bg-background"
                    >
                      Edit Squad
                    </Button>
                  </div>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSavedTeams(team)}
                      className="w-full text-[10px] text-muted-foreground hover:text-primary h-auto py-1"
                    >
                      Load Saved Team
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Overs Selection */}
          {!isEditing && !showSavedTeams && (
            <div className="pt-4 border-t border-border space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Match Overs (2-100)</label>
                  <span className="text-lg font-black text-primary">{localOvers} <span className="text-[10px] text-muted-foreground ml-1">OVERS</span></span>
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={localOvers}
                    onChange={(e) => setLocalOvers(parseInt(e.target.value))}
                    className="flex-1 accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="2"
                    max="100"
                    value={localOvers}
                    onChange={(e) => setLocalOvers(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
                    className="w-16 bg-muted/30 border border-border rounded px-2 py-1 text-sm font-bold text-center"
                  />
                </div>
              </div>

              {availableTournaments.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Select Tournament (Optional)</label>
                  <select
                    className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                    value={selectedTournament || ""}
                    onChange={(e) => setSelectedTournament(e.target.value || undefined)}
                  >
                    <option value="">Friendly Match (No Tournament)</option>
                    {availableTournaments.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
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
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xl shadow-primary/20"
            >
              {isEditing ? 'Back to Setup' : 'Launch Match'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

