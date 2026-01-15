"use client"

import Link from "next/link"
import { useAccount, useReadContract } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import { useRouter } from "next/navigation"
import { CheckCircle, Zap, Lock, Users } from "lucide-react"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import Image from "next/image"

export default function LandingPage() {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const router = useRouter()

  const { data: creatorData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getCreator",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const isCreator = !!creatorData?.name

  const handleGetStarted = () => {
    if (isConnected) {
      if (isCreator) {
        router.push("/dashboard")
      } else {
        router.push("/create")
      }
    } else {
      open()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Support creators on
            <br />
            <span className="text-orange-500">the Ethereum blockchain</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            A decentralized platform where supporters can directly tip their favorite creators with ETH. No
            intermediaries, no hidden fees—just direct support.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={handleGetStarted}
              className="rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white hover:bg-orange-600 transition-colors cursor-pointer"
            >
              {!isConnected ? "Get Started" : isCreator ? "Go to Dashboard" : "Create Your Creator Page"}
            </button>
            <Link
              href="#how-it-works"
              className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Simple steps to start supporting your favorite creators</p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                number: "1",
                title: "Connect Wallet",
                description: "Connect your Ethereum wallet to get started on the platform",
              },
              {
                number: "2",
                title: "Create Profile",
                description: "Set up your creator profile with a name and bio in minutes",
              },
              {
                number: "3",
                title: "Share Your Link",
                description: "Share your unique creator link with your audience",
              },
              {
                number: "4",
                title: "Receive Tips",
                description: "Supporters can tip you directly in ETH with no fees",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-lg">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Coffee Chain Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Coffee Chain</h2>
            <p className="mt-4 text-lg text-gray-600">The benefits of decentralized creator support</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Lock,
                title: "Non-Custodial",
                description: "Your funds are always in your control, stored on the blockchain",
              },
              {
                icon: Zap,
                title: "Instant Payouts",
                description: "Withdraw your tips instantly to your wallet anytime",
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Direct connection between creators and supporters",
              },
              {
                icon: CheckCircle,
                title: "Transparent",
                description: "All transactions are on-chain and verifiable",
              },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="rounded-lg border border-gray-200 p-6 text-center">
                  <Icon className="mx-auto h-10 w-10 text-orange-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Powerful Features</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to thrive as a creator</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Creator Dashboard",
                description: "Track your earnings, view supporter history, and manage your profile all in one place",
              },
              {
                title: "Custom Creator Pages",
                description: "Beautiful, personalized pages that showcase your work and accept tips",
              },
              {
                title: "Flexible Amounts",
                description: "Supporters can tip preset amounts or send any custom amount",
              },
              {
                title: "Support Messages",
                description: "Receive messages with each tip to build deeper connections with supporters",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to get started?</h2>
          <p className="mt-4 text-lg text-orange-100">
            Join thousands of creators receiving direct support from their audience
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-8 rounded-lg bg-white px-8 py-3 text-base font-semibold text-orange-600 hover:bg-gray-50 transition-colors"
          >
            {!isConnected ? "Create Your Page Today" : isCreator ? "Manage Your Page" : "Create Your Page Today"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/icon.png" alt="Coffee Chain Logo" width={32} height={32} />
                <span className="text-base font-semibold text-white">Coffee Chain</span>
              </div>
              <p className="text-sm text-gray-400">Supporting creators on Ethereum</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">For Creators</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/create" className="hover:text-white transition-colors">
                    Start Creating
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">© 2026 Coffee Chain. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
