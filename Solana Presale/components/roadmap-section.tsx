'use client';

import { ClipboardCheck, Rocket, Layers, TrendingUp, type LucideIcon } from 'lucide-react';

export function RoadmapSection() {
  const roadmapStages: Array<{
    phase: string;
    title: string;
    description: string;
    icon: LucideIcon;
    highlight: string;
  }> = [
    {
      phase: 'Phase 1',
      title: 'Project Preparation',
      description: 'Website development, smart contract deployment, and community growth initiatives.',
      icon: ClipboardCheck,
      highlight: 'Foundation',
    },
    {
      phase: 'Phase 2',
      title: 'Token Pre-Sale',
      description: 'Token pre-sale launch and professional marketing campaigns to expand the global community.',
      icon: Rocket,
      highlight: 'Launch',
    },
    {
      phase: 'Phase 3',
      title: 'Ecosystem Activation',
      description: 'Capital deployment into diversified strategies and infrastructure expansion.',
      icon: Layers,
      highlight: 'Expansion',
    },
    {
      phase: 'Phase 4',
      title: 'Long-Term Growth',
      description: 'Periodic distribution mechanisms, strategic partnerships, and continued development.',
      icon: TrendingUp,
      highlight: 'Scale',
    },
  ];

  return (
    <section id="roadmap" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Section Container */}
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider mb-4"
            style={{
              fontFamily: "'Sweet Gothic Serif', serif",
              color: '#000000',
              letterSpacing: '0.05em',
            }}
          >
            GTTWRLD Roadmap
          </h2>
          <p 
            className="text-base sm:text-lg text-black opacity-75 mt-4"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            Our journey to building a sustainable blockchain ecosystem
          </p>
        </div>

        {/* Card Grid Roadmap */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {roadmapStages.map((stage, index) => {
            const StageIcon = stage.icon;

            return (
              <article
                key={index}
                className="group relative rounded-2xl border border-black/15 bg-white p-6 sm:p-7 overflow-hidden transition-all duration-300"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              >
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-black via-gray-700 to-black/70"></div>

                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p
                      className="text-xs sm:text-sm text-black/55 uppercase tracking-[0.18em] mb-2"
                      style={{ fontFamily: "'Sweet Gothic Serif', serif" }}
                    >
                      {stage.phase}
                    </p>
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-black leading-tight"
                      style={{ fontFamily: "'Sweet Gothic Serif', serif" }}
                    >
                      {stage.title}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-[0_8px_18px_rgba(0,0,0,0.25)] flex-shrink-0">
                    <StageIcon size={24} strokeWidth={2.2} />
                  </div>
                </div>

                <p
                  className="text-sm sm:text-base text-black/75 leading-relaxed mb-6"
                  style={{ fontFamily: "'Georgia', 'Garamond', serif" }}
                >
                  {stage.description}
                </p>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                  <span
                    className="text-xs sm:text-sm uppercase tracking-[0.14em] text-black/55"
                    style={{ fontFamily: "'Sweet Gothic Serif', serif" }}
                  >
                    Stage Focus
                  </span>
                  <span
                    className="text-sm sm:text-base font-bold text-black"
                    style={{ fontFamily: "'Sweet Gothic Serif', serif" }}
                  >
                    {stage.highlight}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 200% 0;
          }
          50% {
            background-position: -200% 0;
          }
        }

        @font-face {
          font-family: 'Sweet Gothic Serif';
          src: url('/Font/sweet-gothic-serif-font/sweet-gothic-serif-bold.ttf') format('truetype');
          font-weight: bold;
        }

        @font-face {
          font-family: 'Sweet Gothic Serif';
          src: url('/Font/sweet-gothic-serif-font/sweet-gothic-serif-regular.ttf') format('truetype');
          font-weight: normal;
        }
      `}</style>
    </section>
  );
}
