"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/providers/ToastProvider";

export function Providers({ children }) {
  return (
    <SessionProvider
      // Disable automatic session polling on window focus
      refetchOnWindowFocus={false}
      // Only refetch session every 5 minutes instead of constantly
      refetchInterval={5 * 60}>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
