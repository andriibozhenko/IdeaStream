import { db } from '@/lib/database';
import type { Idea } from '@/lib/types';
import Header from '@/components/header';
import MarketplacePageContent from '@/components/marketplace-page-content';

async function getMarketplaceIdeas(): Promise<Idea[]> {
  try {
    return db.ideas.findMarketplace();
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
      <main className="container mx-auto flex-1 p-4 md:p-8">
        <MarketplacePageContent initialIdeas={ideas} />
      </main>
    </div>
  );
}
