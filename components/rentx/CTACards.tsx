'use client'

import React from 'react'
import { ShoppingCart, Wrench, ArrowRight, CheckCircle2, Globe, Zap, Shield } from 'lucide-react'

export function CTACards() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6" style={{ borderColor: 'rgba(255, 219, 157, 0.2)' }}>
            <span className="text-secondary text-xs tracking-[0.05em] uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Start Now
            </span>
          </div>
          <h2 className="text-[40px] md:text-[56px] leading-[1.15] font-bold text-white mb-4 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to{' '}
            <span className="text-gradient-brand">Get Started?</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Whether you&apos;re looking for top-tier services or ready to monetize your skills, RENTX has you covered.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Need a Service? */}
          <div className="relative glass-card rounded-[36px] overflow-hidden group hover:-translate-y-2 transition-all duration-500" style={{ borderColor: 'rgba(152, 203, 255, 0.15)' }}>
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-primary-container to-primary/40" />

            {/* Background decorative icon */}
            <div className="absolute -right-12 -bottom-12 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
              <ShoppingCart size={320} strokeWidth={0.5} />
            </div>

            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/[0.03] blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/[0.08] transition-colors duration-700" />

            <div className="relative z-10 p-10 md:p-14">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart size={32} className="text-primary" strokeWidth={1.5} />
              </div>

              <h3 className="text-[28px] md:text-[36px] leading-[1.15] font-bold text-white mb-4 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Need a Service?
              </h3>
              <p className="text-on-surface-variant mb-8 text-base md:text-lg leading-relaxed max-w-md">
                Browse thousands of community-verified providers and equipment for your next event, project, or creative production.
              </p>

              {/* Feature bullets */}
              <div className="space-y-3 mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span className="text-sm text-on-surface-variant">Verified community providers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-primary shrink-0" />
                  <span className="text-sm text-on-surface-variant">Global marketplace with local listings</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-primary shrink-0" />
                  <span className="text-sm text-on-surface-variant">Instant Solana-powered payments</span>
                </div>
              </div>

              <button className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold text-lg hover:scale-[1.03] active:scale-95 transition-all duration-200 glow-blue flex items-center gap-3 group/btn">
                Browse Services
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Have Skills or Gear? */}
          <div className="relative glass-card rounded-[36px] overflow-hidden group hover:-translate-y-2 transition-all duration-500" style={{ borderColor: 'rgba(255, 219, 157, 0.15)' }}>
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-secondary via-secondary-container to-secondary/40" />

            {/* Background decorative icon */}
            <div className="absolute -right-12 -bottom-12 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
              <Wrench size={320} strokeWidth={0.5} />
            </div>

            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/[0.03] blur-[80px] rounded-full pointer-events-none group-hover:bg-secondary/[0.08] transition-colors duration-700" />

            <div className="relative z-10 p-10 md:p-14">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Wrench size={32} className="text-secondary" strokeWidth={1.5} />
              </div>

              <h3 className="text-[28px] md:text-[36px] leading-[1.15] font-bold text-white mb-4 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Have Skills or Gear?
              </h3>
              <p className="text-on-surface-variant mb-8 text-base md:text-lg leading-relaxed max-w-md">
                Monetize your professional gear and talents. Reach a global audience and get paid instantly with zero platform fees.
              </p>

              {/* Feature bullets */}
              <div className="space-y-3 mb-10">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-secondary shrink-0" />
                  <span className="text-sm text-on-surface-variant">On-chain reputation & trust scores</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-secondary shrink-0" />
                  <span className="text-sm text-on-surface-variant">Reach clients worldwide, 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-secondary shrink-0" />
                  <span className="text-sm text-on-surface-variant">Direct wallet payments — no middlemen</span>
                </div>
              </div>

              <button className="bg-secondary text-on-secondary px-8 py-4 rounded-2xl font-bold text-lg hover:scale-[1.03] active:scale-95 transition-all duration-200 glow-gold flex items-center gap-3 group/btn">
                Register as Provider
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
