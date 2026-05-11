'use client';

import { Download, FileText } from 'lucide-react';

export function ReadWhitepaperSection() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Mintora-Xora Whitepaper.pdf';
    link.download = 'Yo-Gotti-World-Whitepaper.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-transparent" id="whitepaper">
      {/* Section Container */}
      <div className="max-w-4xl mx-auto">
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
            Read Our Whitepaper
          </h2>
          <p 
            className="text-base sm:text-lg text-black opacity-75 mt-4"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            Explore the complete technical and strategic documentation of the Yo Gotti World ecosystem
          </p>
        </div>

        {/* Whitepaper Card */}
        <div
          className="relative group bg-gradient-to-br from-gray-900 to-black border border-black rounded-xl p-8 sm:p-12 overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,245,245,1) 100%)',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)',
            borderColor: 'rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Shine overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
            }}
          ></div>

          <div className="relative z-10">
            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left - Icon and Description */}
              <div className="space-y-6">
                {/* Large Icon */}
                <div 
                  className="w-24 h-24 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <FileText 
                    size={56} 
                    color="#000000"
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Description */}
                <div>
                  <h3 
                    className="text-2xl sm:text-3xl font-bold mb-3"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Yo Gotti World Whitepaper
                  </h3>

                  <p 
                    className="text-sm sm:text-base text-black opacity-90 leading-relaxed mb-4"
                    style={{
                      fontFamily: "'Georgia', 'Garamond', serif",
                    }}
                  >
                    Discover the comprehensive vision, mission, and technical roadmap behind the GTTWRLD ecosystem. Learn about our innovative approach to blockchain infrastructure, capital allocation strategies, and community-driven development.
                  </p>

                  {/* Key Points */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span 
                        className="text-lg font-bold mt-0.5"
                        style={{ color: '#000000' }}
                      >
                        •
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700">Official project documentation and vision</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span 
                        className="text-lg font-bold mt-0.5"
                        style={{ color: '#000000' }}
                      >
                        •
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700">Strategic roadmap and ecosystem structure</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span 
                        className="text-lg font-bold mt-0.5"
                        style={{ color: '#000000' }}
                      >
                        •
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700">Tokenomics and distribution details</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Download Section */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className="relative w-full max-w-xs bg-gradient-to-br from-gray-800 to-black border border-black/20 rounded-lg p-8 text-center space-y-6 transition-all duration-300"
                  style={{
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  {/* Download Icon */}
                  <div>
                    <Download 
                      size={48} 
                      color="#000000"
                      className="mx-auto transition-all duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <p 
                      className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest mb-2"
                      style={{
                        fontFamily: "'Sweet Gothic Serif', serif",
                      }}
                    >
                      Download PDF
                    </p>
                    <p className="text-xs text-gray-500">Version 1.0</p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-3 text-base font-bold rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      letterSpacing: '0.05em',
                      boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      const element = e.currentTarget as HTMLElement;
                      element.style.backgroundColor = '#333333';
                      element.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      const element = e.currentTarget as HTMLElement;
                      element.style.backgroundColor = '#000000';
                      element.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    <Download size={20} />
                    Download
                  </button>

                  {/* File Info */}
                  <p className="text-xs text-gray-500 border-t border-gray-700 pt-4">
                    PDF Document • ~500 KB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 text-center">
          <p 
            className="text-xs sm:text-sm text-gray-500 leading-relaxed"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            The whitepaper contains comprehensive information about the Yo Gotti World (GTTWRLD) ecosystem, including market opportunity analysis, vision and mission statements, ecosystem structure, investment allocation concepts, profit distribution models, and detailed roadmap phases.
          </p>
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
