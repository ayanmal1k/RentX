import { Navbar } from '@/components/rentx/Navbar'
import { Hero } from '@/components/rentx/Hero'
import { ProblemSolution } from '@/components/rentx/ProblemSolution'
import { Mission } from '@/components/rentx/Mission'
import { TokenUtility } from '@/components/rentx/TokenUtility'
import { Services } from '@/components/rentx/Services'
import { Roadmap } from '@/components/rentx/Roadmap'
import { Tokenomics } from '@/components/rentx/Tokenomics'
import { HowToJoin } from '@/components/rentx/HowToJoin'
import { CTACards } from '@/components/rentx/CTACards'
import { Footer } from '@/components/rentx/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-sparkle overflow-clip">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <Mission />
      <TokenUtility />
      <Services />
      <Roadmap />
      <Tokenomics />
      <HowToJoin />
      <CTACards />
      <Footer />

      {/* Global ambient glow layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-container/[0.03] blur-[120px] rounded-full" />
      </div>
    </main>
  )
}
