"use client"

import { formatAddress, formatTimeAgo } from "@/lib/utils"
import { Coffee, User, Calendar } from "lucide-react"
import Image from "next/image"

interface Memo {
  from: string
  timestamp: bigint | number
  name: string
  message: string
}

interface SupportsListProps {
  memos: Memo[]
}

export function SupportsList({ memos }: SupportsListProps) {
  if (memos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-50 text-gray-300">
           <Coffee className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No supports yet</h3>
        <p className="mt-2 max-w-[240px] text-sm text-gray-500">
          Be the first to support this creator and leave a nice message!
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Recent Supports</h3>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
          {memos.length} Total
        </span>
      </div>

      <div className="space-y-6">
        {memos.map((memo, index) => (
          <div
            key={`${memo.from}-${memo.timestamp}-${index}`}
            className="group relative flex gap-4 transition-all"
          >
            {/* Thread Line */}
            {index !== memos.length - 1 && (
                <div className="absolute left-6 top-14 bottom-[-24px] w-0.5 bg-gray-100" />
            )}

            <div className="relative z-10 h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gray-50 shadow-sm ring-1 ring-gray-100">
               <Image 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${memo.name}`} 
                alt={memo.name} 
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 pb-2">
              <div className="rounded-3xl bg-gray-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 border border-transparent hover:border-gray-100">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{memo.name || "Anonymous"}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      <User className="h-3 w-3" />
                      {formatAddress(memo.from)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-gray-400 shadow-sm border border-gray-100">
                    <Calendar className="h-3 w-3" />
                    {formatTimeAgo(Number(memo.timestamp))}
                  </div>
                </div>

                {memo.message ? (
                  <p className="text-sm leading-relaxed text-gray-600">
                    {memo.message}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-400">Supported with a coffee</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
