"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/providers/ToastProvider";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
