'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTournament, Tournament, Standings } from '@/lib/tournament-service';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import UserHeader from '@/components/UserHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TournamentDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [standings, setStandings] = useState<Standings[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadTournamentData();
        }
    }, [id]);

    async function loadTournamentData() {
        const t = await getTournament(id);
        if (!t) {
            setLoading(false);
            return;
        }
        setTournament(t);

        // Fetch all matches in this tournament to calculate standings
        const standingsMap = new Map<string, Standings>();
        t.teams.forEach(team => {
            standingsMap.set(team, {
                teamName: team, played: 0, won: 0, lost: 0, tied: 0, points: 0, nrr: 0
            });
        });

        for (const matchId of t.matchIds) {
            const matchDoc = await getDoc(doc(db, 'matches', matchId));
            if (matchDoc.exists()) {
                const data = matchDoc.data();
                updateStandings(standingsMap, data);
            }
        }

        setStandings(Array.from(standingsMap.values()).sort((a, b) => b.points - a.points || b.nrr - a.nrr));
        setLoading(false);
    }

    function updateStandings(map: Map<string, Standings>, match: any) {
        const teamA = map.get(match.teamAName);
        const teamB = map.get(match.teamBName);

        if (teamA && teamB) {
            teamA.played += 1;
            teamB.played += 1;

            if (match.winner === match.teamAName) {
                teamA.won += 1;
                teamA.points += 2;
                teamB.lost += 1;
            } else if (match.winner === match.teamBName) {
                teamB.won += 1;
                teamB.points += 2;
                teamA.lost += 1;
            } else {
                teamA.tied += 1;
                teamA.points += 1;
                teamB.tied += 1;
                teamB.points += 1;
            }

            // NRR calculation simplified (just a placeholder logic for now)
            // Actual NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!tournament) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p>Tournament not found.</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/tournaments" className="text-sm text-primary hover:underline mb-2 block">← All Tournaments</Link>
                        <h1 className="text-4xl font-extrabold">{tournament.name}</h1>
                    </div>
                    <UserHeader />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-card border-border overflow-hidden">
                            <div className="p-4 bg-muted/50 border-b border-border">
                                <h2 className="font-bold text-lg">Points Table</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/30 border-b border-border">
                                            <th className="text-left py-3 px-6">Team</th>
                                            <th className="text-center py-3 px-4">P</th>
                                            <th className="text-center py-3 px-4">W</th>
                                            <th className="text-center py-3 px-4">L</th>
                                            <th className="text-center py-3 px-4 font-bold text-primary">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {standings.map((s, idx) => (
                                            <tr key={s.teamName} className="border-b border-border hover:bg-muted/20">
                                                <td className="py-4 px-6 font-semibold flex items-center gap-3">
                                                    <span className="text-muted-foreground w-4">{idx + 1}</span>
                                                    {s.teamName}
                                                </td>
                                                <td className="text-center py-4 px-4">{s.played}</td>
                                                <td className="text-center py-4 px-4 text-green-500">{s.won}</td>
                                                <td className="text-center py-4 px-4 text-red-500">{s.lost}</td>
                                                <td className="text-center py-4 px-4 font-bold text-lg">{s.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 bg-card border-border">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Tournament Info
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="capitalize font-medium text-green-500">{tournament.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Teams</span>
                                    <span className="font-medium">{tournament.teams.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Matches Played</span>
                                    <span className="font-medium">{tournament.matchIds.length}</span>
                                </div>
                            </div>
                            <Link href="/">
                                <Button className="w-full mt-6 bg-primary font-bold">Launch Tournament Match</Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
