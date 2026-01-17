"use client"

import { formatAddress, formatTimeAgo } from "@/lib/utils"
import { Coffee, User, Calendar, History, Clock } from "lucide-react"
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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-50 text-gray-200 border border-gray-100">
           <History className="h-8 w-8" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest leading-none">Journal Empty</h3>
        <p className="mt-2 max-w-[280px] text-xs font-medium text-gray-400 italic">
          No historical interactions have been recorded for this profile yet.
        </p>
      </div>
    )
  }

  // Reverse memos to show newest first
  const sortedMemos = [...memos].reverse()

  return (
    <div>
      <div className="border-b border-gray-50 bg-gray-50/50 px-8 py-5">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <History className="h-4 w-4 text-gray-400" />
              Community Support Journal
           </h3>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-2.5 py-1 rounded-md bg-white">
             {memos.length} Records found
           </span>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {sortedMemos.map((memo, index) => (
          <div
            key={`${memo.from}-${memo.timestamp}-${index}`}
            className="group px-8 py-8 transition-colors hover:bg-gray-50/50"
          >
            <div className="flex flex-col sm:flex-row gap-6">
               <div className="relative flex-shrink-0 h-10 w-10 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 ring-4 ring-white shadow-sm">
                  <Image 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(memo.name || "Anonymous")}`} 
                    alt={memo.name} 
                    fill
                    className="object-cover"
                  />
               </div>

               <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                     <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors">
                           {memo.name || "Anonymous Benefactor"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tight">{formatAddress(memo.from)}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(Number(memo.timestamp))}
                     </div>
                  </div>

                  {memo.message ? (
                    <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 relative group-hover:bg-white transition-all">
                       <p className="text-sm leading-relaxed text-gray-600 relative z-10">
                          {memo.message}
                       </p>
                    </div>
                  ) : (
                    <p className="text-xs font-medium italic text-gray-300">
                       Contribution initiated without additional statement.
                    </p>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
