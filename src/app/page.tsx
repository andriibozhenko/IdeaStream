import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import type { Idea } from '@/lib/types';
import Header from '@/components/header';
import IdeasPageContent from '@/components/ideas-page-content';

async function getIdeas(): Promise<Idea[]> {
  if (!isFirebaseConfigured || !db) {
    console.log("Firebase not configured. Returning empty ideas array.");
    return [];
  }
  try {
    const ideasCol = collection(db, 'ideas');
    const q = query(ideasCol, orderBy('createdAt', 'desc'));
    const ideasSnapshot = await getDocs(q);
    const ideasList: Idea[] = ideasSnapshot.docs.map(doc => {
      const data = doc.data();
      // When using serverTimestamp(), the value can be null on the client
      // until the server has written the timestamp. We'll handle this case.
      if (!data.createdAt) {
        return null;
      }
      return {
        id: doc.id,
        text: data.text,
        userId: data.userId,
        userName: data.userName,
        userPhotoURL: data.userPhotoURL,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        isMarketplace: data.isMarketplace,
      };
    }).filter((idea): idea is Idea => idea !== null); // Filter out any nulls
    return ideasList;
  } catch (error) {
    console.error("Error fetching ideas: ", error);
    return [];
  }
}

export default async function Home() {
  const ideas = await getIdeas();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-1">
        <IdeasPageContent initialIdeas={ideas} />
      </main>
    </div>
  );
}
