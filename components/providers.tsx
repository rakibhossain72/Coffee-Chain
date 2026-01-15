import type React from "react";
import { Header } from "./header";
import ContextProvider from "@/context";
import { headers } from "next/headers";

export async function Providers({ children }: { children: React.ReactNode }) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");
  
  return (
    <ContextProvider cookies={cookies}>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
    </ContextProvider>
  );
}
