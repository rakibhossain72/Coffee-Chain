"use client"

import Link from "next/link"

interface CreatorCardProps {
  creator: {
    address: string
    name: string
    about: string
    totalReceived: string
  }
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Link href={`/${creator.address}`}>
      <div className="group rounded-xl border border-gray-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all">
        <div className="mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500" />

        <h3 className="text-sm font-semibold text-gray-900">{creator.name}</h3>
        <p className="mt-2 text-xs text-gray-600 line-clamp-2">{creator.about}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">Total received</span>
          <span className="text-sm font-medium text-gray-900">{creator.totalReceived} ETH</span>
        </div>
      </div>
    </Link>
  )
}
