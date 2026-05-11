'use client'

import { BuyNavbar } from '@/components/rentx/BuyNavbar'
import { Footer } from '@/components/rentx/Footer'
import { BuyRentxBox } from '@/components/rentx/BuyRentxBox'
import { BuyRentxVisuals } from '@/components/rentx/BuyRentxVisuals'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Zap, Coins, Info, Lock, Globe } from 'lucide-react'
import { useState } from 'react'

type Currency = 'SOL' | 'USDC'

export default function BuyRentxPage() {
  const [currency, setCurrency] = useState<Currency>('USDC')

  return (
    <main className="min-h-screen bg-sparkle overflow-x-hidden selection:bg-primary/30">
      <BuyNavbar />
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Ambient Atmospheric Glows - Matched to Homepage Vibe */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.05] blur-[180px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-container/[0.05] blur-[150px] rounded-full" />
        
        {/* Subtle Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_80%)]" />
      </div>

      <section className="relative pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-primary text-xs font-black tracking-[0.3em] uppercase mb-10 backdrop-blur-xl shadow-[0_0_20px_rgba(212,175,55,0.1)]"
            >
              <Sparkles size={16} className="text-primary animate-pulse" />
              Institutional Asset Gateway
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="text-7xl md:text-9xl font-black text-white mb-10 leading-[0.85] tracking-tighter"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ACQUIRE <span className="text-gradient-brand">RENTX</span> <br />
              <span className="text-5xl md:text-7xl opacity-90">THE LUXURY STANDARD</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-on-surface-variant text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed opacity-80"
            >
              Bridging digital liquidity with premium real-world yields. 
              Join the elite circle of RENTX holders on Solana.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
            {/* Left Column: Swap Box */}
            <div className="lg:col-span-7 order-1">
              <div className="relative">
                <BuyRentxBox currency={currency} onCurrencyChange={setCurrency} />
                
                {/* SOL Gas Fee Tip */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3 text-primary/80 max-w-xl mx-auto lg:mx-0"
                >
                  <Info size={18} className="shrink-0" />
                  <p className="text-xs font-bold leading-relaxed uppercase tracking-wider">
                    <span className="text-white">Note:</span> Your account must maintain a small SOL balance (approx 0.01 SOL) to cover Solana network gas fees.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Visuals */}
            <div className="lg:col-span-5 order-2 flex justify-center">
              <BuyRentxVisuals currency={currency} />
            </div>
          </div>

          {/* Horizontal Security Cards Section */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Lock className="text-primary" />,
                title: 'Institutional Grade',
                desc: 'Multi-signature vaults and cold storage ensure maximum asset protection.'
              },
              {
                icon: <Zap className="text-secondary" />,
                title: 'Lightning Speed',
                desc: 'Leverage Solana\'s high-throughput architecture for sub-second settlement.'
              },
              {
                icon: <Globe className="text-tertiary" />,
                title: 'Global Compliance',
                desc: 'Built with rigorous transparency and regulatory standards at the core.'
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all hover:border-primary/20 hover:bg-white/[0.04] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-3 uppercase tracking-wider">{card.title}</h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-70">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
