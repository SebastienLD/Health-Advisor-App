import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import configData from '../config.json';

// Initialize Firebase
const app = initializeApp(configData.FIREBASE_CONFIG);
export const db = getFirestore(app);
