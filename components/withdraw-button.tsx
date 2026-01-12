"use client"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import toast from "react-hot-toast"

interface WithdrawButtonProps {
  balance: bigint
}

export function WithdrawButton({ balance }: WithdrawButtonProps) {
  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash,
  })

  const isLoading = isPending || isWaiting
  const hasBalance = balance > BigInt(0)

  const handleWithdraw = () => {
    if (!hasBalance) {
      toast.error("No funds available to withdraw")
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "withdraw",
        args: [],
      })

      toast.success("Withdrawal initiated!")
    } catch (error) {
      toast.error("Failed to withdraw funds")
    }
  }

  return (
    <button
      onClick={handleWithdraw}
      disabled={isLoading || !hasBalance}
      className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? "Processing..." : `Withdraw ${(Number(balance) / 1e18).toFixed(4)} ETH`}
    </button>
  )
}
