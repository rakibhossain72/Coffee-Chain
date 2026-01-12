"use client"

import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { formatAddress } from "@/lib/utils"

export function WalletButton() {
  const { address, isConnected } = useAppKitAccount()
  const { open } = useAppKit()

  if (isConnected && address) {
    return (
      <button
        onClick={() => open()}
        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
      >
        {formatAddress(address)}
      </button>
    )
  }

  return (
    <button
      onClick={() => open()}
      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
    >
      Connect Wallet
    </button>
  )
}
