"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Book, Shield, Zap, Globe, Coffee, Wallet2, CheckCircle, ExternalLink, HelpCircle, ChevronDown } from "lucide-react"

export default function DocsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-600 shadow-lg shadow-orange-100 transition-transform group-hover:scale-110">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900">CoffeeChain</span>
            </Link>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
              <Book className="h-4 w-4" />
              Documentation
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-6">
              How CoffeeChain Works
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
              CoffeeChain is a decentralized platform built on the Ethereum blockchain that allows creators to receive direct support from their fans without any middleman or platform fees.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-16">
            {/* Overview */}
            <section id="overview" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-8 w-1 bg-orange-600 rounded-full" />
                Platform Overview
              </h2>
              <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed space-y-4">
                <p>
                  Most creator platforms take a significant cut of your earnings (often 5% to 30%). CoffeeChain leverages smart contracts on the Ethereum network to ensure that **100% of the support** goes directly from the fan to the creator.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                    <Shield className="h-6 w-6 text-orange-600 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Non-Custodial</h3>
                    <p className="text-sm">We never hold your funds. All transactions happen directly through the smart contract on-chain.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                    <Globe className="h-6 w-6 text-orange-600 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Global Reach</h3>
                    <p className="text-sm">Works anywhere in the world where Ethereum is accessible. No regional banking restrictions.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-8 w-1 bg-orange-600 rounded-full" />
                Getting Started
              </h2>
              <div className="space-y-8">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold">1</div>
                  <h3 className="font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Use a Web3 wallet like MetaMask or Rainbow. Ensure you are connected to the **Sepolia Testnet** (currently in testnet phase).
                  </p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold">2</div>
                  <h3 className="font-bold text-gray-900 mb-2">Create Your Profile</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Set your display name and customize your profile description. This information is stored on the Ethereum blockchain.
                  </p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold">3</div>
                  <h3 className="font-bold text-gray-900 mb-2">Share Your Link</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Every creator gets a unique URL (e.g., `coffee-chain.app/yourname`). Share this with your audience to start receiving tips.
                  </p>
                </div>
              </div>
            </section>

            {/* Smart Contract */}
            <section id="contract" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-8 w-1 bg-orange-600 rounded-full" />
                Technical Details
              </h2>
              <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Contract Deployment</h3>
                    <p className="text-gray-400 text-sm">Verified on Sepolia Explorer</p>
                  </div>
                  <a 
                    href="https://sepolia.etherscan.io/address/0x035efEe092383e2baFdAAAacF79167c55178fa59" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm font-bold"
                  >
                    View on Etherscan
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-orange-400 mb-1">// Contract Address</p>
                    <p className="break-all text-gray-300">0x035efEe092383e2baFdAAAacF79167c55178fa59</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-orange-400 mb-1">// Security Principles</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Immutable Logic</li>
                      <li>Permissionless Withdrawals</li>
                      <li>Public Transparency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-8 w-1 bg-orange-600 rounded-full" />
                Frequently Asked Questions
              </h2>
              <div className="mx-auto max-w-3xl divide-y divide-gray-100 border-t border-gray-100">
                {[
                  {
                    q: "Is CoffeeChain really free?",
                    a: "Yes! We do not take any percentage of your tips. The only cost is the network gas fee (paid to the Ethereum network) for transactions."
                  },
                  {
                    q: "What is Sepolia Testnet?",
                    a: "Sepolia is a test network for Ethereum developers. It allows you to test the platform using 'test ETH' which has no real-world value, so you can explore the features without spending real money."
                  },
                  {
                    q: "Can I use any Ethereum wallet?",
                    a: "Yes, any wallet that supports the Ethereum Sepolia network (like MetaMask, Rainbow, or Coinbase Wallet) will work with CoffeeChain."
                  },
                  {
                    q: "How do I get test ETH?",
                    a: "You can get free test ETH from various Sepolia Faucets online. Once you have it in your wallet, you can start sending tips on our platform."
                  }
                ].map((item, i) => (
                  <div key={i} className="py-6">
                    <button 
                      onClick={() => toggleFaq(i)}
                      className="flex w-full items-center justify-between text-left focus:outline-none group"
                    >
                      <span className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-3 transition-colors group-hover:text-orange-600">
                        <HelpCircle className="h-4 w-4 text-orange-600" />
                        {item.q}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openFaq === i ? "rotate-180 text-orange-600" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="mt-4 pl-7 text-sm text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
            {/* Questions Section */}
            <section id="questions" className="scroll-mt-32">
              <div className="rounded-3xl bg-orange-50 p-8 sm:p-12 border border-orange-100">
                <div className="flex items-center gap-3 text-orange-600 mb-4">
                  <HelpCircle className="h-6 w-6" />
                  <h2 className="text-xl font-black uppercase tracking-widest">Still have questions?</h2>
                </div>
                <p className="text-gray-600 mb-8 max-w-2xl">
                  CoffeeChain is an open-source project dedicated to the creator economy. Join our community or check out our GitHub repository for technical discussions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://github.com/rakibhossain72/Coffee-Chain" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all active:scale-95"
                  >
                    Github Repository
                  </a>
                  <Link 
                    href="/#faq" 
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-900 border border-gray-200 hover:border-orange-200 transition-all active:scale-95"
                  >
                    View FAQ
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 font-medium">
            &copy; 2026 CoffeeChain. Empowering creators through decentralization.
          </p>
        </div>
      </footer>
    </div>
  )
}
