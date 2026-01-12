"use client"

import { useConnection, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { formatAddress } from "@/lib/utils"

export function WalletButton() {
  const { address, isConnected } = useConnection()
  const connect = useConnect()

  if (isConnected && address) {
    return (
      <button
        onClick={() => connect.reset()}
        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
      >
        {formatAddress(address)}
      </button>
    )
  }

  return (
    <button
      onClick={() =>
        connect.mutate({
          connector: injected(),
        })
      }
      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
    >
      Connect Wallet
    </button>
  )
}
