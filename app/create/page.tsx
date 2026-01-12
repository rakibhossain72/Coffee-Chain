"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useRouter } from "next/navigation"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import toast from "react-hot-toast"

export default function CreatePage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [name, setName] = useState("")
  const [about, setAbout] = useState("")

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash,
  })

  const isLoading = isPending || isWaiting

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter your display name")
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
        args: [name, about],
      })

      // After successful transaction
      if (hash) {
        toast.success("Creator page created! Redirecting...")
        setTimeout(() => {
          router.push(`/${address}`)
        }, 2000)
      }
    } catch (error) {
      toast.error("Failed to create creator page")
    }
  }

  if (!isConnected) {
    return null
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
        {/* Display Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
            Display Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">{name.length}/50</p>
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
            <span className="font-mono font-semibold">coffeechain.eth/{address?.slice(0, 6)}...</span>
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
