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
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Management Console</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Overview of your creator profile and community activity.</p>
          </div>
          <div className="flex items-center gap-4 group cursor-default">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">@{creator.username}</p>
                <p className="text-[11px] text-gray-400 font-mono">{formatAddress(address)}</p>
             </div>
             <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 p-0.5 transition-shadow group-hover:shadow-md">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`} alt="Avatar" className="rounded-full" />
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid gap-4 grid-cols-1 sm:grid-cols-3">
          {/* Total Received */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-gray-300">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Total Revenue</p>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-gray-900">{totalReceivedETH.toFixed(4)}</p>
               <p className="text-xs font-medium text-gray-400">ETH</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">≈ ${totalReceivedUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
          </div>
          
          {/* Withdrawable */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-gray-300">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Available Balance</p>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-gray-900">{balanceETH.toFixed(4)}</p>
               <p className="text-xs font-medium text-gray-400">ETH</p>
            </div>
            <p className="mt-1 text-xs text-gray-500 font-medium text-green-600">Withdrawal Ready</p>
          </div>

          {/* Supporters */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-gray-300">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Community Size</p>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-gray-900">{Number(memoCount || 0)}</p>
               <p className="text-xs font-medium text-gray-400">Fans</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">Unique Supporters</p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Withdraw Section */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
               <div className="border-b border-gray-100 px-6 sm:px-8 py-4 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-gray-400" />
                      Withdrawal Settings
                    </h3>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                      <div className="h-1 w-1 rounded-full bg-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Vault Secure</span>
                    </div>
                  </div>
               </div>
               <div className="p-6 sm:p-8">
                  <p className="mb-6 text-sm text-gray-500 leading-relaxed max-w-lg">
                    Transfer funds to your connected Ethereum address. Transactions are irreversible and executed directly on-chain.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 mb-8">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white flex items-center justify-center text-xs text-gray-400 border border-gray-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Primary Wallet Address</p>
                      <p className="text-xs font-mono text-gray-600 break-all">{address}</p>
                    </div>
                  </div>
                  <WithdrawButton balance={BigInt(balance || 0)} />
               </div>
            </div>

            {/* Support History */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 sm:px-8 py-4 bg-gray-50/50">
                 <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <History className="h-4 w-4 text-gray-400" />
                    Transaction Journal
                 </h3>
              </div>
              
              <div className="p-6 sm:p-8">
                {memos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                     <p className="text-sm font-medium text-gray-400 italic">No historical transactions found.</p>
                  </div>
                ) : (
                  <div className="space-y-0 divide-y divide-gray-100">
                    {memos.map((memo, index) => (
                      <div key={`${memo.from}-${index}`} className="group flex items-start gap-4 py-6 transition-colors hover:bg-gray-50/50 -mx-4 px-4 sm:-mx-8 sm:px-8 first:pt-0">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${memo.name}`} alt={memo.name} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                              <h4 className="text-sm font-bold text-gray-900 truncate">{memo.name}</h4>
                              <span className="text-[10px] font-mono text-gray-400 uppercase">{formatAddress(memo.from)}</span>
                           </div>
                           {memo.message && (
                             <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                               <p className="text-sm text-gray-600 leading-relaxed">{memo.message}</p>
                             </div>
                           )}
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-8">
                      <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="text-[11px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-[11px] font-bold text-gray-200">/</span>
                      <span className="text-[11px] font-bold text-gray-900 tracking-[0.2em]">0{page + 1}</span>
                      <span className="text-[11px] font-bold text-gray-200">/</span>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={!memosData || memosData.length < 10}
                        className="text-[11px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
