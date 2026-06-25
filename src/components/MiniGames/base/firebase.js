// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { enableNetwork } from "firebase/firestore";


// const app = initializeApp(firebaseConfig);

console.log("🔥 Firebase config:");
console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("PROJECT ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

// export const db = getFirestore(app);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

enableNetwork(db)
  .then(() => console.log("🔥 FIRESTORE ONLINE"))
  .catch((e) => console.log("❌ FIRESTORE OFFLINE:", e));