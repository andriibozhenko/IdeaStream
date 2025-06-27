"use client";

import { useAuth } from "@/lib/hooks/use-auth-client";
import type { Idea } from "@/lib/types";
import { IdeaForm } from "@/components/idea-form";
import { IdeaList } from "@/components/idea-list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lightbulb, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection, Timestamp, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function IdeasPageContent() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // --- DEBUGGING STEP ---
  console.log("IdeasPageContent: Current user object:", user);

  useEffect(() => {
    if (!user) {
      console.log("IdeasPageContent: No user logged in, clearing ideas.");
      setIdeas([]);
      return;
    }

    // --- DEBUGGING STEP ---
    console.log("IdeasPageContent: Setting up listener for user UID:", user.uid);

    // New path: users/{userId}/ideas
    const ideasCollection = collection(db, 'users', user.uid, 'ideas');
    const q = query(ideasCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // --- DEBUGGING STEP ---
      console.log(`IdeasPageContent: Snapshot received. Found ${querySnapshot.docs.length} documents.`);

      const ideasData: Idea[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
      } as Idea));
      
      console.log("IdeasPageContent: Parsed ideas data:", ideasData);
      setIdeas(ideasData);
    }, (error) => {
        // --- DEBUGGING STEP ---
        console.error("IdeasPageContent: Firestore listener error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  async function handlePostIdea(formData: { text: string }) {
    if (!user) return;
    setDialogOpen(false);    
    try {
      const newIdeaForDb = {
        text: formData.text,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhotoURL: user.photoURL || "",
        createdAt: Timestamp.now(),
        isMarketplace: false,
      };
      // New path: users/{userId}/ideas
      const ideasCollection = collection(db, "users", user.uid, "ideas");
      await addDoc(ideasCollection, newIdeaForDb);
      toast({
        title: "Success!",
        description: "Your brilliant idea has been shared.",
      });
    } catch (error) {
       console.error("Error posting idea:", error);
       toast({
        title: "Error",
        description: "Could not post your idea. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteIdea(ideaId: string) {
    if (!user) return; 
    try {
      // New path: users/{userId}/ideas/{ideaId}
      const ideaRef = doc(db, "users", user.uid, "ideas", ideaId);
      await deleteDoc(ideaRef);
      toast({
        title: "Success",
        description: "Your idea has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not delete idea.",
        variant: "destructive",
      });
    }
  }

  async function handleToggleMarketplace(ideaId: string, currentStatus: boolean) {
    if (!user) return;
    try {
      // New path: users/{userId}/ideas/{ideaId}
      const ideaRef = doc(db, "users", user.uid, "ideas", ideaId);
      await updateDoc(ideaRef, { isMarketplace: !currentStatus });
      toast({
        title: !currentStatus ? "Published!" : "Removed from Marketplace",
        description: !currentStatus 
          ? "Your idea is now live on the Marketplace." 
          : "Your idea has been removed from the Marketplace.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not update marketplace status.",
        variant: "destructive",
      });
    }
  }

  const ideaDialog = (trigger: React.ReactNode) => (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What's on your mind, {user?.displayName?.split(' ')[0] ?? 'friend'}?</DialogTitle>
        </DialogHeader>
        <IdeaForm postIdeaAction={handlePostIdea} />
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return <div className="w-full h-40 mb-8 rounded-lg bg-muted animate-pulse"></div>;
  }

  if (user) {
    if (ideas.length === 0 && !loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[60vh]">
            <Lightbulb className="w-16 h-16 mb-4 text-yellow-400" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your mind is a blank canvas</h2>
            <p className="mb-6">Click the button below to share your first brilliant thought.</p>
            {ideaDialog( 
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Idea
              </Button>
            )}
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Ideas</h1>
           {ideaDialog(
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Idea
              </Button>
            )}
        </div>
        <IdeaList 
          ideas={ideas} 
          currentUser={user} 
          deleteIdeaAction={handleDeleteIdea}
          toggleMarketplaceAction={handleToggleMarketplace}
        />
      </>
    );
  }
  
  return (
    <div className="text-center text-muted-foreground mt-16">
      <h2 className="text-2xl font-semibold">Please log in to see and share ideas.</h2>
      <p className="mt-2">Your next great idea is just a click away!</p>
    </div>
  );
}
