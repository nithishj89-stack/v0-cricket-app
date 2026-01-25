'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { calculatePlayerStats, PlayerStats } from '@/lib/stat-service';
import UserHeader from '@/components/UserHeader';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function StatsPage() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<PlayerStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            calculatePlayerStats(user.uid).then((data) => {
                setStats(data);
                setLoading(false);
            });
        }
    }, [user]);

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
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Career Statistics</h1>
                    <UserHeader />
                </div>

                <Tabs defaultValue="batting" className="w-full">
                    <TabsList className="bg-card border border-border mb-6">
                        <TabsTrigger value="batting" className="px-8">Batting</TabsTrigger>
                        <TabsTrigger value="bowling" className="px-8">Bowling</TabsTrigger>
                    </TabsList>

                    <TabsContent value="batting">
                        <Card className="bg-card border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="text-left py-4 px-6 font-bold text-primary">Player</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Mat</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Runs</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">HS</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Avg</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">SR</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">4s</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">6s</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.map((p) => {
                                            const avg = (p.matches - p.notOuts) > 0 ? (p.runs / (p.matches - p.notOuts)).toFixed(2) : p.runs.toFixed(2);
                                            const sr = p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(2) : '0.00';
                                            return (
                                                <tr key={p.playerName} className="border-b border-border hover:bg-muted/30 transition-colors">
                                                    <td className="py-4 px-6 font-semibold">{p.playerName}</td>
                                                    <td className="text-center py-4 px-4">{p.matches}</td>
                                                    <td className="text-center py-4 px-4 font-bold text-secondary">{p.runs}</td>
                                                    <td className="text-center py-4 px-4">{p.highestScore}{p.notOuts > 0 ? '*' : ''}</td>
                                                    <td className="text-center py-4 px-4 font-medium text-accent">{avg}</td>
                                                    <td className="text-center py-4 px-4">{sr}</td>
                                                    <td className="text-center py-4 px-4">{p.fours}</td>
                                                    <td className="text-center py-4 px-4">{p.sixes}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bowling">
                        <Card className="bg-card border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="text-left py-4 px-6 font-bold text-primary">Player</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Mat</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Overs</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Wkts</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Runs</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Econ</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Best</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.filter(p => (p.oversBowled > 0 || p.ballsBowled > 0)).map((p) => {
                                            const totalBalls = p.oversBowled * 6 + p.ballsBowled;
                                            const econ = totalBalls > 0 ? ((p.runsConceded / totalBalls) * 6).toFixed(2) : '0.00';
                                            return (
                                                <tr key={p.playerName} className="border-b border-border hover:bg-muted/30 transition-colors">
                                                    <td className="py-4 px-6 font-semibold">{p.playerName}</td>
                                                    <td className="text-center py-4 px-4">{p.matches}</td>
                                                    <td className="text-center py-4 px-4">{p.oversBowled}.{p.ballsBowled}</td>
                                                    <td className="text-center py-4 px-4 font-bold text-destructive">{p.wickets}</td>
                                                    <td className="text-center py-4 px-4">{p.runsConceded}</td>
                                                    <td className="text-center py-4 px-4 text-accent">{econ}</td>
                                                    <td className="text-center py-4 px-4">{p.bestBowlingWickets}/{p.bestBowlingRuns}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-center pt-8">
                    <Link href="/">
                        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            Start New Match
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
