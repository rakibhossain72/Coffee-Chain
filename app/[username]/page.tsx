"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { SupportForm } from "@/components/support-form"
import { SupportsList } from "@/components/supports-list"
import { formatAddress } from "@/lib/utils"
import { getAddress } from "viem"
import Image from "next/image"

export default function CreatorProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Try to parse as address, fallback to treating as ENS name
  let creatorAddress: `0x${string}` | null = null
  try {
    if (username && username.startsWith("0x")) {
      creatorAddress = getAddress(username)
    }
  } catch {
    // If not a valid address, would need ENS resolution
    creatorAddress = null
  }

  const { data: creatorDataByAddress } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getCreator",
    args: creatorAddress ? [creatorAddress] : undefined,
    query: {
      enabled: !!creatorAddress,
    },
  })

  const { data: creatorDataByName } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getCreatorByName",
    args: !creatorAddress && username ? [username] : undefined,
    query: {
      enabled: !creatorAddress && !!username,
    },
  })

  // Use either the direct address lookup results or the name lookup results
  const activeCreatorData = creatorDataByAddress || creatorDataByName
  const activeAddress = creatorAddress || (creatorDataByName as any)?.owner

  const { data: memos } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getMemos",
    args: activeAddress ? [activeAddress] : undefined,
    query: {
      enabled: !!activeAddress,
    },
  })

  useEffect(() => {
    if (activeCreatorData && activeCreatorData.name) {
      setCreator({
        address: activeAddress,
        username: activeCreatorData.name,
        about: activeCreatorData.about,
        totalReceived: activeCreatorData.totalReceived,
      })
      setLoading(false)
    } else if ((creatorAddress || creatorDataByName === null) && !loading) {
      // If we tried lookup and got nothing
      setLoading(false)
    }
  }, [activeCreatorData, activeAddress, loading, creatorAddress, creatorDataByName])

  if (!activeAddress && !loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Creator not found. Please check the username or address.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-96 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">This creator hasn't set up their profile yet.</p>
        </div>
      </div>
    )
  }

  const ethAmount = Number(creator.totalReceived) / 1e18
  

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Creator Header */}
      <div className="mb-10">
        <Image src="/user.png" alt="Coffee Chain Logo" width={64} height={64} />
        <h1 className="text-2xl font-bold text-gray-900">@{creator.username}</h1>
        <p className="mt-2 text-sm text-gray-600">{creator.about}</p>

        <div className="mt-4 flex items-center gap-6">
          <div>
            <p className="text-xs text-gray-500">Total received</p>
            <p className="text-lg font-semibold text-gray-900">{ethAmount.toFixed(4)} ETH</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Creator address</p>
            <p className="text-sm font-mono text-gray-600">{formatAddress(creator.address)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Support Form */}
        <div className="lg:col-span-1">
          <SupportForm creatorAddress={creator.address} />
        </div>

        {/* Supports List */}
        <div className="lg:col-span-2">
          <SupportsList memos={memos ? [...memos] : []} />
        </div>
      </div>
    </div>
  )
}
