import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Player {
    id: number;
    name: string;
    role: string;
}

export interface Team {
    id?: string;
    userId: string;
    name: string;
    players: Player[];
    createdAt?: Timestamp;
}

const COLLECTION_NAME = 'teams';

// Save a new team
export async function saveTeam(userId: string, teamData: Omit<Team, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
        const teamsRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(teamsRef, {
            ...teamData,
            userId,
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving team:', error);
        throw error;
    }
}

// Get all teams for a user
export async function getUserTeams(userId: string): Promise<Team[]> {
    try {
        const teamsRef = collection(db, COLLECTION_NAME);
        const q = query(teamsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const teams: Team[] = [];
        querySnapshot.forEach((doc) => {
            teams.push({
                id: doc.id,
                ...doc.data()
            } as Team);
        });

        return teams.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
}

// Update an existing team
export async function updateTeam(teamId: string, teamData: Partial<Team>): Promise<void> {
    try {
        const teamRef = doc(db, COLLECTION_NAME, teamId);
        await updateDoc(teamRef, teamData);
    } catch (error) {
        console.error('Error updating team:', error);
        throw error;
    }
}

// Delete a team
export async function deleteTeam(teamId: string): Promise<void> {
    try {
        const teamRef = doc(db, COLLECTION_NAME, teamId);
        await deleteDoc(teamRef);
    } catch (error) {
        console.error('Error deleting team:', error);
        throw error;
    }
}
