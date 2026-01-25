'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getUserMatches, deleteMatch, SavedMatch } from '@/lib/match-service';
import MatchResults from '@/components/cricket/MatchResults';

export default function HistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [matches, setMatches] = useState<SavedMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<SavedMatch | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        async function fetchMatches() {
            if (user) {
                try {
                    const userMatches = await getUserMatches(user.uid);
                    setMatches(userMatches);
                } catch (err: any) {
                    setError('Failed to load match history');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        }

        if (user) {
            fetchMatches();
        }
    }, [user]);

    const handleDelete = async (matchId: string) => {
        if (!confirm('Are you sure you want to delete this match?')) return;

        setDeletingId(matchId);
        try {
            await deleteMatch(matchId);
            setMatches(prev => prev.filter(m => m.id !== matchId));
        } catch (err) {
            setError('Failed to delete match');
        } finally {
            setDeletingId(null);
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                    <p className="text-muted-foreground">Loading your matches...</p>
                </div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Match History</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, <span className="text-primary">{user.displayName || user.email}</span>
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        New Match
                    </Link>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Matches Grid */}
                {matches.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">No matches yet</h2>
                        <p className="text-muted-foreground mb-6">Start your first match to see your history here!</p>
                        <Link
                            href="/"
                            className="inline-flex px-6 py-3 bg-gradient-to-r from-primary to-green-400 text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                        >
                            Start a Match
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {matches.map((match) => (
                            <div
                                key={match.id}
                                className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group"
                            >
                                {/* Match Date */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-muted-foreground">{match.date}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${match.winner === match.teamAName
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-secondary/20 text-secondary'
                                        }`}>
                                        {match.winner} Won
                                    </span>
                                </div>

                                {/* Teams */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground">{match.teamAName}</span>
                                        <span className="text-lg font-bold text-primary">
                                            {match.teamAScore}/{match.teamAWickets}
                                            <span className="text-sm text-muted-foreground ml-1">({match.teamAOvers})</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground">{match.teamBName}</span>
                                        <span className="text-lg font-bold text-secondary">
                                            {match.teamBScore}/{match.teamBWickets}
                                            <span className="text-sm text-muted-foreground ml-1">({match.teamBOvers})</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Man of Match */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border pt-3">
                                    <span>MoM: <span className="text-foreground font-medium">{match.manOfMatch}</span></span>
                                </div>

                                {/* View Scorecard Button */}
                                <button
                                    onClick={() => setSelectedMatch(match)}
                                    className="mt-4 w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-bold transition-all"
                                >
                                    View Scorecard
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => match.id && handleDelete(match.id)}
                                    disabled={deletingId === match.id}
                                    className="mt-3 w-full py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    {deletingId === match.id ? 'Deleting...' : 'Delete Match'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Scorecard Modal */}
            {selectedMatch && (
                <MatchResults
                    show={true}
                    teamAName={selectedMatch.teamAName}
                    teamBName={selectedMatch.teamBName}
                    teamAScore={selectedMatch.teamAScore}
                    teamAWickets={selectedMatch.teamAWickets}
                    teamBScore={selectedMatch.teamBScore}
                    teamBWickets={selectedMatch.teamBWickets}
                    winner={selectedMatch.winner}
                    winType={`${selectedMatch.winner} won by ${selectedMatch.winner === selectedMatch.teamAName
                            ? (selectedMatch.teamAScore - selectedMatch.teamBScore) + " runs"
                            : (10 - selectedMatch.teamBWickets) + " wickets"
                        }`}
                    manOfMatch={selectedMatch.manOfMatch}
                    target={selectedMatch.teamAScore + 1}
                    batsmenA={selectedMatch.batsmenA || []}
                    batsmenB={selectedMatch.batsmenB || []}
                    bowlersA={selectedMatch.bowlersA || []}
                    bowlersB={selectedMatch.bowlersB || []}
                    onNewMatch={() => setSelectedMatch(null)} // Reusing this prop to close the modal
                />
            )}
        </main>
    );
}
