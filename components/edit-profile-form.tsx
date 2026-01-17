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
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-sm font-bold text-gray-900 border-b border-gray-50 pb-4">Account Settings</h3>

      <div className="mb-5">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
          maxLength={50}
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
        />
        <div className="mt-1.5 flex justify-between items-center px-0.5">
           <p className="text-[10px] text-gray-500 font-medium italic">Unique handler, no special chars.</p>
           <p className="text-[10px] text-gray-400 font-mono">{username.length}/50</p>
        </div>
      </div>

      <div className="mb-8">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">Biography</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          maxLength={200}
          rows={4}
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none resize-none transition-all"
        />
        <div className="mt-1.5 flex justify-end">
           <p className="text-[10px] text-gray-400 font-mono">{about.length}/200</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isLoading ? "Synchronizing..." : "Update Profile"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false)
            setUsername(creator.username)
            setAbout(creator.about)
          }}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          Discard Changes
        </button>
      </div>
    </form>
  )
}
