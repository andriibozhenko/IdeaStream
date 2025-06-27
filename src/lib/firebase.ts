import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The secret keys are now written directly into the code.
// This bypasses the file-reading problem.
const firebaseConfig = {
  apiKey: "AIzaSyBV-uoC_HCFHitEyMj4iA3zIxCwaNFTC-E",
  authDomain: "ideastream-f1eb3.firebaseapp.com",
  projectId: "ideastream-f1eb3",
  storageBucket: "ideastream-f1eb3.appspot.com",
  messagingSenderId: "897453024742",
  appId: "1:897453024742:web:6d56a4106c718cdeb92227"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };