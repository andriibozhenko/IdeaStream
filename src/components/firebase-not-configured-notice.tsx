import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function FirebaseNotConfiguredNotice() {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Action Required: Set Up Authentication</AlertTitle>
      <AlertDescription>
        <p>To enable user sign-up and login, you need to connect your Firebase project.</p>
        <p className="mt-2">
          Please copy your app's credentials from the Firebase console into the{' '}
          <code className="bg-destructive-foreground/20 px-1 py-0.5 rounded font-mono text-xs">.env.local</code>{' '}
          file. After saving, you may need to restart the development server.
        </p>
      </AlertDescription>
    </Alert>
  );
}
