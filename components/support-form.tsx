"use client"

import type React from "react"
import { useState } from "react"
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther } from "viem"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import toast from "react-hot-toast"
import { Coffee, MessageSquare, User, Send, Wallet, Loader2 } from "lucide-react"

const PRESET_AMOUNTS = [
  { value: "0.001", label: "0.001", icon: "☕" },
  { value: "0.005", label: "0.005", icon: "☕☕" },
  { value: "0.01", label: "0.01", icon: "☕☕☕" },
]

interface SupportFormProps {
  creatorAddress: `0x${string}`
}

export function SupportForm({ creatorAddress }: SupportFormProps) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [selectedAmount, setSelectedAmount] = useState(PRESET_AMOUNTS[0].value)
  const [customAmount, setCustomAmount] = useState("")

  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({
    address,
  })

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash,
  })

  const isLoading = isPending || isWaiting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast.error("Please connect your wallet")
      return
    }

    if (!name.trim()) {
      toast.error("Please enter your name")
      return
    }

    const amount = customAmount || selectedAmount
    const amountNum = Number.parseFloat(amount)

    if (!amount || amountNum <= 0) {
      toast.error("Please select or enter an amount")
      return
    }

    // Balance validation
    if (balanceData && amountNum > Number.parseFloat(formatEther(balanceData.value))) {
      toast.error("Insufficient balance")
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "buyCoffee",
        args: [creatorAddress, name, message],
        value: parseEther(amount),
      })

      toast.success("Support sent successfully!")
      setName("")
      setMessage("")
      setCustomAmount("")
    } catch (error) {
      toast.error("Failed to send support")
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300">
      <div className="border-b border-gray-100 bg-gray-50/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 shadow-lg">
            <Coffee className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Express Appreciation</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Direct On-Chain Support</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        {/* Balance Status */}
        {isConnected && balanceData && (
          <div className="mb-8 flex items-center justify-between rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available</span>
             <p className="text-xs font-mono font-bold text-gray-700">
                {Number.parseFloat(formatEther(balanceData.value)).toFixed(4)} <span className="text-[10px] text-gray-300">ETH</span>
             </p>
          </div>
        )}

        {/* Contribution Selection */}
        <div className="mb-8">
          <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Select Contribution
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setSelectedAmount(item.value)
                  setCustomAmount("")
                }}
                className={`flex flex-col items-center justify-center rounded-lg py-3 border transition-all ${
                  !customAmount && selectedAmount === item.value
                    ? "bg-gray-900 border-gray-900 text-white shadow-md shadow-gray-200"
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-[10px] font-mono font-bold">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 relative">
             <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Wallet className="h-3.5 w-3.5" />
             </div>
             <input
               type="number"
               step="0.0001"
               placeholder="Custom amount..."
               value={customAmount}
               onChange={(e) => setCustomAmount(e.target.value)}
               className="w-full rounded-lg border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm font-medium transition-all placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none"
             />
          </div>
        </div>

        {/* Identity & Interaction */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Your Identifier
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Name or @handle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm font-medium transition-all placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Message <span className="text-gray-300 font-normal italic lowercase">(Optional)</span>
            </label>
            <textarea
              placeholder="Say something nice..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-medium transition-all placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Action Call */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Broadcast Support</span>
            </>
          )}
        </button>
        <p className="mt-4 text-center text-[10px] font-medium text-gray-400 italic">
          Transactions are final and executed immediately.
        </p>
      </form>
    </div>
  )
}
