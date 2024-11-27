// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyDY2NWfnj1N836rQPtOrZNzXlnIPUDXr_4",
    authDomain: "partnership-for-miami.firebaseapp.com",
    projectId: "partnership-for-miami",
    storageBucket: "partnership-for-miami.firebasestorage.app",
    messagingSenderId: "1071436461565",
    appId: "1:1071436461565:web:1c0a64ce773516d3735594"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);