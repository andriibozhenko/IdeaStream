
"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import type { Idea, UserProfile } from "@/lib/types";
import { IdeaForm } from "@/components/idea-form";
import { IdeaList } from "@/components/idea-list";
import { isFirebaseConfigured } from "@/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Lightbulb, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { postIdea, deleteIdea, addIdeaToMarketplace } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface IdeasPageContentProps {
  initialIdeas: Idea[];
}

export default function IdeasPageContent({ initialIdeas }: IdeasPageContentProps) {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const authUnavailable = !isFirebaseConfigured;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);

  useEffect(() => {
    setIdeas(initialIdeas);
  }, [initialIdeas]);

  async function handlePostIdea(formData: { text: string }, user: UserProfile) {
    if (!user) return;

    setDialogOpen(false);
    const optimisticId = `optimistic-${Date.now()}`;
    const newOptimisticIdea: Idea = {
      id: optimisticId,
      text: formData.text,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userPhotoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      isMarketplace: false,
    };

    setIdeas(currentIdeas => [newOptimisticIdea, ...currentIdeas]);
    
    try {
      await postIdea(formData, user);
      toast({
        title: "Success!",
        description: "Your brilliant idea has been shared.",
      });
    } catch (error) {
       toast({
        title: "Error",
        description: "Could not post your idea. Please try again.",
        variant: "destructive",
      });
      setIdeas(currentIdeas => currentIdeas.filter(idea => idea.id !== optimisticId));
    }
  }

  async function handleDeleteIdea(ideaId: string) {
    if (!user) return; 
    
    const previousIdeas = ideas;
    setIdeas(currentIdeas => currentIdeas.filter(idea => idea.id !== ideaId));

    try {
      await deleteIdea(ideaId, user.uid);
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
      setIdeas(previousIdeas);
    }
  }

  async function handleAddIdeaToMarketplace(ideaId: string) {
    if (!user) return;

    const previousIdeas = ideas;
    setIdeas(currentIdeas =>
      currentIdeas.map(idea =>
        idea.id === ideaId ? { ...idea, isMarketplace: true } : idea
      )
    );

    try {
      await addIdeaToMarketplace(ideaId, user.uid);
      toast({
        title: "Published!",
        description: "Your idea is now live on the Marketplace.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not add to marketplace.",
        variant: "destructive",
      });
      setIdeas(previousIdeas);
    }
  }


  const ideaDialog = (user: UserProfile, trigger: React.ReactNode) => (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What's on your mind, {user.displayName?.split(' ')[0] ?? 'friend'}?</DialogTitle>
        </DialogHeader>
        <IdeaForm 
            user={user} 
            postIdeaAction={handlePostIdea}
        />
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return <div className="w-full h-40 mb-8 rounded-lg bg-muted animate-pulse"></div>;
  }

  if (user) {
    if (ideas.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[60vh]">
            <Lightbulb className="w-16 h-16 mb-4 text-yellow-400" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your mind is a blank canvas</h2>
            <p className="mb-6">Click the button below to share your first brilliant thought.</p>
            {ideaDialog(user, 
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
           {ideaDialog(user, 
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
          addIdeaToMarketplaceAction={handleAddIdeaToMarketplace}
        />
      </>
    );
  }
  
  return (
    <>
      {authUnavailable && (
         <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Welcome to IdeaStream!</AlertTitle>
          <AlertDescription>
            <p>Authentication is not configured, so you are in offline mode.</p>
            <p className="mt-2">To post and share ideas, please configure your Firebase credentials in the <code className="bg-destructive-foreground/20 px-1 py-0.5 rounded font-mono text-xs">.env.local</code> file.</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="text-center text-muted-foreground mt-16">
        <h2 className="text-2xl font-semibold">Please log in to see and share ideas.</h2>
        <p className="mt-2">Your next great idea is just a click away!</p>
      </div>
    </>
  );
}
