"use client";

import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Share, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Idea, UserProfile } from '@/lib/types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface IdeaCardProps {
  idea: Idea;
  currentUser: UserProfile | null;
  deleteIdeaAction?: (id: string) => void;
  toggleMarketplaceAction?: (id: string, currentStatus: boolean) => void;
}

export function IdeaCard({ 
  idea, 
  currentUser, 
  deleteIdeaAction,
  toggleMarketplaceAction,
}: IdeaCardProps) {
  const isOwner = currentUser?.uid === idea.userId;
  const canManage = isOwner && deleteIdeaAction && toggleMarketplaceAction;

  return (
    <Card className="w-full break-inside-avoid-column animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={idea.userPhotoURL} alt={idea.userName ?? ''} />
              <AvatarFallback>{idea.userName?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{idea.userName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => toggleMarketplaceAction(idea.id, idea.isMarketplace)} 
                  className="cursor-pointer"
                >
                  <Share className="mr-2 h-4 w-4" />
                  <span>{idea.isMarketplace ? 'Remove from Marketplace' : 'Add to Marketplace'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteIdeaAction(idea.id)} 
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Idea</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90">{idea.text}</p>
        {idea.isMarketplace && (
            <Badge variant="secondary" className="mt-4">On Marketplace</Badge>
        )}
      </CardContent>
    </Card>
  );
}
