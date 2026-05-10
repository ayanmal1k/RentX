'use client'

import React, from 'react'
import { Coins, Layers, Flame, Link2, Users, Shield, Zap, DollarSign } from 'lucide-react'

const mainStats = [
  {
    label: "Total Supply",
    value: "1,000,000,000",
    subtext: "RENTX Tokens",
    icon: Coins,
    color: "primary",
    bgClass: "bg-primary/10",
    textClass: "text-primary",
    borderClass: "rgba(152, 203, 255, 0.2)"
  },
  {
    label: "Blockchain",
    value: "Solana",
    subtext: "High-speed L1",
    icon: Link2,
    color: "secondary",
    bgClass: "bg-secondary/10",
    textClass: "text-secondary",
    borderClass: "rgba(255, 219, 157, 0.2)"
  },
  {
    label: "Minting",
    value: "Fixed Supply",
    subtext: "No future inflation",
    icon: Layers,
    color: "tertiary",
    bgClass: "bg-tertiary/10",
    textClass: "text-tertiary",
    borderClass: "rgba(0, 219, 233, 0.2)"
  },
  {
    label: "Burning",
    value: "None Planned",
    subtext: "Preserving ecosystem balance",
    icon: Flame,
    color: "error",
    bgClass: "bg-error/10",
    textClass: "text-error",
    borderClass: "rgba(255, 180, 171, 0.2)"
  }
]

const miniStats = [
  { value: "100%", label: "Community Owned", icon: Users, hoverColor: "hover:border-primary/40 group-hover:text-primary" },
  { value: "0%", label: "Buy/Sell Tax", icon: Shield, hoverColor: "hover:border-secondary/40 group-hover:text-secondary" },
  { value: "~400ms", label: "Tx Finality", icon: Zap, hoverColor: "hover:border-tertiary/40 group-hover:text-tertiary" },
  { value: "$0.001", label: "Avg Fee", icon: DollarSign, hoverColor: "hover:border-primary/40 group-hover:text-primary" }
]

export function Tokenomics() {
  return (
    <section className="py-24 relative" id="tokenomics">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.02] blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6" style={{ borderColor: 'rgba(255, 219, 157, 0.2)' }}>
            <span className="text-secondary text-xs tracking-[0.05em] uppercase" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              Token Economy
            </span>
          </div>
          <h2 className="text-[40px] md:text-[56px] leading-[1.15] font-bold text-white tracking-[-0.02em]" style={{ fontFamily: 'var(--font-heading)' }}>
            RENTX Tokenomics
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto mt-4 text-base md:text-lg leading-relaxed">
            Designed for stability, speed, and massive global scale without the friction of hidden taxes or surprise inflation.
          </p>
        </div>

        {/* Main 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {mainStats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div 
                key={i}
                className="group relative glass-card p-8 md:p-10 rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                style={{ borderColor: stat.borderClass }}
              >
                {/* Hover Background Glow */}
                <div className={`absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl ${stat.bgClass}`} />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <p className="text-sm uppercase tracking-wider text-on-surface-variant mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                      {stat.label}
                    </p>
                    <h3 className={`text-[32px] md:text-[40px] leading-tight font-bold mb-1 tracking-[-0.01em] ${stat.textClass}`} style={{ fontFamily: 'var(--font-heading)' }}>
                      {stat.value}
                    </h3>
                    <p className="text-sm text-on-surface-variant opacity-80">
                      {stat.subtext}
                    </p>
                  </div>
                  
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${stat.bgClass} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={32} className={stat.textClass} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Decorative corner lines */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 opacity-0 group-hover:opacity-20 transition-all duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" style={{ borderColor: 'var(--' + stat.color + ')' }} />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 opacity-0 group-hover:opacity-20 transition-all duration-500 transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" style={{ borderColor: 'var(--' + stat.color + ')' }} />
              </div>
            )
          })}
        </div>

        {/* Bottom Mini Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {miniStats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div 
                key={i} 
                className={`group glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${stat.hoverColor}`}
              >
                <Icon size={24} className="mb-4 text-on-surface-variant opacity-50 transition-colors duration-300 group-hover:opacity-100" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-2 transition-colors duration-300" style={{ fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider transition-colors duration-300" style={{ fontFamily: 'var(--font-mono)' }}>
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
