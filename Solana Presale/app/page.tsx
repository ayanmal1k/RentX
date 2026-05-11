import { ParticleBackground } from '@/components/particle-background';
import { HeroSection } from '@/components/hero-section';
import { MissionVisionSection } from '@/components/mission-vision-section';
import { TokenomicsSection } from '@/components/tokenomics-section';
import { RoadmapSection } from '@/components/roadmap-section';
import { SocialSection } from '@/components/social-section';
import { HowToBuySection } from '@/components/how-to-buy-section';
import { PresaleSection } from '@/components/presale-section';

export default function Home() {
  return (
    <main className="relative w-full bg-black overflow-hidden">
      <ParticleBackground />
      
      {/* Content on top of particles */}
      <div className="relative z-10">
        <HeroSection />
        <MissionVisionSection />
        <HowToBuySection />
        
        
        <PresaleSection />
        <TokenomicsSection />
        <RoadmapSection />
        <SocialSection />
      </div>
    </main>
  )
}
