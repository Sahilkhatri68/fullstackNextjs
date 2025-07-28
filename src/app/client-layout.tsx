"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

// Client-side layout wrapper with session provider
export default function ClientLayout({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
} 