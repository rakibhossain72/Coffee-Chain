"use client"

import { useEffect, useState } from "react"
import { useAccount, useReadContract } from "wagmi"
import { useRouter } from "next/navigation"
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAINLINK_ETH_USD_ADDRESS, CHAINLINK_ABI } from "@/lib/contract"
import { WithdrawButton } from "@/components/withdraw-button"
import { EditProfileForm } from "@/components/edit-profile-form"
import { formatAddress } from "@/lib/utils"
import { AccessRestrictionModal } from "@/components/access-restriction-modal"



export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [memos, setMemos] = useState<any[]>([])
  const [page, setPage] = useState(0)

  const { data: creatorData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getCreator",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getCreatorBalance",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: memoCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getMemoCount",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: memosData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getMemosPaginated",
    args: address ? [address, BigInt(page * 10), BigInt(10)] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: priceData } = useReadContract({
    address: CHAINLINK_ETH_USD_ADDRESS,
    abi: CHAINLINK_ABI,
    functionName: "latestRoundData",
  })

  const ethPrice = priceData ? Number((priceData as any)[1]) / 1e8 : 0

  useEffect(() => {
    // Access control is handled via conditional rendering
    if (creatorData?.name) {
      setCreator({
        username: creatorData.name,
        about: creatorData.about,
        totalReceived: creatorData.totalReceived,
        address: address,
      })
      setLoading(false)
    } else if (address && !loading) {
      // Creator not registered
      setLoading(false)
    }
  }, [creatorData, address, router, loading])

  useEffect(() => {
    if (memosData) {
      setMemos([...memosData])
    }
  }, [memosData])

  if (!isConnected) {
    return <AccessRestrictionModal type="no-wallet" />
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!creator && !loading) {
    return <AccessRestrictionModal type="not-creator" />
  }

  const balanceETH = Number(balance || 0) / 1e18
  const balanceUSD = balanceETH * ethPrice
  const totalReceivedETH = Number(creator.totalReceived || 0) / 1e18

  const totalReceivedUSD = totalReceivedETH * ethPrice

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your creator page and withdrawals</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        {/* Total Received */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Received</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalReceivedETH.toFixed(4)} ETH</p>
          <p className="mt-1 text-xs text-gray-500">${totalReceivedUSD.toFixed(2)}</p>
        </div>

        {/* Withdrawable Balance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Withdrawable Balance</p>
          <p className="mt-2 text-2xl font-bold text-orange-600">{balanceETH.toFixed(4)} ETH</p>
          <p className="mt-1 text-xs text-gray-500">${balanceUSD.toFixed(2)}</p>
        </div>

        {/* Total Supporters */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Supporters</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{Number(memoCount || 0)}</p>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Withdraw Funds</h3>
        <p className="mb-4 text-sm text-gray-600">
          Withdraw your balance to your wallet. Your address: {formatAddress(address)}
        </p>
        <WithdrawButton balance={BigInt(balance || 0)} />
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Edit Profile */}
        <div className="lg:col-span-1">
          <EditProfileForm creator={creator} />
        </div>

        {/* Supports List */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Recent Supports</h3>
          {memos.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-gray-600">No supports yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {memos.map((memo, index) => (
                <div key={`${memo.from}-${index}`} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{memo.name}</p>
                      <p className="text-xs text-gray-500">{formatAddress(memo.from)}</p>
                      {memo.message && <p className="mt-2 text-xs text-gray-700">{memo.message}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500">Page {page + 1}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!memosData || memosData.length < 10}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
