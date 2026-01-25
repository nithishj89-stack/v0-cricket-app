'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Scoreboard from '@/components/cricket/Scoreboard';
import BatsmenSection from '@/components/cricket/BatsmenSection';
import BowlerSection from '@/components/cricket/BowlerSection';
import TeamContributions from '@/components/cricket/TeamContributions';
import Link from 'next/link';

export default function LivePage() {
    const params = useParams();
    const userId = params.userId as string;
    const [match, setMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const liveMatchRef = doc(db, 'live_matches', userId);

        // Subscribe to live updates
        const unsubscribe = onSnapshot(liveMatchRef, (doc) => {
            if (doc.exists()) {
                console.log("📝 Live data received:", doc.data());
                setMatch(doc.data());
            } else {
                console.warn("⚠️ Match document does not exist in Firestore for ID:", userId);
                setMatch(null);
            }
            setLoading(false);
        }, (error: any) => {
            console.error("❌ Live subscription error:", error);
            if (error.code === 'permission-denied') {
                setError('PERMISSION_DENIED');
            } else {
                setError('UNKNOWN_ERROR');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error === 'PERMISSION_DENIED') return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="inline-block p-6 rounded-full bg-destructive/10 mb-4 text-destructive">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
                We couldn't connect to the live match. Please ask the scorer to check their <strong>Firebase Security Rules</strong>.
            </p>
            <Link href="/">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold">
                    Learn More
                </button>
            </Link>
        </div>
    );

    if (!match) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="inline-block p-6 rounded-full bg-muted mb-4">
                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Match Not Found</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
                There is no live match currently broadcasting from this link. Make sure the scorer has started the match and is logged in.
            </p>
            <Link href="/">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold">
                    Go To Home
                </button>
            </Link>
        </div>
    );

    // Helper functions similar to main page but for the synced state
    const currentBatsmen = match.currentBatsmenIndices
        .map((idx: number) => (match.currentTeam === 'A' ? match.allBatsmenA : match.allBatsmenB)[idx])
        .filter(Boolean);

    const bowlers = match.currentTeam === 'A' ? match.allBowlersB : match.allBowlersA;
    const currentBowler = bowlers[match.currentBowlerIndex] || null;

    return (
        <main className="min-h-screen bg-background py-6 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Info */}
                <div className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl font-bold text-primary">NJ.cric-scorer</h1>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">{match.currentDate}</p>
                            <p className="text-lg font-semibold text-primary">{match.currentTime}</p>
                            <p className={`text-sm mt-1 font-bold ${match.isMatchEnded ? 'text-destructive' : 'text-primary'}`}>
                                {match.isMatchEnded ? '✓ FINISHED' : '🟢 LIVE'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className={`${!match.isMatchEnded && 'animate-ping'} absolute inline-flex h-full w-full rounded-full ${match.isMatchEnded ? 'bg-gray-400' : 'bg-red-400'} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${match.isMatchEnded ? 'bg-gray-500' : 'bg-red-500'}`}></span>
                        </span>
                        <span className={`text-sm font-bold uppercase tracking-widest ${match.isMatchEnded ? 'text-muted-foreground' : 'text-red-500'}`}>
                            {match.isMatchEnded ? 'Results' : 'Live Now'}
                        </span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                        {match.isMatchEnded
                            ? `${match.winner} Won the Match!`
                            : `${match.currentTeam === 'A' ? match.teamA.name : match.teamB.name} Batting | Inning ${match.currentInning}`
                        }
                    </div>
                    {match.currentInning === 2 && (
                        <div className="text-sm font-semibold text-secondary">
                            Target: {match.target} runs
                        </div>
                    )}
                </div>

                {/* Scoreboard */}
                <Scoreboard
                    match={{
                        ...match,
                        chasingMode: match.currentInning === 2
                    }}
                    currentTeam={match.currentTeam === 'A' ? match.teamA.name : match.teamB.name}
                    currentTeamLogo=""
                />

                {/* Batsmen and Bowler Sections */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <BatsmenSection
                        batsmen={currentBatsmen}
                        onBatsmanNameChange={() => { }}
                    />

                    {currentBowler && (
                        <BowlerSection
                            bowler={currentBowler}
                            onBowlerNameChange={() => { }}
                        />
                    )}
                </div>

                {/* Team Contributions */}
                <TeamContributions match={match} />

                <div className="text-center pt-8">
                    <p className="text-xs text-muted-foreground">Powered by CricScorer</p>
                </div>
            </div>
        </main>
    );
}
