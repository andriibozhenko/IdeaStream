
"use client";

import { IdeaCard } from "@/components/idea-card";
import type { Idea, UserProfile } from "@/lib/types";

interface IdeaListProps {
  ideas: Idea[];
  currentUser: UserProfile | null;
  deleteIdeaAction?: (id: string) => void;
  addIdeaToMarketplaceAction?: (id: string) => void;
}

export function IdeaList({ ideas, currentUser, deleteIdeaAction, addIdeaToMarketplaceAction }: IdeaListProps) {
  return (
    <div className="w-full column-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {ideas.map((idea) => (
        <IdeaCard 
          key={idea.id} 
          idea={idea} 
          currentUser={currentUser} 
          deleteIdeaAction={deleteIdeaAction}
          addIdeaToMarketplaceAction={addIdeaToMarketplaceAction} 
        />
      ))}
    </div>
  );
}
