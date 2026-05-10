'use client'

import React from 'react'

const phases = [
  {
    number: 1,
    title: "Phase 1: Foundation",
    description: "Token launch, rule definitions, and the release of verified listing templates.",
    color: "primary",
    bgClass: "bg-primary",
    textClass: "text-on-primary",
    borderClass: "border-primary/20"
  },
  {
    number: 2,
    title: "Phase 2: Growth",
    description: "International expansion and the rollout of global ambassador programs.",
    color: "secondary",
    bgClass: "bg-secondary-container",
    textClass: "text-on-secondary-container",
    borderClass: "border-secondary/20",
    extraClass: "md:-translate-y-4"
  },
  {
    number: 3,
    title: "Phase 3: Expansion",
    description: "Marketplace smart contracts, reputation systems, and automated escrow integration.",
    color: "tertiary",
    bgClass: "bg-tertiary",
    textClass: "text-on-tertiary",
    borderClass: "border-tertiary/20"
  }
]

export function Roadmap() {
  return (
    <section className="py-20" id="roadmap">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[40px] md:text-[56px] leading-[1.15] font-bold text-center text-white mb-16 tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
          The Journey Ahead
        </h2>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="absolute hidden md:block top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-tertiary-container opacity-20 -translate-y-1/2 pointer-events-none" />

          {phases.map((phase) => (
            <div
              key={phase.number}
              className={`relative glass-card p-8 rounded-2xl z-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 ${phase.borderClass} ${phase.extraClass || ''}`}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            >
              <div className={`w-14 h-14 ${phase.bgClass} rounded-full flex items-center justify-center ${phase.textClass} font-bold mb-6 text-lg shadow-lg`}>
                {phase.number}
              </div>
              <h4 className="text-[28px] md:text-[32px] leading-[40px] font-semibold text-white mb-4 tracking-[-0.01em]" style={{ fontFamily: 'var(--font-heading)' }}>
                {phase.title}
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">{phase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
