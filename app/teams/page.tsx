'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserTeams, saveTeam, deleteTeam, Team, Player } from '@/lib/team-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function TeamsPage() {
    const { user, loading: authLoading } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // New Team Modal/State
    const [isAdding, setIsAdding] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamPlayers, setNewTeamPlayers] = useState<string[]>(Array(11).fill(''));

    useEffect(() => {
        if (user) {
            loadTeams();
        }
    }, [user]);

    async function loadTeams() {
        try {
            const data = await getUserTeams(user!.uid);
            setTeams(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newTeamName) return;

        const players: Player[] = newTeamPlayers.map((name, index) => ({
            id: Date.now() + index,
            name: name || `Player ${index + 1}`,
            role: index < 5 ? 'Batsman' : index < 9 ? 'Bowler' : 'All-rounder'
        }));

        try {
            await saveTeam(user.uid, {
                name: newTeamName,
                players
            });
            setIsAdding(false);
            setNewTeamName('');
            setNewTeamPlayers(Array(11).fill(''));
            loadTeams();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTeam = async (id: string) => {
        if (confirm('Are you sure you want to delete this team?')) {
            try {
                await deleteTeam(id);
                loadTeams();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-4">Please login to manage teams</h2>
            <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90">Login</Button>
            </Link>
        </div>
    );

    const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <main className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Your Teams</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Manage your custom squad lists</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                        >
                            + Create Team
                        </Button>
                        <Link href="/">
                            <Button variant="outline" className="border-border">Back Home</Button>
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <Input
                        placeholder="Search teams..."
                        className="bg-card border-border h-12 pl-12 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <svg className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {isAdding && (
                    <Card className="p-6 bg-card border-primary/20 animate-in fade-in slide-in-from-top-4">
                        <form onSubmit={handleCreateTeam} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="col-span-full">
                                    <label className="text-sm font-semibold mb-2 block">Team Name</label>
                                    <Input
                                        required
                                        value={newTeamName}
                                        onChange={e => setNewTeamName(e.target.value)}
                                        placeholder="e.g. Dream XI"
                                        className="h-12 border-border"
                                    />
                                </div>
                                {newTeamPlayers.map((name, i) => (
                                    <div key={i}>
                                        <label className="text-xs text-muted-foreground mb-1 block">Player {i + 1}</label>
                                        <Input
                                            value={name}
                                            onChange={e => {
                                                const next = [...newTeamPlayers];
                                                next[i] = e.target.value;
                                                setNewTeamPlayers(next);
                                            }}
                                            placeholder={`Player Name`}
                                            className="border-border"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1 bg-primary">Save Team</Button>
                                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="flex-1">Cancel</Button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map(team => (
                        <Card key={team.id} className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                                        onClick={() => handleDeleteTeam(team.id!)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {team.players.slice(0, 5).map((p, i) => (
                                        <div key={i} className="flex justify-between text-sm items-center">
                                            <span className="text-muted-foreground">{i + 1}. {p.name}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{p.role === 'All-rounder' ? 'All' : p.role.slice(0, 3)}</span>
                                        </div>
                                    ))}
                                    <div className="pt-2 text-xs text-primary font-medium">
                                        +{team.players.length - 5} more teammates
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {filteredTeams.length === 0 && !isAdding && (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-block p-6 rounded-full bg-muted mb-4">
                                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">No teams found</h3>
                            <p className="text-muted-foreground mb-6">Create your first team to start scoring faster</p>
                            <Button onClick={() => setIsAdding(true)} className="bg-primary">Create Your First Team</Button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
