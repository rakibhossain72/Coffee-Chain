"use client"

import type React from "react"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import toast from "react-hot-toast"

interface EditProfileFormProps {
  creator: {
    username: string
    about: string
  }
}

export function EditProfileForm({ creator }: EditProfileFormProps) {
  const { address } = useAccount()
  const [username, setUsername] = useState(creator.username)
  const [about, setAbout] = useState(creator.about)
  const [isEditing, setIsEditing] = useState(false)

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash,
  })

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

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "updateCreator",
        args: [username, about],
      })

      toast.success("Profile updated!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  if (!isEditing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Profile</h3>
        <div className="space-y-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Username</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{creator.username}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">About</p>
            <p className="mt-1 text-sm text-gray-700 line-clamp-3">{creator.about}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
        >
          Edit profile
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Edit Profile</h3>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-700">Username</label>
        <p className="mb-2 text-[10px] text-gray-500">
          Must be unique, lowercase, no spaces or special characters.
        </p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
          maxLength={50}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">{username.length}/50</p>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-xs font-medium text-gray-700">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          maxLength={200}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">{about.length}/200</p>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false)
            setUsername(creator.username)
            setAbout(creator.about)
          }}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
