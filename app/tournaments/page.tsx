'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserTournaments, createTournament, Tournament } from '@/lib/tournament-service';
import UserHeader from '@/components/UserHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function TournamentsPage() {
    const { user, loading: authLoading } = useAuth();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState('');
    const [teams, setTeams] = useState('');

    useEffect(() => {
        if (user) {
            getUserTournaments(user.uid).then((data) => {
                setTournaments(data);
                setLoading(false);
            });
        }
    }, [user]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name) return;
        const teamList = teams.split(',').map(t => t.trim()).filter(Boolean);
        try {
            await createTournament(user.uid, name, teamList, 'T20');
            setIsCreating(false);
            setName('');
            setTeams('');
            getUserTournaments(user.uid).then(setTournaments);
        } catch (err) {
            console.error(err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Tournaments</h1>
                        <p className="text-muted-foreground mt-1">Organize and track multiple matches</p>
                    </div>
                    <UserHeader />
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => setIsCreating(!isCreating)} className="bg-primary hover:bg-primary/90">
                        {isCreating ? 'Cancel' : '+ New Tournament'}
                    </Button>
                </div>

                {isCreating && (
                    <Card className="p-6 bg-card border-primary/20 animate-in fade-in slide-in-from-top-4">
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold mb-1 block">Tournament Name</label>
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. World Cup 2026" required />
                            </div>
                            <div>
                                <label className="text-sm font-bold mb-1 block">Teams (comma separated)</label>
                                <Input value={teams} onChange={e => setTeams(e.target.value)} placeholder="India, Australia, England..." />
                            </div>
                            <Button type="submit" className="w-full bg-primary font-bold">Create Tournament</Button>
                        </form>
                    </Card>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map(t => (
                        <Link key={t.id} href={`/tournaments/${t.id}`}>
                            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{t.name}</h3>
                                <p className="text-sm text-muted-foreground">{t.teams.length} Teams • {t.matchIds.length} Matches played</p>
                                <div className="mt-4 flex flex-wrap gap-1">
                                    {t.teams.slice(0, 4).map(team => (
                                        <span key={team} className="text-[10px] px-2 py-0.5 bg-muted rounded-full">{team}</span>
                                    ))}
                                    {t.teams.length > 4 && <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">+{t.teams.length - 4} more</span>}
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {tournaments.length === 0 && !isCreating && (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground">No tournaments yet. Create one to get started!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
