
"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import type { Idea } from "@/lib/types";
import { IdeaList } from "@/components/idea-list";
import { Lightbulb } from "lucide-react";

interface MarketplacePageContentProps {
  initialIdeas: Idea[];
}

export default function MarketplacePageContent({ initialIdeas }: MarketplacePageContentProps) {
  const { user } = useAuth();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ideas Marketplace</h1>
        <p className="text-muted-foreground">Discover brilliant ideas shared by the community.</p>
      </div>

      {initialIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[60vh]">
          <Lightbulb className="w-16 h-16 mb-4 text-yellow-400" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">The Marketplace is Quiet</h2>
          <p className="mb-6">No ideas have been shared to the marketplace yet. Be the first!</p>
        </div>
      ) : (
        <IdeaList ideas={initialIdeas} currentUser={user} />
      )}
    </>
  );
}
