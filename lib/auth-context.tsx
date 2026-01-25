'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);

            if (user) {
                // Sync user doc to Firestore in the background
                const syncUserDoc = async () => {
                    try {
                        const userDocRef = doc(db, 'users', user.uid);
                        const userDoc = await getDoc(userDocRef);

                        if (!userDoc.exists()) {
                            console.log('🔄 Creating new user record in Firestore for:', user.email);
                            await setDoc(userDocRef, {
                                uid: user.uid,
                                email: user.email,
                                displayName: user.displayName || 'Scorer',
                                photoURL: user.photoURL || null,
                                createdAt: serverTimestamp(),
                                lastLogin: serverTimestamp(),
                                status: 'active',
                                role: 'scorer',
                                provider: user.providerData[0]?.providerId || 'password'
                            });
                            console.log('✅ User record created successfully');
                        } else {
                            console.log('🔄 Updating last login for:', user.email);
                            await setDoc(userDocRef, {
                                lastLogin: serverTimestamp(),
                                displayName: user.displayName || userDoc.data().displayName, // Sync display name if changed
                                photoURL: user.photoURL || userDoc.data().photoURL
                            }, { merge: true });
                            console.log('✅ Last login updated');
                        }
                    } catch (err) {
                        console.error('❌ Failed to sync user doc to Firestore:', err);
                        console.error('Tip: Make sure your Firestore Security Rules are published.');
                    }
                };
                syncUserDoc();
            }
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, displayName: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });

        // Explicitly create user document and wait for it
        // This ensures the record exists in the 'users' collection immediately after signup
        await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            email: result.user.email,
            displayName: displayName,
            photoURL: result.user.photoURL || null,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            status: 'active',
            role: 'scorer'
        });
    };


    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
