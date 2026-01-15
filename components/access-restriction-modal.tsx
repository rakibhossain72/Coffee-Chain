"use client"

import { useAppKit } from "@reown/appkit/react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Lock, Wallet } from "lucide-react"

interface AccessRestrictionModalProps {
  type: "no-wallet" | "already-creator" | "not-creator"
}

export function AccessRestrictionModal({ type }: AccessRestrictionModalProps) {
  const { open } = useAppKit()
  const router = useRouter()

  const config = {
    "no-wallet": {
      icon: <Wallet className="h-10 w-10 text-orange-500" />,
      title: "Wallet Connection Required",
      description: "You need to connect your Ethereum wallet to access this page.",
      buttonText: "Connect Wallet",
      action: () => open(),
    },
    "already-creator": {
      icon: <Lock className="h-10 w-10 text-orange-500" />,
      title: "Already a Creator",
      description: "You have already set up your creator profile. You can manage your page from the dashboard.",
      buttonText: "Go to Dashboard",
      action: () => router.push("/dashboard"),
    },
    "not-creator": {
      icon: <AlertTriangle className="h-10 w-10 text-orange-500" />,
      title: "Creator Profile Required",
      description: "You haven't created a creator profile yet. Create one to start receiving support!",
      buttonText: "Create Profile",
      action: () => router.push("/create"),
    },
  }[type]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-orange-50 p-3">
            {config.icon}
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">{config.title}</h2>
          <p className="mb-8 text-sm text-gray-600 leading-relaxed">
            {config.description}
          </p>
          <div className="flex w-full flex-col gap-3">
            <button
              onClick={config.action}
              className="w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {config.buttonText}
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
