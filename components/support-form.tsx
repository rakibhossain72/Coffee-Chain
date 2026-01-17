"use client"

import type React from "react"
import { useState } from "react"
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther } from "viem"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import toast from "react-hot-toast"
import { Coffee, MessageSquare, User, Send, Wallet } from "lucide-react"

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
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
      <div className="bg-orange-500 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
            <Coffee className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Buy a Coffee</h3>
            <p className="text-xs text-white/80">Support your favorite creator</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {/* Balance Info */}
        {isConnected && balanceData && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Your Balance</span>
            </div>
            <span className="text-xs font-bold text-gray-700">
              {Number.parseFloat(formatEther(balanceData.value)).toFixed(4)} {balanceData.symbol}
            </span>
          </div>
        )}

        {/* Amount Selection */}
        <div className="mb-8">
          <label className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setSelectedAmount(item.value)
                  setCustomAmount("")
                }}
                className={`group relative flex flex-col items-center justify-center rounded-2xl py-4 transition-all duration-300 ${
                  !customAmount && selectedAmount === item.value
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200 ring-2 ring-orange-500 ring-offset-2"
                    : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span className="mb-1 text-lg">{item.icon}</span>
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 relative">
            <input
              type="number"
              step="0.0001"
              placeholder="Or enter custom ETH amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3.5 text-sm font-medium transition-all placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none"
            />
            {customAmount && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-orange-500">ETH</div>
            )}
          </div>
        </div>

        {/* Info Inputs */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name or @handle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 pl-11 pr-5 py-3.5 text-sm font-medium transition-all placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Message <span className="text-gray-300 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
              <textarea
                placeholder="Say something nice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 pl-11 pr-5 py-4 text-sm font-medium transition-all placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-orange-200 transition-all hover:bg-orange-600 hover:shadow-orange-300 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Support with {customAmount || selectedAmount} ETH</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
