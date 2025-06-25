"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  signInWithGoogle, 
  signUpWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "@/lib/hooks/use-auth";
import { PenSquare } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { FirebaseNotConfiguredNotice } from "@/components/firebase-not-configured-notice";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props} xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-5.82 0-9.92-4.59-9.92-10.18s4.1-10.18 9.92-10.18c2.9 0 4.96 1.14 6.56 2.64l2.4-2.29C20.44 1.63 17.38 0 12.48 0 5.82 0 .25 5.42.25 12.08s5.57 12.08 12.23 12.08c3.23 0 5.74-1.04 7.64-2.93 2-1.94 2.62-4.82 2.62-8.32 0-.67-.06-1.22-.16-1.92h-9.9z"/></svg>
);

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const authUnavailable = !isFirebaseConfigured;

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
      toast({ title: "Success", description: "You are now logged in." });
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Failed to sign in with Google.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "The sign-in window was closed before completing."
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Google Sign-In is not enabled. Please enable it in your Firebase project's Authentication settings."
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(values.email, values.password);
      router.push('/');
      toast({ title: "Success", description: "You are now logged in." });
    } catch (error: any) {
      console.error(error);
      let errorMessage = "An unknown error occurred.";
      if (error.code === "auth/invalid-credential") {
          errorMessage = "Invalid email or password. Please try again."
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Email/Password Sign-In is not enabled. Please enable it in your Firebase project's Authentication settings."
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      await signUpWithEmailAndPassword(values.email, values.password, values.name);
      router.push('/');
      toast({ title: "Success", description: "Your account has been created and you are logged in." });
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Could not create account.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Please try logging in.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Email/Password Sign-Up is not enabled. Please enable it in your Firebase project's Authentication settings.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const anyLoading = isLoading || isGoogleLoading;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
          <PenSquare className="h-6 w-6" />
          <span className="text-2xl font-bold font-headline text-foreground">IdeaStream</span>
        </Link>
      </div>
      <div className="w-full max-w-sm">
        {authUnavailable && <FirebaseNotConfiguredNotice />}
        <Card>
          {isLoginView ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} key="login">
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} disabled={anyLoading || authUnavailable} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} disabled={anyLoading || authUnavailable} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={anyLoading || authUnavailable}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          ) : (
            <Form {...signupForm}>
               <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} key="signup">
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Enter your details below to get started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} disabled={anyLoading || authUnavailable} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} disabled={anyLoading || authUnavailable} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} disabled={anyLoading || authUnavailable} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={anyLoading || authUnavailable}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </CardFooter>
               </form>
            </Form>
          )}
        </Card>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
          </span>
          <button 
              onClick={() => setIsLoginView(!isLoginView)} 
              disabled={anyLoading || authUnavailable}
              className="font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
            >
              {isLoginView ? "Sign Up" : "Login"}
          </button>
        </div>

        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>
        <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignIn} 
            disabled={anyLoading || authUnavailable}>
            <GoogleIcon className="mr-2 h-4 w-4" /> 
            {isGoogleLoading ? "Redirecting..." : "Sign in with Google"}
        </Button>
      </div>
    </div>
  );
}
