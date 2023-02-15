import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7Swl2thOj7jIeGHUwGtnedC1GUFZU3uM",
  authDomain: "health-advisor-d978b.firebaseapp.com",
  projectId: "health-advisor-d978b",
  storageBucket: "health-advisor-d978b.appspot.com",
  messagingSenderId: "560598461369",
  appId: "1:560598461369:web:8b33d4367b5457e17e2468",
  measurementId: "G-XW2KTMZPBE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);