'use client'

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: 'Coffee Chain',
  description: 'Support creators on the Ethereum blockchain with direct ETH tips.',
  url: 'https://coffeechain.eth', // Updated to match project brand
  icons: ['https://coffeechain.eth/icon.svg']
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: 'light',
  features: {
    analytics: true, // Optional but recommended
    email: false, // Keep it Web3 native
    socials: ['google', 'x', 'github', 'discord'],
    emailShowWallets: true,
  },
  themeVariables: {
    '--w3m-accent': '#f97316', // Orange-500
    '--w3m-color-mix': '#f97316',
    '--w3m-color-mix-strength': 5,
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-z-index': 9999
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider