"use client";

import { useAuth } from "@/lib/hooks/use-auth-client";
import type { Idea } from "@/lib/types";
import { IdeaList } from "@/components/idea-list";
import { Lightbulb, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collectionGroup, onSnapshot, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MarketplacePageContent() {
  const { user, loading: authLoading } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is a collection group query. It looks across all 'ideas' subcollections.
    const ideasGroup = collectionGroup(db, 'ideas');
    const q = query(
      ideasGroup,
      where('isMarketplace', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ideasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
      } as Idea));
      setIdeas(ideasData);
      setLoading(false);
    }, (error) => {
      console.error("Marketplace listener error:", error);
      // This is where you would handle the index creation link
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || authLoading) {
    return <div className="w-full h-40 mb-8 rounded-lg bg-muted animate-pulse"></div>;
  }

  // Logged-out users cannot see the marketplace
  if (!user) {
    return (
      <div className="text-center text-muted-foreground mt-16">
        <Lock className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Please log in to see the Marketplace.</h2>
        <p className="mt-2">Discover brilliant ideas shared by the community.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  // Logged-in users see the marketplace content
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ideas Marketplace</h1>
        <p className="text-muted-foreground">Discover brilliant ideas shared by the community.</p>
      </div>

      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[60vh]">
          <Lightbulb className="w-16 h-16 mb-4 text-yellow-400" />
          <h2 className="text-3xl font-semibold text-foreground mb-2">The Marketplace is Quiet</h2>
          <p className="mb-6">No ideas have been shared to the marketplace yet. When users add their ideas, they will appear here.</p>
        </div>
      ) : (
        <IdeaList ideas={ideas} currentUser={user} />
      )}
    </>
  );
}
