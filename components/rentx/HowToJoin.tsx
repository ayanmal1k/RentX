'use client'

import React from 'react'
import { Wallet, FileText, ArrowLeftRight, Star, ChevronRight } from 'lucide-react'

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Acquire RENTX Tokens",
    description: "Get started by acquiring RENTX through any supported Solana decentralized exchange. Connect your Phantom, Solflare, or any Solana-compatible wallet and swap SOL for RENTX in seconds.",
    detail: "Avg. swap time: ~2 seconds",
    accentColor: "primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    borderGlow: "group-hover:border-primary/30 group-hover:shadow-[0_0_40px_rgba(152,203,255,0.08)]",
    numberColor: "text-primary/20 group-hover:text-primary/60",
    dotColor: "bg-primary"
  },
  {
    number: "02",
    icon: FileText,
    title: "Create Your Listing",
    description: "Post your service or equipment on the marketplace. Add photos, set your price in RENTX, define your availability, and choose your location. Listings are live within minutes.",
    detail: "Templates available for quick setup",
    accentColor: "secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    borderGlow: "group-hover:border-secondary/30 group-hover:shadow-[0_0_40px_rgba(255,219,157,0.08)]",
    numberColor: "text-secondary/20 group-hover:text-secondary/60",
    dotColor: "bg-secondary"
  },
  {
    number: "03",
    icon: ArrowLeftRight,
    title: "Transact Peer-to-Peer",
    description: "Pay or receive RENTX directly to your wallet — no middlemen, no banks, no delays. Solana ensures near-instant settlement with fees under a fraction of a cent.",
    detail: "Fees: < $0.001 per transaction",
    accentColor: "tertiary",
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
    borderGlow: "group-hover:border-tertiary/30 group-hover:shadow-[0_0_40px_rgba(0,219,233,0.08)]",
    numberColor: "text-tertiary/20 group-hover:text-tertiary/60",
    dotColor: "bg-tertiary"
  },
  {
    number: "04",
    icon: Star,
    title: "Build Your Reputation",
    description: "Leave and receive feedback after every transaction. Your on-chain reputation grows with each successful rental, unlocking featured spots and community trust badges.",
    detail: "Reputation scores are immutable on-chain",
    accentColor: "primary",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
    borderGlow: "group-hover:border-primary/30 group-hover:shadow-[0_0_40px_rgba(152,203,255,0.08)]",
    numberColor: "text-primary/20 group-hover:text-primary/60",
    dotColor: "bg-primary"
  }
]

export function HowToJoin() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6" style={{ borderColor: 'rgba(152, 203, 255, 0.2)' }}>
            <span className="text-primary text-xs tracking-[0.05em] uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Getting Started
            </span>
          </div>
          <h2 className="text-[40px] md:text-[56px] leading-[1.15] font-bold text-white mb-6 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
            Join the{' '}
            <span className="text-gradient-brand">RENTX Ecosystem</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Four simple steps to start renting, earning, and building reputation in the world&apos;s first Solana-powered rental marketplace.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connecting line (desktop) */}
          <div className="absolute hidden lg:block left-[60px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/30 via-secondary/30 to-tertiary/30 pointer-events-none" />

          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className={`group relative glass-card rounded-[28px] p-8 lg:p-10 transition-all duration-500 hover:-translate-y-1 ${step.borderGlow}`}
                >
                  <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
                    {/* Left: Number + Icon */}
                    <div className="flex items-center gap-5 lg:flex-col lg:items-center lg:min-w-[80px] shrink-0">
                      <div className="relative">
                        <div className={`w-[72px] h-[72px] rounded-2xl ${step.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon size={32} className={step.iconColor} strokeWidth={1.5} />
                        </div>
                        {/* Step number badge */}
                        <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${step.dotColor} flex items-center justify-center`}>
                          <span className="text-[11px] font-bold text-surface" style={{ fontFamily: 'var(--font-mono)' }}>{step.number}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[24px] md:text-[28px] leading-[36px] font-bold text-white mb-3 tracking-[-0.01em]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {step.title}
                      </h3>
                      <p className="text-on-surface-variant text-base leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high/60 border border-white/5">
                        <span className={`w-2 h-2 rounded-full ${step.dotColor} shrink-0`} />
                        <span className="text-xs text-on-surface-variant" style={{ fontFamily: 'var(--font-mono)' }}>{step.detail}</span>
                      </div>
                    </div>

                    {/* Arrow indicator (desktop) */}
                    {i < steps.length - 1 && (
                      <div className="hidden lg:flex items-center self-center">
                        <ChevronRight size={20} className="text-outline-variant opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom mascot */}
        <div className="flex justify-center mt-14">
          <img
            src="/circular pengu.png"
            alt="RENTX Penguin mascot"
            className="w-24 opacity-30 hover:opacity-70 hover:scale-110 transition-all duration-500"
          />
        </div>
      </div>
    </section>
  )
}
