import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcgG930YQk7dG4vjPGPmzzNezTgfWXNtc",
  authDomain: "goeazymart-a60f4.firebaseapp.com",
  databaseURL: "https://goeazymart-a60f4-default-rtdb.firebaseio.com",
  projectId: "goeazymart-a60f4",
  storageBucket: "goeazymart-a60f4.firebasestorage.app",
  messagingSenderId: "96094580973",
  appId: "1:96094580973:web:86b281e385856dd6ed5ce4",
  measurementId: "G-NTE1GWQL4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;
