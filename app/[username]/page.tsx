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
import { ExternalLink, Coffee, Heart, Users, Globe, ShieldCheck } from "lucide-react"

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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-48 rounded-3xl bg-gray-100" />
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="-mt-20 h-32 w-32 rounded-2xl border-4 border-white bg-gray-100 shadow-sm" />
            <div className="h-8 w-48 rounded bg-gray-100" />
            <div className="h-4 w-full max-w-2xl rounded bg-gray-100" />
          </div>
          <div className="grid gap-8 lg:grid-cols-12">
             <div className="h-[400px] rounded-3xl bg-gray-100 lg:col-span-4" />
             <div className="h-[600px] rounded-3xl bg-gray-100 lg:col-span-8" />
          </div>
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-orange-100 bg-white p-12 text-center shadow-xl shadow-orange-50">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
            <Coffee className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Profile Not Ready</h2>
          <p className="mt-4 text-gray-500">This creator hasn't finished setting up their profile yet. Please check back later!</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-8 rounded-xl bg-orange-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-orange-700 active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const totalReceivedETH = Number(creator.totalReceived) / 1e18
  const totalReceivedUSD = totalReceivedETH * ethPrice

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      {/* Banner Area */}
      <div className="relative h-[220px] sm:h-[300px] lg:h-[360px] w-full overflow-hidden bg-gray-900">
         <Image 
            src="/creator_banner_default.png" 
            alt="Profile Banner" 
            fill
            priority
            className="object-cover opacity-60 transition-opacity duration-700"
          />
         <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent opacity-90" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 sm:-mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:gap-12">
          {/* Header Info */}
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end text-center lg:text-left">
              <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl">
                 <Image 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(creator.username)}`} 
                  alt={creator.username} 
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="pb-2">
                <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                  <h1 className="text-4xl font-black tracking-tight text-gray-900 drop-shadow-sm lg:drop-shadow-none">
                    @{creator.username}
                  </h1>
                  <div className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-200">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </div>
                </div>
                <p className="mt-4 max-w-2xl text-lg font-medium text-gray-500 leading-relaxed">
                  {creator.about}
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 lg:justify-start">
                   <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 border border-gray-100 text-xs font-bold text-gray-400 shadow-sm transition-all hover:border-gray-200">
                      <Globe className="h-4 w-4 text-orange-500" />
                      <span className="font-mono">{formatAddress(creator.address)}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-gray-100/50 border border-gray-100 ring-1 ring-gray-900/5 min-w-fit w-full sm:w-auto">
              <div className="text-center lg:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Support</p>
                <div className="mt-1 flex items-baseline gap-1.5 justify-center lg:justify-start">
                  <span className="text-3xl font-black text-gray-900">{totalReceivedETH.toFixed(4)}</span>
                  <span className="text-xs font-bold text-orange-500">ETH</span>
                </div>
                <p className="mt-0.5 text-xs font-bold text-gray-400">≈ ${totalReceivedUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100 hidden sm:block" />
              <div className="text-center lg:text-left">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Supporters</p>
                 <p className="mt-1 text-2xl font-black text-gray-900">{memos?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            {/* Payment Section */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24">
                <SupportForm creatorAddress={creator.address} />
              </div>
            </div>

            {/* Feed Section */}
            <div className="lg:col-span-7 xl:col-span-8">
               <div className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">
                  <SupportsList memos={memos ? [...memos] : []} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
