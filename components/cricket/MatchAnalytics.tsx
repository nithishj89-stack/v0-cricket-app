'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

interface BallRecord {
    over: number;
    ball: number;
    totalScore: number;
    totalWickets: number;
    runs: number;
    isWicket: boolean;
    team: 'A' | 'B';
    inning: number;
}

interface MatchAnalyticsProps {
    inning1Timeline: BallRecord[];
    inning2Timeline: BallRecord[];
    teamAName: string;
    teamBName: string;
}

export default function MatchAnalytics({ inning1Timeline, inning2Timeline, teamAName, teamBName }: MatchAnalyticsProps) {

    // Process Worm Data
    const wormData = useMemo(() => {
        const maxBalls = Math.max(inning1Timeline.length, inning2Timeline.length);
        const data = [];

        for (let i = 0; i < maxBalls; i++) {
            data.push({
                ballIndex: i + 1,
                [teamAName]: inning1Timeline[i]?.totalScore,
                [teamBName]: inning2Timeline[i]?.totalScore,
                [`${teamAName} Wickets`]: inning1Timeline[i]?.isWicket ? inning1Timeline[i].totalScore : null,
                [`${teamBName} Wickets`]: inning2Timeline[i]?.isWicket ? inning2Timeline[i].totalScore : null,
            });
        }
        return data;
    }, [inning1Timeline, inning2Timeline, teamAName, teamBName]);

    // Process Manhattan Data (Runs per over)
    const manhattanData = useMemo(() => {
        const getOverData = (timeline: BallRecord[]) => {
            const oversMap: Record<number, number> = {};
            timeline.forEach(ball => {
                oversMap[ball.over] = (oversMap[ball.over] || 0) + ball.runs;
            });
            return oversMap;
        };

        const teamAOvers = getOverData(inning1Timeline);
        const teamBOvers = getOverData(inning2Timeline);

        const maxOvers = Math.max(
            ...Object.keys(teamAOvers).map(Number),
            ...Object.keys(teamBOvers).map(Number),
            0
        );

        const data = [];
        for (let i = 0; i <= maxOvers; i++) {
            data.push({
                over: i + 1,
                [teamAName]: teamAOvers[i] || 0,
                [teamBName]: teamBOvers[i] || 0,
            });
        }
        return data;
    }, [inning1Timeline, inning2Timeline, teamAName, teamBName]);

    return (
        <div className="space-y-8">
            {/* Worm Graph */}
            <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-primary tracking-tighter uppercase italic flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        The Worm (Score Progression)
                    </h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{teamAName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-secondary" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{teamBName}</span>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={wormData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4a" />
                            <XAxis dataKey="ballIndex" hide />
                            <YAxis stroke="#8fa3b0" fontSize={10} fontWeight="bold" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a2332', border: '1px solid #2a3a4a', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Line
                                type="monotone"
                                dataKey={teamAName}
                                stroke="#00d84f"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 4, fill: '#00d84f' }}
                            />
                            <Line
                                type="monotone"
                                dataKey={teamBName}
                                stroke="#ffd700"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 4, fill: '#ffd700' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Manhattan Graph */}
            <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
                <h3 className="text-lg font-black text-primary tracking-tighter uppercase italic flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Manhattan Chart (Runs Per Over)
                </h3>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={manhattanData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4a" vertical={false} />
                            <XAxis dataKey="over" stroke="#8fa3b0" fontSize={10} fontWeight="bold" label={{ value: 'Overs', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#8fa3b0', fontWeight: 'bold' }} />
                            <YAxis stroke="#8fa3b0" fontSize={10} fontWeight="bold" />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1a2332', border: '1px solid #2a3a4a', borderRadius: '8px' }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey={teamAName} fill="#00d84f" radius={[4, 4, 0, 0]} />
                            <Bar dataKey={teamBName} fill="#ffd700" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
