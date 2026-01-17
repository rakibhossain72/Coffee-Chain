"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { useRouter } from "next/navigation"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import toast from "react-hot-toast"
import { AccessRestrictionModal } from "@/components/access-restriction-modal"
import { UserPlus, Coffee, Globe, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"

export default function CreatePage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [about, setAbout] = useState("")

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash,
  })

  const { data: creatorData, isLoading: isCheckingCreator } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getCreator",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const isCreator = !!creatorData?.name
  const isLoading = isPending || isWaiting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const usernameRegex = /^[a-z0-9]+$/
    if (!username.trim()) {
      toast.error("Please enter a username")
      return
    }

    if (!usernameRegex.test(username)) {
      toast.error("Username must be lowercase, no spaces or special characters")
      return
    }

    if (!about.trim()) {
      toast.error("Please enter a short bio")
      return
    }

    try {
        writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: "registerCreator",
          args: [username, about],
        })
    } catch (error) {
      toast.error("Failed to initiate registration")
    }
  }

  // Effect to handle redirection after success
  useEffect(() => {
    if (hash && !isWaiting) {
      toast.success("Profile successfully registered!")
      setTimeout(() => {
        router.push(`/dashboard`)
      }, 1500)
    }
  }, [hash, isWaiting, router])

  if (!isConnected) {
    return <AccessRestrictionModal type="no-wallet" />
  }

  if (isCheckingCreator) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
      </div>
    )
  }

  if (isCreator) {
    return <AccessRestrictionModal type="already-creator" />
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20 pt-10 sm:pt-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        {/* Header Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm mb-6">
            <UserPlus className="h-6 w-6 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Onboarding</h1>
          <p className="mt-3 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Initialize your professional creator profile to start accepting direct on-chain support.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-50 bg-gray-50/50 px-8 py-4">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Registry Application</span>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Username */}
            <div className="mb-6">
              <label htmlFor="username" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Unified Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Globe className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                  maxLength={50}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <div className="mt-2 flex justify-between items-center px-1">
                 <p className="text-[10px] text-gray-500 italic">Lowercase and numbers only.</p>
                 <p className="text-[10px] text-gray-400 font-mono">{username.length}/50</p>
              </div>
            </div>

            {/* About */}
            <div className="mb-8">
              <label htmlFor="about" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Professional Bio
              </label>
              <textarea
                id="about"
                placeholder="Briefly describe your creative work..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={200}
                rows={4}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none resize-none transition-all"
              />
              <div className="mt-2 flex justify-end">
                 <p className="text-[10px] text-gray-400 font-mono">{about.length}/200</p>
              </div>
            </div>

            {/* Smart Contract Info */}
            <div className="mb-10 rounded-lg bg-gray-50 border border-gray-100 p-4">
              <div className="flex gap-3">
                 <ShieldCheck className="h-5 w-5 text-gray-400 flex-shrink-0" />
                 <div>
                    <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight mb-1">On-Chain Registry</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                      This action will register your profile on the Ethereum Sepolia network. You will be redirected to your management console after validation.
                    </p>
                 </div>
              </div>
            </div>

            {/* Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-lg bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Synchronizing with Blockchain...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Profile</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Brand Footer */}
        <div className="mt-12 text-center">
           <div className="flex items-center justify-center gap-2 text-gray-300">
              <Coffee className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">CoffeeChain Ecosystem</span>
           </div>
        </div>
      </div>
    </div>
  )
}
