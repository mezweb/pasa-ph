import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// --- YOUR SPECIFIC CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyCkZViVOfYVQaHYuzkngzNpHNCFj1lTpu4",
  authDomain: "pasa-3eb3f.firebaseapp.com",
  projectId: "pasa-3eb3f",
  storageBucket: "pasa-3eb3f.firebasestorage.app",
  messagingSenderId: "328677831556",
  appId: "1:328677831556:web:95aab8e4f620f1c54463d1",
  measurementId: "G-DZFDHMNLX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services (Crucial for your app to work)
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics safely (only runs in browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };