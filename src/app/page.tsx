import { db } from '@/lib/database';
import type { Idea } from '@/lib/types';
import Header from '@/components/header';
import IdeasPageContent from '@/components/ideas-page-content';
import { getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await getCurrentUser();
  // Fetch ideas only for the logged-in user. If no user, ideas will be empty.
  const ideas = user ? db.ideas.findByUserId(user.id) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex-1 p-4 md:p-8">
        <IdeasPageContent initialIdeas={ideas} />
      </main>
    </div>
  );
}
