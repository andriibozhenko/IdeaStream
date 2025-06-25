import type { Timestamp } from 'firebase/firestore';

// The type as it is in Firestore
export interface IdeaDocument {
  text: string;
  userId: string;
  userName: string;
  userPhotoURL: string;
  createdAt: Timestamp;
  isMarketplace?: boolean;
}

// The type after being fetched and serialized for the client
export interface Idea extends Omit<IdeaDocument, 'createdAt'> {
  id: string;
  createdAt: string; // ISO string
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
