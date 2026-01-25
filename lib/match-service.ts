import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
    doc,
    deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface SavedMatch {
    id?: string;
    userId: string;
    tournamentId?: string;
    date: string;
    time: string;
    teamAName: string;
    teamBName: string;
    teamAScore: number;
    teamAWickets: number;
    teamAOvers: string;
    teamBScore: number;
    teamBWickets: number;
    teamBOvers: string;
    winner: string;
    manOfMatch: string;
    totalOvers: number;
    batsmenA: any[];
    batsmenB: any[];
    bowlersA: any[];
    bowlersB: any[];
    inning1Timeline?: any[];
    inning2Timeline?: any[];
    createdAt: Timestamp;
}

export interface MatchData {
    tournamentId?: string;
    date: string;
    time: string;
    teamAName: string;
    teamBName: string;
    teamAScore: number;
    teamAWickets: number;
    teamAOvers: string;
    teamBScore: number;
    teamBWickets: number;
    teamBOvers: string;
    winner: string;
    manOfMatch: string;
    totalOvers: number;
    batsmenA: any[];
    batsmenB: any[];
    bowlersA: any[];
    bowlersB: any[];
    inning1Timeline?: any[];
    inning2Timeline?: any[];
}

// Save a completed match to Firestore
export async function saveMatch(userId: string, matchData: MatchData): Promise<string> {
    try {
        const matchesRef = collection(db, 'matches');

        // Remove undefined values to satisfy Firestore
        const sanitizedMatchData = JSON.parse(JSON.stringify(matchData));

        const docRef = await addDoc(matchesRef, {
            ...sanitizedMatchData,
            userId: userId,
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving match:', error);
        throw error;
    }
}

// Get all matches for a user
export async function getUserMatches(userId: string): Promise<SavedMatch[]> {
    try {
        const matchesRef = collection(db, 'matches');
        const q = query(
            matchesRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const matches: SavedMatch[] = [];

        querySnapshot.forEach((doc) => {
            matches.push({
                id: doc.id,
                ...doc.data()
            } as SavedMatch);
        });

        return matches;
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
}

// Delete a match
export async function deleteMatch(matchId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'matches', matchId));
    } catch (error) {
        console.error('Error deleting match:', error);
        throw error;
    }
}
