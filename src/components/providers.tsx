"use client";

import { AuthProvider } from "@/lib/hooks/use-auth-client";
import { type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 