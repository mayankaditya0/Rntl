import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDb8tqOmCE0lloYu0Nrz1FiLPXdHVunaIE",
  authDomain: "rntl-house.firebaseapp.com",
  projectId: "rntl-house",
  storageBucket: "rntl-house.firebasestorage.app",
  messagingSenderId: "24924590080",
  appId: "1:24924590080:web:fc1174c6094d25125a08e5",
  measurementId: "G-T7BKSKJP10",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export default app;
