import type React from "react";
import { Header } from "./header";
import ContextProvider from "@/context";
import { headers } from "next/headers";

import { WalletWatcher } from "./wallet-watcher";

export async function Providers({ children }: { children: React.ReactNode }) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");
  
  return (
    <ContextProvider cookies={cookies}>
      <WalletWatcher />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
    </ContextProvider>
  );
}
