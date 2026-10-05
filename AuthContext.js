import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase";
import {
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

const ADMIN_EMAILS = ["mayankaditya0@gmail.com","adityashashank1989@gmail.com"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && u.email) {
        setIsAdmin(ADMIN_EMAILS.includes(u.email));
        await setDoc(doc(db, "users", u.uid), {
          email: u.email || null,
          displayName: u.displayName || "Guest",
          lastLogin: new Date().toISOString(),
        }, { merge: true });
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const loginAsGuest = () => signInAnonymously(auth);

  const logout = () => {
    setIsAdmin(false);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, loginWithGoogle, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
