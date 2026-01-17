"use client"

import Link from "next/link"
import { useAccount, useReadContract } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import { useRouter } from "next/navigation"
import { CheckCircle, Zap, Lock, Users, Shield, Globe, Award, Github, ArrowRight, ExternalLink, HelpCircle, ChevronDown, Coffee, Wallet2, History } from "lucide-react"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { useState } from "react"

export default function LandingPage() {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-orange-600 shadow-lg shadow-orange-100">
                <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-base sm:text-xl font-black tracking-tight text-gray-900">CoffeeChain</span>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="hidden md:flex items-center gap-8">
                <Link href="#features" className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">Features</Link>
                <Link href="#how-it-works" className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">Workflow</Link>
                <Link href="/docs" className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">Docs</Link>
              </div>
              <button 
                onClick={handleGetStarted}
                className="rounded-lg sm:rounded-xl bg-gray-900 px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                {!isConnected ? "Connect" : isCreator ? "Dashboard" : "Register"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pb-16 pt-28 sm:pb-32 sm:pt-40">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-200 to-orange-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-[10px] sm:text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 max-w-[90%] sm:max-w-none shadow-sm">
                Now live on Sepolia Testnet.{" "}
                <Link href="/docs" className="font-semibold text-orange-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-6xl">
              Empower Creativity with <span className="text-orange-600">Direct Support</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A professional, decentralized ecosystem for creators and their communities. No middleman, just pure appreciation on the Ethereum blockchain.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto group flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-orange-200 transition-all hover:bg-orange-700 active:scale-95"
              >
                {!isConnected ? "Get Started" : isCreator ? "Go to Dashboard" : "Create Your Profile"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link href="#how-it-works" className="text-sm font-bold leading-6 text-gray-900 py-2">
                Learn how it works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="bg-gray-50/50 py-16 sm:py-24 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-12 text-center md:grid-cols-3">
            {[
              { label: "Current Network", value: "Sepolia Testnet", icon: Globe },
              { label: "Platform Commission", value: "0% Fees", icon: Zap },
              { label: "Transaction Type", value: "P2P On-Chain", icon: Shield },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <dt className="text-xs sm:text-sm leading-7 text-gray-500 font-bold uppercase tracking-widest">{stat.label}</dt>
                  <dd className="order-first text-2xl sm:text-3xl font-black tracking-tight text-gray-900">{stat.value}</dd>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-bold leading-7 text-orange-600 uppercase tracking-widest">Platform Features</h2>
            <p className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to grow your digital presence
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Professional tools designed for the modern creator, built with decentralization at its core.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 sm:gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: "Non-Custodial Security",
                  description: "Unlike web2 platforms, we never touch your funds. All tips go directly to your smart contract and stay under your control.",
                  icon: Shield,
                },
                {
                  name: "Instant Global Access",
                  description: "Reach your audience anywhere in the world. Ethereum enables borders-free transactions with no regional restrictions.",
                  icon: Globe,
                },
                {
                  name: "Transparent Analytics",
                  description: "Every support message and tip is recorded on-chain, providing a verifiable and permanent record of your community's growth.",
                  icon: History,
                },
                {
                  name: "DeFi Integration",
                  description: "Easily withdraw your funds or keep them in the ecosystem. Your earnings are ready for the world of decentralized finance.",
                  icon: Wallet2,
                },
                {
                  name: "Zero Platform Fees",
                  description: "We don't take a cut of your hard-earned tips. The platform is built to maximize the support for creators.",
                  icon: CheckCircle,
                },
                {
                  name: "Custom Pages",
                  description: "Create a beautiful, personalized profile page that represents your brand and tells your story.",
                  icon: Coffee,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative pl-14 sm:pl-16 transition-all hover:-translate-y-1">
                  <dt className="text-base font-bold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-600 shadow-lg shadow-orange-100">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-sm leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-white">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-base font-bold leading-7 text-orange-500 uppercase tracking-widest">Seamless Integration</h2>
            <p className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Four steps to start earning
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
             {[
               { n: 1, t: "Connect", d: "Securely link your Ethereum wallet." },
               { n: 2, t: "Configure", d: "Set up your unique creator profile." },
               { n: 3, t: "Distribute", d: "Share your professional link." },
               { n: 4, t: "Withdraw", d: "Receive tips and withdraw instantly." }
             ].map(step => (
               <div key={step.n} className="relative rounded-2xl bg-white/5 p-8 border border-white/10 transition-colors hover:bg-white/10">
                  <div className="text-5xl font-black text-orange-500/20 absolute right-6 top-6">{step.n}</div>
                  <h3 className="text-lg font-bold mb-2">{step.t}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.d}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-12 sm:mb-16">
            <h2 className="text-base font-bold leading-7 text-orange-600 uppercase tracking-widest text-center lg:text-left">Support</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-gray-900 sm:text-4xl text-center">
              Frequently Asked Questions
            </p>
          </div>
          <div className="mx-auto max-w-3xl divide-y divide-gray-100">
            {[
              {
                q: "Is CoffeeChain really free?",
                a: "Yes! We do not take any percentage of your tips. The only cost is the network gas fee (paid to the Ethereum network) for transactions."
              },
              {
                q: "What network does Coffee Chain run on?",
                a: "Currently, Coffee Chain is running on the Ethereum Sepolia Testnet for security and testing purposes. This means you can test the platform with 'test ETH' at no real cost."
              },
              {
                q: "How do I withdraw my tips?",
                a: "You can withdraw your accumulated tips anytime via the Creator Dashboard. The funds are transferred directly from the smart contract to your connected wallet."
              },
              {
                q: "Is there a platform commission?",
                a: "No, Coffee Chain does not take any commission from tips. You receive 100% of the support sent to you, minus the network gas fees for transactions."
              }
            ].map((item, i) => (
              <div key={i} className="py-6">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="flex w-full items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-3 transition-colors group-hover:text-orange-600">
                    <HelpCircle className="h-4 w-4 text-orange-600" />
                    {item.q}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openFaq === i ? "rotate-180 text-orange-600" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="mt-4 pl-7 text-sm text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center rounded-2xl sm:rounded-3xl bg-gray-900 px-6 py-12 sm:px-8 sm:py-16 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ready to claim your spot?
            </h2>
            <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-400">
              Join a new era of creator-supporter relationships built on trust and decentralization.
            </p>
            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-xl bg-orange-600 px-8 py-4 text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95 transition-all"
              >
                {!isConnected ? "Get Started Now" : isCreator ? "Manage Dashboard" : "Create Profile"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 shadow-md shadow-orange-100">
                    <Coffee className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tight">CoffeeChain</span>
               </div>
              <p className="text-sm leading-6 text-gray-600">
                The professional standard for decentralized creator support on Ethereum.
              </p>
              <div className="flex space-x-6">
                <a href="https://github.com/rakibhossain72/Coffee-Chain" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">GitHub</span>
                  <Github className="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-xs font-bold leading-6 text-gray-900 uppercase tracking-widest">Platform</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li><Link href="/" className="text-sm leading-6 text-gray-600 hover:text-orange-600">Home</Link></li>
                    <li><Link href="#features" className="text-sm leading-6 text-gray-600 hover:text-orange-600">Features</Link></li>
                    <li><Link href="#how-it-works" className="text-sm leading-6 text-gray-600 hover:text-orange-600">Workflow</Link></li>
                    <li><Link href="/docs" className="text-sm leading-6 text-gray-600 hover:text-orange-600">Documentation</Link></li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-xs font-bold leading-6 text-gray-900 uppercase tracking-widest">For Creators</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li><Link href="/create" className="text-sm leading-6 text-gray-600 hover:text-orange-600">Registration</Link></li>
                    <li><Link href="/dashboard" className="text-sm leading-6 text-gray-600 hover:text-orange-600">Dashboard</Link></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-1 md:gap-8">
                <div>
                  <h3 className="text-xs font-bold leading-6 text-gray-900 uppercase tracking-widest">Source</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="https://github.com/rakibhossain72/Coffee-Chain" className="group flex items-center gap-1.5 text-sm leading-6 text-gray-600 hover:text-orange-600">
                         Github Repository
                         <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-gray-100 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <p className="text-xs leading-5 text-gray-500 font-medium">
              &copy; 2026 CoffeeChain. Built by Rakib Hossain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
