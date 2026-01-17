"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAccount, useDisconnect, useReadContract } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { Coffee, PlusCircle, LayoutDashboard, Wallet2 } from "lucide-react"

export function Header() {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  const { data: creatorData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getCreator",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const isCreator = !!creatorData?.name

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 transition-all active:scale-95">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-200 transition-transform group-hover:rotate-12">
               <Coffee className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-gray-900">CoffeeChain</span>
          </Link>

          <nav className="hidden items-center gap-8 sm:flex">
            {isConnected && (
              <div className="flex items-center gap-6">
                {!isCreator ? (
                  <button 
                    onClick={() => router.push("/create")} 
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-orange-600 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Page
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push("/dashboard")} 
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-orange-600 cursor-pointer"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                )}
              </div>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <appkit-button />
          </div>
        </div>
      </div>
    </header>
  )
}
