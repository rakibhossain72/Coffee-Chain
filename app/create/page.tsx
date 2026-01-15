"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { useRouter } from "next/navigation"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import toast from "react-hot-toast"
import { AccessRestrictionModal } from "@/components/access-restriction-modal"

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

  // Removed automatic redirect to allow showing the modal instead
  useEffect(() => {
    // We handle access control via conditional rendering now
  }, [isConnected, isCreator])

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

      // After successful transaction
      if (hash) {
        toast.success("Creator page created! Redirecting...")
        setTimeout(() => {
          router.push(`/dashboard`)
        }, 2000)
      }
    } catch (error) {
      toast.error("Failed to create creator page")
    }
  }

  if (!isConnected) {
    return <AccessRestrictionModal type="no-wallet" />
  }

  if (isCheckingCreator) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (isCreator) {
    return <AccessRestrictionModal type="already-creator" />
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Your Creator Page</h1>
        <p className="mt-2 text-sm text-gray-600">
          Set up your profile and start receiving support from your community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-1">
            Username
          </label>
          <p className="mb-2 text-xs text-gray-500">
            Must be unique, use only lowercase letters and numbers. No spaces, special characters, or uppercase letters.
          </p>
          <input
            id="username"
            type="text"
            placeholder="e.g. cryptocreator"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
            maxLength={50}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">{username.length}/50</p>
        </div>

        {/* About */}
        <div className="mb-8">
          <label htmlFor="about" className="block text-sm font-medium text-gray-900 mb-2">
            About You
          </label>
          <textarea
            id="about"
            placeholder="Tell people what you do or what you create..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            maxLength={200}
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">{about.length}/200</p>
        </div>

        {/* Info Box */}
        <div className="mb-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-xs text-blue-900">
            Your creator page will be accessible at{" "}
            <span className="font-mono font-semibold">coffeechain.eth/{username || "your-username"}</span>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating page..." : "Create my page"}
        </button>
      </form>
    </div>
  )
}
