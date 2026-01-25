import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for cricscorer-0
const firebaseConfig = {
    apiKey: "AIzaSyCo5OvR-zFDhHCVuMv3ATRyatpjehWdoaw",
    authDomain: "cricscorer-0.firebaseapp.com",
    projectId: "cricscorer-0",
    storageBucket: "cricscorer-0.firebasestorage.app",
    messagingSenderId: "963302021738",
    appId: "1:963302021738:web:80b9266e827f704f220813"
};

// Initialize Firebase (prevent multiple initializations)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
