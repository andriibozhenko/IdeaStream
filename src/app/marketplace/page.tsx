import { collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import type { Idea } from '@/lib/types';
import Header from '@/components/header';
import MarketplacePageContent from '@/components/marketplace-page-content';

async function getMarketplaceIdeas(): Promise<Idea[]> {
  if (!isFirebaseConfigured || !db) {
    console.log("Firebase not configured. Returning empty ideas array.");
    return [];
  }
  try {
    const ideasCol = collection(db, 'ideas');
    const q = query(
      ideasCol, 
      where('isMarketplace', '==', true), 
      orderBy('createdAt', 'desc')
    );
    const ideasSnapshot = await getDocs(q);
    const ideasList: Idea[] = ideasSnapshot.docs.map(doc => {
      const data = doc.data();
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
    }).filter((idea): idea is Idea => idea !== null);
    return ideasList;
  } catch (error) {
    console.error("Error fetching marketplace ideas: ", error);
    return [];
  }
}

export default async function MarketplacePage() {
  const ideas = await getMarketplaceIdeas();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-1">
        <MarketplacePageContent initialIdeas={ideas} />
      </main>
    </div>
  );
}
