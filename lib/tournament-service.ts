import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Tournament {
    id?: string;
    userId: string;
    name: string;
    matchType: string; // T20, ODI, etc.
    teams: string[]; // Team names or IDs
    matchIds: string[];
    createdAt: Timestamp;
    status: 'active' | 'completed';
}

export interface Standings {
    teamName: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    points: number;
    nrr: number;
}

const COLLECTION_NAME = 'tournaments';

export async function createTournament(userId: string, name: string, teams: string[], matchType: string): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            userId,
            name,
            teams,
            matchType,
            matchIds: [],
            status: 'active',
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating tournament:', error);
        throw error;
    }
}

export async function getUserTournaments(userId: string): Promise<Tournament[]> {
    const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
}

export async function getTournament(id: string): Promise<Tournament | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } as Tournament : null;
}

export async function addMatchToTournament(tournamentId: string, matchId: string): Promise<void> {
    const tournament = await getTournament(tournamentId);
    if (tournament) {
        const newMatchIds = [...tournament.matchIds, matchId];
        await updateDoc(doc(db, COLLECTION_NAME, tournamentId), {
            matchIds: newMatchIds
        });
    }
}
