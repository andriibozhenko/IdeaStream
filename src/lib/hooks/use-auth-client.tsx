"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, writeBatch, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

// This interface now represents the final, merged user profile
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // User is logged in to Firebase Auth. Now, listen for changes to their Firestore document.
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            // Merge the auth profile and firestore profile. Firestore is the source of truth for name.
            const firestoreData = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firestoreData.displayName,
              photoURL: firebaseUser.photoURL,
            });
          } else {
             // Fallback to auth profile if firestore doc doesn't exist yet
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });
          }
          setLoading(false);
        });
        return () => unsubscribeFirestore(); // Cleanup Firestore listener
      } else {
        // User is logged out
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth(); // Cleanup Auth listener
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOutUser = async () => {
  await signOut(auth);
  window.location.href = '/login';
};

export const signUpWithEmailAndPassword = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // 1. Update the profile in Firebase Auth (for immediate use)
  await updateProfile(user, { displayName });

  // 2. Create the user document in Firestore, which will be the permanent source of truth
  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
    uid: user.uid,
    email: user.email,
    displayName: displayName,
    photoURL: user.photoURL || null,
  });

  return userCredential;
};

export { signInWithEmailAndPassword };

async function deleteUserIdeas(userId: string) {
  const ideasRef = collection(db, "users", userId, "ideas");
  const querySnapshot = await getDocs(ideasRef);
  
  if (querySnapshot.empty) return;
  
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
}

export const deleteAccount = async () => {
  if (!auth.currentUser) {
    throw new Error("You must be logged in to delete your account.");
  }
  
  const user = auth.currentUser;
  
  try {
    await deleteUserIdeas(user.uid);
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
  } catch (error: any) {
    console.error("Error deleting account:", error);
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('This operation requires you to have signed in recently. Please log out and log back in to continue.');
    }
    throw new Error(error.message || "Failed to delete account. Please try again.");
  }
}; 