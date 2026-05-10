'use client'

import React from 'react'
import { AlertTriangle, Zap } from 'lucide-react'

const problems = [
  "Listings scattered across dozens of platforms",
  "Trust is inconsistent and unverifiable",
  "Cross-border payments are slow & expensive"
]

const solutions = [
  "One unified, community-driven marketplace",
  "On-chain reputation & community trust layers",
  "Solana-powered instant, near-zero-fee payments"
]

export function ProblemSolution() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6" style={{ borderColor: 'rgba(152, 203, 255, 0.2)' }}>
            <span className="text-primary text-xs tracking-[0.05em] uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Why RENTX?
            </span>
          </div>
          <h2 className="text-[40px] md:text-[56px] leading-[1.15] font-bold text-white tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
            The Rental Economy is{' '}
            <span className="text-gradient-brand">Broken</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="glass-card rounded-[32px] p-10 md:p-12 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500" style={{ borderColor: 'rgba(255, 100, 100, 0.15)' }}>
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-error/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-error/10 transition-colors duration-500" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center">
                <AlertTriangle size={28} className="text-error" />
              </div>
              <h3 className="text-[28px] md:text-[32px] leading-[40px] font-bold text-error tracking-[-0.01em]" style={{ fontFamily: 'var(--font-heading)' }}>
                The Problem
              </h3>
            </div>

            <p className="text-on-surface-variant mb-8 leading-relaxed">
              The current rental and gig economy is fragmented and inefficient. Finding reliable services shouldn&apos;t require searching across a dozen platforms.
            </p>

            <div className="space-y-4">
              {problems.map((problem, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-error/[0.04] border border-error/10">
                  <span className="text-error mt-0.5 shrink-0">✕</span>
                  <p className="text-sm text-on-surface-variant">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Card */}
          <div className="glass-card rounded-[32px] p-10 md:p-12 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500" style={{ borderColor: 'rgba(152, 203, 255, 0.15)' }}>
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap size={28} className="text-primary" />
              </div>
              <h3 className="text-[28px] md:text-[32px] leading-[40px] font-bold text-primary tracking-[-0.01em]" style={{ fontFamily: 'var(--font-heading)' }}>
                The Solution
              </h3>
            </div>

            <p className="text-on-surface-variant mb-8 leading-relaxed">
              RENTX provides a lightweight, community-driven rental ecosystem powered by Solana. Providers list, users pay in RENTX, communities promote.
            </p>

            <div className="space-y-4">
              {solutions.map((solution, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-primary/[0.04] border border-primary/10">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  <p className="text-sm text-on-surface-variant">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sliding pengu between sections */}
        <div className="flex justify-center mt-12">
          <img
            src="/sliding pengu.png"
            alt="Penguin mascot sliding"
            className="w-28 opacity-40 hover:opacity-80 hover:scale-110 transition-all duration-500"
          />
        </div>
      </div>
    </section>
  )
}
