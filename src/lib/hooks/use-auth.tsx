"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";
import { deleteUserIdeas } from "@/lib/actions";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const signInWithGoogle = () => {
  if (!isFirebaseConfigured || !auth) {
    const error = new Error("auth/configuration-not-found");
    return Promise.reject(error);
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOutUser = () => {
  if (!isFirebaseConfigured || !auth) {
    const error = new Error("Firebase is not configured. Cannot sign out.");
    return Promise.reject(error);
  }
  return signOut(auth);
};

export const signUpWithEmailAndPassword = async (email: string, password: string, displayName: string) => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("auth/configuration-not-found");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  await userCredential.user.reload();
  return userCredential;
};

export const signInWithEmailAndPassword = (email: string, password: string) => {
  if (!isFirebaseConfigured || !auth) {
    const error = new Error("auth/configuration-not-found");
    return Promise.reject(error);
  }
  return firebaseSignInWithEmailAndPassword(auth, email, password);
};

export const deleteAccount = async () => {
  if (!isFirebaseConfigured || !auth || !auth.currentUser) {
    throw new Error("You must be logged in to delete your account.");
  }
  
  const user = auth.currentUser;
  
  try {
    await deleteUserIdeas(user.uid);
    await deleteUser(user);
  } catch (error: any) {
    console.error("Error deleting account:", error);
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('This operation requires you to have signed in recently. Please log out and log back in to continue.');
    }
    throw new Error(error.message || "Failed to delete account. Please try again.");
  }
};
