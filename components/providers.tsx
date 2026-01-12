"use client"

import type React from "react"
import { createAppKit } from "@reown/appkit"
import { EthereumAdapter } from "@reown/appkit-adapter-ethereum"
import { sepolia } from "@reown/appkit/networks"

// Create the AppKit instance
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

const metadata = {
  name: "Coffee Chain",
  description: "Support creators on the Ethereum blockchain",
  url: typeof window !== "undefined" ? window.location.origin : "",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

const networks = [sepolia]
const ethAdapter = new EthereumAdapter({ projectId })

createAppKit({
  adapters: [ethAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
})

import { Header } from "./header"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
