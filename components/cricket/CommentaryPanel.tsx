'use client';

import { Card } from '@/components/ui/card';

interface BallRecord {
    over: number;
    ball: number;
    totalScore: number;
    totalWickets: number;
    runs: number;
    isExtra: boolean;
    isWicket: boolean;
    isBoundary: boolean;
    batsmanName: string;
    bowlerName: string;
    commentary: string;
    team: 'A' | 'B';
    inning: number;
}

interface CommentaryPanelProps {
    timeline: BallRecord[];
}

export default function CommentaryPanel({ timeline }: CommentaryPanelProps) {
    const reversedTimeline = [...timeline].reverse();

    return (
        <Card className="bg-card/50 border-primary/20 backdrop-blur-sm overflow-hidden h-full">
            <div className="bg-primary/10 px-4 py-3 border-b border-primary/20 flex justify-between items-center">
                <h3 className="font-black text-primary tracking-widest text-xs uppercase italic flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Live Commentary Feed
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted/30 px-2 py-0.5 rounded italic">Real-time Analysis</span>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 custom-scrollbar">
                {reversedTimeline.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-50">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-xs font-bold uppercase tracking-tighter">Waiting for first delivery...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reversedTimeline.map((ball, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-4 items-start p-3 rounded-xl border transition-all duration-500 animate-in slide-in-from-right-4 ${ball.isWicket
                                    ? 'bg-destructive/10 border-destructive/20 shadow-lg shadow-destructive/5'
                                    : ball.isBoundary
                                        ? 'bg-secondary/10 border-secondary/20 shadow-lg shadow-secondary/5'
                                        : 'bg-muted/10 border-border hover:border-primary/30'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0 border-2 font-black ${ball.isWicket ? 'bg-destructive text-white border-destructive' :
                                    ball.isBoundary ? 'bg-secondary text-secondary-foreground border-secondary' :
                                        'bg-card text-primary border-primary/20'
                                    }`}>
                                    <span className="text-[10px] leading-tight opacity-80">{ball.over}.{ball.ball}</span>
                                    <span className="text-xl leading-none">
                                        {ball.isWicket ? 'W' : ball.isExtra ? 'Ex' : ball.runs}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Over {ball.over}.{ball.ball}</span>
                                        <span className="text-[10px] font-black text-primary italic">{ball.totalScore}/{ball.totalWickets}</span>
                                    </div>
                                    <p className="text-sm font-bold text-foreground leading-snug">
                                        <span className="text-primary opacity-60 mr-1 italic text-xs font-black">{ball.bowlerName} to {ball.batsmanName}</span>
                                        <br />
                                        {ball.commentary}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
