'use client'
import * as React from "react";

// 1. import `HeroUIProvider` component
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  // 2. Wrap HeroUIProvider and SessionProvider at the root of your app
  return (
    <SessionProvider>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}