"use client";

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';

const envVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

export default function FirebaseConfigWarning() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-6 w-6 text-destructive" />
              Firebase Configuration Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This application requires Firebase credentials to run. It seems they are
              missing or are still using the default placeholder values.
            </p>
            <p>
              Please open the <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file
              in the root of your project and add your configuration values from the
              Firebase project console:
            </p>
            <Alert variant="default" className="bg-muted/50">
                <AlertTitle>Required Environment Variables</AlertTitle>
                <AlertDescription>
                    <pre className="text-sm font-mono overflow-x-auto">
                        {envVars.map(v => `${v}="..."`).join('\n')}
                    </pre>
                </AlertDescription>
            </Alert>
            <p>
              You can find these values in your Firebase project settings under:
              <br />
              <span className="font-semibold">Project settings &gt; General &gt; Your apps &gt; Web app &gt; Firebase SDK snippet &gt; Config</span>
            </p>
             <p className="text-sm text-muted-foreground">
              After updating the <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file, you may need to restart the development server for the changes to take effect.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
