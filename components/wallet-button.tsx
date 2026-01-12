"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { formatAddress } from "@/lib/utils"

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
      >
        {formatAddress(address)}
      </button>
    )
  }

  return (
    <button
      onClick={() =>
        connect({
          connector: injected(),
        })
      }
      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
    >
      Connect Wallet
    </button>
  )
}
