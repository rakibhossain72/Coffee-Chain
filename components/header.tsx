"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-500" />
            <span className="text-sm font-semibold text-gray-900">Coffee Chain</span>
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            {isConnected && (
              <>
                <button onClick={() => router.push("/create")} className="text-sm text-gray-600 hover:text-gray-900">
                  Create Page
                </button>
                <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </button>
              </>
            )}
          </nav>

          {isConnected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => disconnect()}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
              >
                {formatAddress(address!)}
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: injected() })}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
