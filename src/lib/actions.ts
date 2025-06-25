
"use server";

import { revalidatePath } from "next/cache";
import { addDoc, collection, doc, deleteDoc, getDoc, query, where, getDocs, writeBatch, Timestamp, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import type { UserProfile, IdeaDocument } from "./types";

export async function postIdea(formData: { text: string }, user: UserProfile): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Please check your environment variables.");
  }
  
  if (!user) {
    throw new Error("You must be logged in to post an idea.");
  }

  const newIdea: Omit<IdeaDocument, "id"> = {
    text: formData.text,
    userId: user.uid,
    userName: user.displayName || "Anonymous",
    userPhotoURL: user.photoURL || "",
    createdAt: Timestamp.now(),
    isMarketplace: false,
  };

  try {
    const ideasCollection = collection(db, "ideas");
    await addDoc(ideasCollection, newIdea);
    revalidatePath("/");
  } catch (error) {
    console.error("Error posting idea: ", error);
    throw new Error("Failed to post idea to the database.");
  }
}

export async function deleteIdea(ideaId: string, userId: string) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Please check your environment variables.");
  }
  
   if (!userId) {
    throw new Error("You must be logged in to delete an idea.");
  }
  
  const ideaRef = doc(db, "ideas", ideaId);

  try {
    const ideaSnap = await getDoc(ideaRef);

    if (!ideaSnap.exists()) {
      console.log("Tried to delete an idea that doesn't exist. ID:", ideaId);
      revalidatePath("/");
      revalidatePath("/marketplace");
      return;
    }

    if (ideaSnap.data().userId !== userId) {
      throw new Error("You do not have permission to delete this idea.");
    }
    
    await deleteDoc(ideaRef);
    revalidatePath("/");
    revalidatePath("/marketplace");
  } catch (error) {
     console.error("Error deleting idea: ", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to delete idea from the database.");
  }
}

export async function addIdeaToMarketplace(ideaId: string, userId: string) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }
  if (!userId) {
    throw new Error("You must be logged in to perform this action.");
  }
  const ideaRef = doc(db, "ideas", ideaId);
  try {
    const ideaSnap = await getDoc(ideaRef);
    if (!ideaSnap.exists() || ideaSnap.data().userId !== userId) {
      throw new Error("You do not have permission to modify this idea.");
    }
    await updateDoc(ideaRef, { isMarketplace: true });
    revalidatePath("/");
    revalidatePath("/marketplace");
  } catch (error) {
    console.error("Error adding idea to marketplace: ", error);
    throw new Error("Failed to add idea to the marketplace.");
  }
}

export async function deleteUserIdeas(userId: string) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }

  const ideasRef = collection(db, "ideas");
  const q = query(ideasRef, where("userId", "==", userId));
  
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return;
    }
    
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    revalidatePath("/");
    revalidatePath("/marketplace");
  } catch (error) {
    console.error("Error deleting user ideas: ", error);
    throw new Error("Failed to delete user's ideas.");
  }
}
