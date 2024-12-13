// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getApps, getApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyAdEK7f0fzeMw8QFdBLc96DpBsU-32UINQ",
  authDomain: "recipeshare-1ce2b.firebaseapp.com",
  projectId: "recipeshare-1ce2b",
  storageBucket: "recipeshare-1ce2b.firebasestorage.app",
  messagingSenderId: "989591437999",
  appId: "1:989591437999:web:941f1a49648c4221ecca5a",
  measurementId: "G-1ZS86EZH2J"
};

// Initialize Firebase (singleton pattern)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export { db, addDoc, collection };

export { app };