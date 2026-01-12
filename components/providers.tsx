"use client"

import type React from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Header } from "./header"

const queryClient = new QueryClient()

const config = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main className="min-h-screen">{children}</main>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
