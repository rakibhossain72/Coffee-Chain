"use client"

import { useEffect, useState } from "react"
import { useAccount, useReadContract } from "wagmi"
import { useRouter } from "next/navigation"
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAINLINK_ETH_USD_ADDRESS, CHAINLINK_ABI } from "@/lib/contract"
import { WithdrawButton } from "@/components/withdraw-button"
import { EditProfileForm } from "@/components/edit-profile-form"
import { formatAddress } from "@/lib/utils"
import { AccessRestrictionModal } from "@/components/access-restriction-modal"
import { LayoutDashboard, Wallet, TrendingUp, Users, ArrowUpRight, History } from "lucide-react"

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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-10">
          <div className="h-10 w-64 rounded-xl bg-gray-200" />
          <div className="grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-gray-200" />
            ))}
          </div>
          <div className="h-64 rounded-3xl bg-gray-200" />
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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Creator Center</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-500">Welcome back, {creator.username}. Here's what's happening.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
             <div className="h-10 w-10 overflow-hidden rounded-full bg-orange-50 ring-2 ring-orange-100">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`} alt="Avatar" />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-900">@{creator.username}</p>
                <p className="text-[10px] text-gray-400 font-mono tracking-tighter">{formatAddress(address)}</p>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          {/* Total Received */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50">
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-orange-50 opacity-50 transition-all group-hover:scale-110" />
            <TrendingUp className="mb-4 h-6 w-6 text-orange-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Received</p>
            <div className="mt-2 flex items-baseline gap-2">
               <p className="text-3xl font-black text-gray-900">{totalReceivedETH.toFixed(4)}</p>
               <p className="text-sm font-bold text-gray-400">ETH</p>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-400">≈ ${totalReceivedUSD.toFixed(2)}</p>
          </div>

          {/* Withdrawable */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-orange-200/30">
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-green-50 opacity-50 transition-all group-hover:scale-110" />
            <Wallet className="mb-4 h-6 w-6 text-green-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Available to Withdraw</p>
            <div className="mt-2 flex items-baseline gap-2">
               <p className="text-3xl font-black text-green-600">{balanceETH.toFixed(4)}</p>
               <p className="text-sm font-bold text-green-600/50">ETH</p>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-400">≈ ${balanceUSD.toFixed(2)}</p>
          </div>

          {/* Supporters */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-200/30">
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-blue-50 opacity-50 transition-all group-hover:scale-110" />
            <Users className="mb-4 h-6 w-6 text-blue-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Supporters</p>
            <div className="mt-2 flex items-baseline gap-2">
               <p className="text-3xl font-black text-gray-900">{Number(memoCount || 0)}</p>
               <p className="text-sm font-bold text-gray-400">Supporters</p>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-400">Active community</p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Withdraw Section */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
               <div className="bg-gray-900 px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <ArrowUpRight className="h-6 w-6 text-orange-500" />
                       <h3 className="text-lg font-bold">Transfer Funds</h3>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Secure</span>
                  </div>
               </div>
               <div className="p-8">
                  <p className="mb-6 text-sm text-gray-500 leading-relaxed">
                    Transfer your earned ETH directly to your connected wallet. 
                    Current wallet: <span className="font-mono font-bold text-gray-900">{formatAddress(address)}</span>
                  </p>
                  <WithdrawButton balance={BigInt(balance || 0)} />
               </div>
            </div>

            {/* Support History */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-3">
                 <History className="h-6 w-6 text-orange-600" />
                 <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              </div>
              
              {memos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                   <div className="mb-4 rounded-full bg-gray-50 p-6">
                      <Users className="h-10 w-10 text-gray-200" />
                   </div>
                   <p className="text-sm font-medium text-gray-400">No activity yet. Share your profile to get started!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {memos.map((memo, index) => (
                    <div key={`${memo.from}-${index}`} className="group flex items-start gap-4 p-2 transition-all hover:bg-gray-50 rounded-2xl">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-orange-50 ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${memo.name}`} alt={memo.name} />
                      </div>
                      <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-0">
                         <div className="flex items-center justify-between gap-4">
                            <h4 className="text-sm font-bold text-gray-900">{memo.name}</h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatAddress(memo.from)}</span>
                         </div>
                         {memo.message && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{memo.message}</p>}
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-6 pt-8">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="group flex items-center gap-2 text-xs font-bold text-gray-500 transition-colors hover:text-orange-600 disabled:opacity-30"
                    >
                      <ArrowUpRight className="h-4 w-4 rotate-[225deg]" />
                      Newer
                    </button>
                    <div className="h-8 w-[1px] bg-gray-200" />
                    <span className="text-xs font-black text-gray-900">PAGE {page + 1}</span>
                    <div className="h-8 w-[1px] bg-gray-200" />
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!memosData || memosData.length < 10}
                      className="group flex items-center gap-2 text-xs font-bold text-gray-500 transition-colors hover:text-orange-600 disabled:opacity-30"
                    >
                      Older
                      <ArrowUpRight className="h-4 w-4 rotate-45" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <EditProfileForm creator={creator} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
