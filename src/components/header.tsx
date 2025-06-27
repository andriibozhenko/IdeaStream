"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth, signOutUser, deleteAccount } from "@/lib/hooks/use-auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { LogIn, LogOut, PenSquare, UserX, Menu } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode, className?: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={cn(
          "text-sm font-medium",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

export default function Header() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({ title: "Error", description: "Could not sign out.", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently removed.",
      });
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <PenSquare className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold font-headline">IdeaStream</h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2 ml-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/marketplace">Marketplace</NavLink>
          </nav>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
             {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center">
              {loading ? (
                <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                        <AvatarFallback>
                          {user.displayName?.charAt(0).toUpperCase() ?? 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      <span>Delete Profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" passHref>
                  <Button>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Mobile Burger Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                    <nav className="flex flex-col gap-4 mt-8">
                      <SheetClose asChild>
                        <NavLink href="/" className="text-lg">Home</NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink href="/marketplace" className="text-lg">Marketplace</NavLink>
                      </SheetClose>
                       <div className="pt-4 border-t">
                        {user ? (
                           <>
                            <div className="flex items-center gap-2 mb-4">
                               <Avatar className="h-9 w-9">
                                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                                <AvatarFallback>
                                  {user.displayName?.charAt(0).toUpperCase() ?? 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                 <span className="font-semibold">{user.displayName}</span>
                                 <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </div>
                            <SheetClose asChild>
                              <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start">
                                 <LogOut className="mr-2 h-4 w-4" />
                                 Log out
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                               <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="w-full justify-start mt-2">
                                  <UserX className="mr-2 h-4 w-4" />
                                  Delete Profile
                               </Button>
                            </SheetClose>
                           </>
                        ) : (
                           <SheetClose asChild>
                             <Link href="/login" passHref>
                              <Button className="w-full">
                                <LogIn className="mr-2 h-4 w-4" />
                                Login
                              </Button>
                            </Link>
                           </SheetClose>
                        )}
                       </div>
                    </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your ideas from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Yes, delete account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}