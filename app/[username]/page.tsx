"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAINLINK_ETH_USD_ADDRESS, CHAINLINK_ABI } from "@/lib/contract"
import { SupportForm } from "@/components/support-form"
import { SupportsList } from "@/components/supports-list"
import { formatAddress } from "@/lib/utils"
import { getAddress } from "viem"
import Image from "next/image"
import { ExternalLink, Coffee, Heart, Users } from "lucide-react"

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

  // Fetch ETH Price
  const { data: priceData } = useReadContract({
    address: CHAINLINK_ETH_USD_ADDRESS,
    abi: CHAINLINK_ABI,
    functionName: "latestRoundData",
  })

  const ethPrice = priceData ? Number((priceData as any)[1]) / 1e8 : 0

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
      <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4">
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center backdrop-blur-sm">
          <p className="text-lg font-medium text-red-800">Creator not found</p>
          <p className="mt-2 text-sm text-red-600">Please check the username or address and try again.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-48 rounded-3xl bg-gray-200" />
          <div className="flex flex-col items-center gap-4">
            <div className="-mt-16 h-32 w-32 rounded-full border-4 border-white bg-gray-200" />
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="h-4 w-96 rounded bg-gray-200" />
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
             <div className="h-64 rounded-2xl bg-gray-200 lg:col-span-1" />
             <div className="h-64 rounded-2xl bg-gray-200 lg:col-span-2" />
          </div>
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4">
        <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-8 text-center backdrop-blur-sm">
          <Coffee className="mx-auto mb-4 h-12 w-12 text-orange-400" />
          <p className="text-lg font-medium text-orange-800">Profile Pending</p>
          <p className="mt-2 text-sm text-orange-600">This creator hasn't set up their profile details yet.</p>
        </div>
      </div>
    )
  }

  const totalReceivedETH = Number(creator.totalReceived) / 1e18
  const totalReceivedUSD = totalReceivedETH * ethPrice

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Banner */}
      <div className="relative h-64 w-full overflow-hidden bg-orange-100">
         <Image 
            src="/creator_banner_default_1768677263044.png" 
            alt="Profile Banner" 
            fill
            className="object-cover opacity-80"
          />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50" />
      </div>

      <div className="mx-auto -mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Profile Section */}
          <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
               <Image 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`} 
                alt={creator.username} 
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex w-full flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="flex items-center justify-center gap-2 lg:justify-start">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">@{creator.username}</h1>
                  <div className="rounded-full bg-orange-100 p-1 text-orange-600">
                    <Heart className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <p className="mt-3 max-w-2xl text-lg text-gray-600 leading-relaxed">{creator.about}</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm border border-gray-100">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {formatAddress(creator.address)}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Support</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-gray-900">{totalReceivedETH.toFixed(4)} ETH</p>
                    <p className="text-sm font-medium text-gray-400">≈ ${totalReceivedUSD.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Support Form Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <SupportForm creatorAddress={creator.address} />
              </div>
            </div>

            {/* Supports List Column */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                <SupportsList memos={memos ? [...memos] : []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
