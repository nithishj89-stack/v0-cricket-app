import { getUserMatches, SavedMatch } from './match-service';

export interface PlayerStats {
    playerName: string;
    matches: number;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    highestScore: number;
    notOuts: number;
    wickets: number;
    runsConceded: number;
    oversBowled: number;
    ballsBowled: number;
    bestBowlingWickets: number;
    bestBowlingRuns: number;
}

export async function calculatePlayerStats(userId: string): Promise<PlayerStats[]> {
    const matches = await getUserMatches(userId);
    return aggregateStats(matches);
}

export async function getGlobalLeaderboard(): Promise<PlayerStats[]> {
    const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
    const { db } = await import('./firebase');

    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, orderBy('createdAt', 'desc'), limit(100)); // Last 100 matches for performance
    const snapshot = await getDocs(q);

    const matches: SavedMatch[] = [];
    snapshot.forEach(doc => {
        matches.push({ id: doc.id, ...doc.data() } as SavedMatch);
    });

    return aggregateStats(matches).slice(0, 50); // Top 50
}

function aggregateStats(matches: SavedMatch[]): PlayerStats[] {
    const statsMap = new Map<string, PlayerStats>();

    matches.forEach((match: SavedMatch) => {
        // Process Batsmen from Team A
        match.batsmenA?.forEach((b: any) => {
            updateBattingStats(statsMap, b);
        });
        // Process Batsmen from Team B
        match.batsmenB?.forEach((b: any) => {
            updateBattingStats(statsMap, b);
        });
        // Process Bowlers from Team A
        match.bowlersA?.forEach((b: any) => {
            updateBowlingStats(statsMap, b);
        });
        // Process Bowlers from Team B
        match.bowlersB?.forEach((b: any) => {
            updateBowlingStats(statsMap, b);
        });
    });

    return Array.from(statsMap.values()).sort((a, b) => b.runs - a.runs);
}


function updateBattingStats(statsMap: Map<string, PlayerStats>, batsman: any) {
    if (batsman.balls === 0) return; // Only count if they actually faced a ball or were at crease (usually balls > 0)

    let stats = statsMap.get(batsman.name);
    if (!stats) {
        stats = createEmptyStats(batsman.name);
        statsMap.set(batsman.name, stats);
    }

    stats.matches += 1;
    stats.runs += batsman.runs;
    stats.balls += batsman.balls;
    stats.fours += batsman.fours;
    stats.sixes += batsman.sixes;
    if (batsman.runs > stats.highestScore) {
        stats.highestScore = batsman.runs;
    }
    if (!batsman.isOut) {
        stats.notOuts += 1;
    }
}

function updateBowlingStats(statsMap: Map<string, PlayerStats>, bowler: any) {
    if (bowler.overs === 0 && bowler.balls === 0) return;

    let stats = statsMap.get(bowler.name);
    if (!stats) {
        stats = createEmptyStats(bowler.name);
        statsMap.set(bowler.name, stats);
    }

    // Only increment matches if not already incremented by batting
    // But wait, if they didn't bat but bowled, we should count as a match.
    // This logic is slightly flawed for "matches played" if not careful.
    // Simplified: if they appear as a bowler, and we haven't seen them as a batsman in THIS match, increment.
    // Actually, calculating stats grouped by name is easier.

    stats.wickets += bowler.wickets;
    stats.runsConceded += bowler.runs;
    stats.oversBowled += bowler.overs;
    stats.ballsBowled += bowler.balls;

    if (bowler.wickets > stats.bestBowlingWickets) {
        stats.bestBowlingWickets = bowler.wickets;
        stats.bestBowlingRuns = bowler.runs;
    } else if (bowler.wickets === stats.bestBowlingWickets) {
        if (bowler.runs < stats.bestBowlingRuns || stats.bestBowlingRuns === 0) {
            stats.bestBowlingRuns = bowler.runs;
        }
    }
}

function createEmptyStats(name: string): PlayerStats {
    return {
        playerName: name,
        matches: 0,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        highestScore: 0,
        notOuts: 0,
        wickets: 0,
        runsConceded: 0,
        oversBowled: 0,
        ballsBowled: 0,
        bestBowlingWickets: 0,
        bestBowlingRuns: 0,
    };
}
