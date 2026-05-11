'use client';

export function MissionVisionSection() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Section Container */}
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider mb-4"
            style={{
              fontFamily: "'Sweet Gothic Serif', serif",
              color: '#000000',
              letterSpacing: '0.05em',
            }}
          >
            Our Purpose
          </h2>
          <p 
            className="text-base sm:text-lg text-black opacity-75 mt-4"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            Building a transparent blockchain ecosystem for the future
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Mission Card */}
          <div 
            className="relative group h-full"
            style={{
              perspective: '1000px',
            }}
          >
            <div
              className="relative border border-black rounded-lg p-8 sm:p-10 overflow-hidden transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,1) 100%)',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                borderColor: 'rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Shine overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
                  animation: 'shimmerOverlay 2s ease-in-out infinite',
                }}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 
                  className="text-3xl sm:text-4xl font-bold mb-6"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                    color: '#000000',
                  }}
                >
                  Mission
                </h3>
                <p 
                  className="text-base sm:text-lg leading-relaxed text-black opacity-90 flex-grow"
                  style={{
                    fontFamily: "'Georgia', 'Garamond', serif",
                  }}
                >
                  Yo Gotti World's mission is to develop a transparent, community-focused blockchain ecosystem capable of exploring modern financial models. Through responsible development, strategic capital planning, and continuous innovation, the project seeks to create long-term value within the evolving digital economy.
                </p>

                {/* Highlight Stats */}
                <div className="mt-8 pt-6 border-t border-black/20">
                  <p 
                    className="text-sm text-gray-700 uppercase tracking-widest mb-3"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                    }}
                  >
                    Key Focus Areas
                  </p>
                  <ul className="space-y-2 text-sm text-black opacity-80">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Community-Focused Development
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Strategic Capital Planning
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Long-Term Value Creation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div 
            className="relative group h-full"
            style={{
              perspective: '1000px',
            }}
          >
            <div
              className="relative border border-black rounded-lg p-8 sm:p-10 overflow-hidden transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,1) 100%)',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                borderColor: 'rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Shine overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
                  animation: 'shimmerOverlay 2s ease-in-out infinite',
                }}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 
                  className="text-3xl sm:text-4xl font-bold mb-6"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                    color: '#000000',
                  }}
                >
                  Vision
                </h3>
                <p 
                  className="text-base sm:text-lg leading-relaxed text-black opacity-90 flex-grow"
                  style={{
                    fontFamily: "'Georgia', 'Garamond', serif",
                  }}
                >
                  The vision of Yo Gotti World (GTTWRLD) is to establish a globally accessible ecosystem where blockchain technology enables transparent participation in financial concepts that traditionally existed only in institutional environments. The project aims to develop a sustainable platform driven by community engagement, responsible growth, and strategic planning.
                </p>

                {/* Highlight Stats */}
                <div className="mt-8 pt-6 border-t border-black/20">
                  <p 
                    className="text-sm text-gray-700 uppercase tracking-widest mb-3"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                    }}
                  >
                    Core Values
                  </p>
                  <ul className="space-y-2 text-sm text-black opacity-80">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Global Accessibility
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Transparent Participation
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Sustainable Growth
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

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

        @keyframes shimmerOverlay {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.2;
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
