import { MarketplaceNavbar } from '@/components/rentx/MarketplaceNavbar'
import { MarketplaceFooter } from '@/components/rentx/MarketplaceFooter'
import { Search, MapPin, Calendar, Clock, Star, Shield, Zap } from 'lucide-react'

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-sparkle overflow-clip flex flex-col">
      <MarketplaceNavbar />
      
      {/* Coming Soon Hero */}
      <section className="relative flex-grow flex flex-col justify-center items-center pt-24 pb-32 px-6 overflow-hidden">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Primary Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-container-low/80 border border-secondary/30 backdrop-blur-md mb-8 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary text-[12px] tracking-[0.2em] uppercase font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
              Under Construction
            </span>
          </div>

          <h1 className="text-[42px] sm:text-[56px] md:text-[72px] lg:text-[84px] leading-[1.1] mb-8 text-white tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
            THE GLOBAL <br className="hidden sm:block" />
            <span className="text-gradient-brand">RENTAL HUB</span>
          </h1>

          <p className="text-on-surface-variant mb-12 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed">
            We are building the first fully decentralized, Solana-powered marketplace for rentals, services, and talent. The future of peer-to-peer utility is launching soon.
          </p>

          {/* Interactive Search Mockup */}
          <div className="w-full max-w-3xl bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-4 group hover:border-primary/30 transition-colors duration-500 mb-16">
            <div className="flex-grow flex items-center gap-3 w-full sm:w-auto bg-surface-dim/50 rounded-xl px-4 py-3 border border-white/5 group-hover:border-primary/20 transition-colors">
              <Search className="text-on-surface-variant w-5 h-5" />
              <input type="text" placeholder="What do you need to rent?" className="bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant/50 w-full text-sm sm:text-base" disabled />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto bg-surface-dim/50 rounded-xl px-4 py-3 border border-white/5">
              <MapPin className="text-on-surface-variant w-5 h-5" />
              <span className="text-on-surface-variant/50 text-sm sm:text-base">Anywhere</span>
            </div>
            <button className="w-full sm:w-auto bg-primary/50 text-on-primary/50 px-8 py-3 rounded-xl font-bold cursor-not-allowed border border-primary/20">
              Search
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl text-center">
             <div className="glass-card p-6 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                 <Zap className="w-6 h-6" />
               </div>
               <h3 className="text-white font-bold text-lg">Instant Booking</h3>
               <p className="text-xs text-on-surface-variant">Smart contracts execute instantly.</p>
             </div>
             <div className="glass-card p-6 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-12 h-12 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary-container">
                 <Shield className="w-6 h-6" />
               </div>
               <h3 className="text-white font-bold text-lg">Secure Escrow</h3>
               <p className="text-xs text-on-surface-variant">Funds locked until fulfillment.</p>
             </div>
             <div className="glass-card p-6 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                 <Star className="w-6 h-6" />
               </div>
               <h3 className="text-white font-bold text-lg">Verified Reviews</h3>
               <p className="text-xs text-on-surface-variant">On-chain reputation system.</p>
             </div>
             <div className="glass-card p-6 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                 <Clock className="w-6 h-6" />
               </div>
               <h3 className="text-white font-bold text-lg">Micro-Rentals</h3>
               <p className="text-xs text-on-surface-variant">Rent by the hour or minute.</p>
             </div>
          </div>
        </div>
      </section>

      <MarketplaceFooter />

      {/* Global ambient glow layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-container/[0.03] blur-[120px] rounded-full" />
      </div>
    </main>
  )
}
