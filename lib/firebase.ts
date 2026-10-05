// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "cv-builder-d6e44.firebaseapp.com",
  projectId: "cv-builder-d6e44",
  storageBucket: "cv-builder-d6e44.firebasestorage.app",
  messagingSenderId: "732663846990",
  appId: "1:732663846990:web:800ae3882685683111cb1f",
  measurementId: "G-SW0CQZTLJG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
