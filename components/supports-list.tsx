"use client"

import { formatAddress, formatTimeAgo } from "@/lib/utils"

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
      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Recent supports</h3>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-600">No supports yet. Be the first to support this creator!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Recent supports</h3>
      <div className="space-y-3">
        {memos.map((memo, index) => (
          <div
            key={`${memo.from}-${memo.timestamp}-${index}`}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{memo.name}</p>
                <p className="text-xs text-gray-500">{formatAddress(memo.from)}</p>
              </div>
              <span className="text-xs text-gray-500">{formatTimeAgo(Number(memo.timestamp))}</span>
            </div>
            {memo.message && <p className="text-xs text-gray-700">{memo.message}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
