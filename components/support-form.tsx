"use client"

import type React from "react"

import { useState } from "react"
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther } from "viem"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import toast from "react-hot-toast"

const PRESET_AMOUNTS = ["0.001", "0.005", "0.01"]

interface SupportFormProps {
  creatorAddress: `0x${string}`
}

export function SupportForm({ creatorAddress }: SupportFormProps) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [selectedAmount, setSelectedAmount] = useState(PRESET_AMOUNTS[0])
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
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 sticky top-24 shadow-sm">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900">Buy me a coffee</h3>
        {isConnected && balanceData && (
          <p className="mt-1 text-[10px] text-gray-500 font-medium">
            Your balance: {Number.parseFloat(formatEther(balanceData.value)).toFixed(4)} {balanceData.symbol}
          </p>
        )}
      </div>

      {/* Amount Selection */}
      <div className="mb-6">
        <label className="mb-3 block text-xs font-medium text-gray-700">Select amount</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => {
                setSelectedAmount(amount)
                setCustomAmount("")
              }}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                !customAmount && selectedAmount === amount
                  ? "bg-orange-500 text-white"
                  : "border border-gray-200 bg-white text-gray-900 hover:border-orange-300"
              }`}
            >
              {amount} ETH
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Or enter custom amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Name Input */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium text-gray-700">Your name</label>
        <input
          type="text"
          placeholder="Anonymous"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Message Input */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-medium text-gray-700">Message (optional)</label>
        <textarea
          placeholder="Share your thoughts..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs placeholder:text-gray-400 focus:border-orange-500 focus:outline-none resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Processing..." : `Support with ${customAmount || selectedAmount} ETH`}
      </button>
    </form>
  )
}
