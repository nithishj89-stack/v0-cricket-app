'use client';

import { useEffect, useState } from 'react';
import { getGlobalLeaderboard, PlayerStats } from '@/lib/stat-service';
import UserHeader from '@/components/UserHeader';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function LeaderboardPage() {
    const [stats, setStats] = useState<PlayerStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGlobalLeaderboard().then((data) => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
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
                        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Global Leaderboard</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Top performers across the community</p>
                    </div>
                    <UserHeader />
                </div>

                <Tabs defaultValue="batting" className="w-full">
                    <TabsList className="bg-card border border-border mb-6">
                        <TabsTrigger value="batting" className="px-8">Top Batsmen</TabsTrigger>
                        <TabsTrigger value="bowling" className="px-8">Top Bowlers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="batting">
                        <Card className="bg-card border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="text-center py-4 px-4 font-bold text-primary">Rank</th>
                                            <th className="text-left py-4 px-6 font-bold text-primary">Player</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Runs</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Matches</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">HS</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Avg</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">SR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.map((p, idx) => {
                                            const avg = (p.matches - p.notOuts) > 0 ? (p.runs / (p.matches - p.notOuts)).toFixed(2) : p.runs.toFixed(2);
                                            const sr = p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(2) : '0.00';
                                            return (
                                                <tr key={p.playerName} className="border-b border-border hover:bg-muted/30 transition-colors">
                                                    <td className="text-center py-4 px-4 font-bold text-muted-foreground">
                                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                                    </td>
                                                    <td className="py-4 px-6 font-semibold">{p.playerName}</td>
                                                    <td className="text-center py-4 px-4 font-bold text-secondary text-lg">{p.runs}</td>
                                                    <td className="text-center py-4 px-4">{p.matches}</td>
                                                    <td className="text-center py-4 px-4">{p.highestScore}{p.notOuts > 0 ? '*' : ''}</td>
                                                    <td className="text-center py-4 px-4 font-medium text-accent">{avg}</td>
                                                    <td className="text-center py-4 px-4">{sr}</td>
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
                                            <th className="text-center py-4 px-4 font-bold text-primary">Rank</th>
                                            <th className="text-left py-4 px-6 font-bold text-primary">Player</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Wickets</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Matches</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Econ</th>
                                            <th className="text-center py-4 px-4 font-bold text-primary">Best</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...stats].sort((a, b) => b.wickets - a.wickets).filter(p => p.wickets > 0).map((p, idx) => {
                                            const totalBalls = p.oversBowled * 6 + p.ballsBowled;
                                            const econ = totalBalls > 0 ? ((p.runsConceded / totalBalls) * 6).toFixed(2) : '0.00';
                                            return (
                                                <tr key={p.playerName} className="border-b border-border hover:bg-muted/30 transition-colors">
                                                    <td className="text-center py-4 px-4 font-bold text-muted-foreground">
                                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                                    </td>
                                                    <td className="py-4 px-6 font-semibold">{p.playerName}</td>
                                                    <td className="text-center py-4 px-4 font-bold text-destructive text-lg">{p.wickets}</td>
                                                    <td className="text-center py-4 px-4">{p.matches}</td>
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
                            Join the Action
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
