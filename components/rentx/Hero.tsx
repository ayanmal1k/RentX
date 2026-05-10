'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Content */}
        <div className="z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8" style={{ borderColor: 'rgba(152, 203, 255, 0.2)' }}>
            <span className="text-primary text-sm">🚀</span>
            <span className="text-primary text-xs tracking-[0.05em] uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Powered by Solana
            </span>
          </div>

          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] mb-6 text-white font-bold tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
            RENTX: The Global Currency for the{' '}
            <span className="text-gradient-brand">Rental Economy</span>
          </h1>

          <p className="text-on-surface-variant mb-10 max-w-lg mx-auto md:mx-0 text-base leading-relaxed">
            Simple, fast, and community-driven rentals powered by Solana. Unlock global listings with the efficiency of blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-gradient-to-r from-primary to-tertiary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95">
              Explore Marketplace <ArrowRight size={20} />
            </button>
            <button className="border border-outline-variant bg-surface-container-low/50 hover:bg-surface-container-high px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300">
              Buy RENTX
            </button>
          </div>
        </div>

        {/* Right: RENTX Logo from public */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-[120%] h-[120%] bg-primary/10 blur-[120px] rounded-full" />
          <img
            alt="RENTX Logo with Penguin Mascot"
            className="relative z-10 w-full max-w-[500px] drop-shadow-2xl animate-float"
            src="/RENTX Logo.png"
          />
        </div>
      </div>
    </section>
  )
}
