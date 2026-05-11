'use client';

import { Mail, Facebook } from 'lucide-react';

export function SocialSection() {
  const socialLinks = [
    {
      name: 'Facebook',
      description: 'Join our community on Facebook for updates and discussions.',
      link: 'https://www.facebook.com/oxff.shot',
      bgGradient: 'from-white to-gray-100',
    },
  ];

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
            Join Our Community
          </h2>
          <p 
            className="text-base sm:text-lg text-black opacity-75 mt-4"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            Connect with us on social media for the latest news and updates
          </p>
        </div>

        {/* Support CTA */}
        <div className="mb-12 text-center">
          <h3
            className="text-3xl sm:text-4xl font-bold tracking-wider mb-4"
            style={{
              fontFamily: "'Sweet Gothic Serif', serif",
              color: '#000000',
            }}
          >
            Reach GTTWRLD Support
          </h3>

          <a
            href="mailto:support@GTTWRLD.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "'Sweet Gothic Serif', serif",
              backgroundColor: 'transparent',
              border: '2px solid #000000',
              color: '#000000',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={(e) => {
              const element = e.currentTarget as HTMLElement;
              element.style.backgroundColor = '#000000';
              element.style.color = '#FFFFFF';
              element.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              const element = e.currentTarget as HTMLElement;
              element.style.backgroundColor = 'transparent';
              element.style.color = '#000000';
              element.style.boxShadow = 'none';
            }}
          >
            <Mail size={18} />
            Email Us
          </a>

          <p
            className="text-sm sm:text-base text-black opacity-85 mt-3"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            support@GTTWRLD.com
          </p>
        </div>

        {/* Social Cards */}
        <div className="max-w-xl mx-auto">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                className={`relative bg-gradient-to-br ${social.bgGradient} border border-black rounded-2xl overflow-hidden transition-all duration-300 flex flex-col text-center`}
                style={{
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  element.style.boxShadow = '0 14px 36px rgba(0, 0, 0, 0.2)';
                  element.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  const element = e.currentTarget as HTMLElement;
                  element.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                  element.style.transform = 'translateY(0)';
                }}
              >
                {/* Shine overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
                  }}
                ></div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #000000 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                  }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 sm:p-10 flex flex-col items-center">
                  {/* Icon Container */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Facebook size={36} strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="text-center w-full">
                    <div>
                      <h3 
                        className="text-2xl sm:text-3xl font-bold mb-4 transition-all duration-300"
                        style={{
                          fontFamily: "'Sweet Gothic Serif', serif",
                          background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                          backgroundSize: '200% 200%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          animation: 'shimmer 3s ease-in-out infinite',
                        }}
                      >
                        {social.name}
                      </h3>

                      <p 
                        className="text-sm sm:text-base leading-relaxed text-black opacity-90 mx-auto max-w-md px-2"
                        style={{
                          fontFamily: "'Georgia', 'Garamond', serif",
                        }}
                      >
                        {social.description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8 pt-6 border-t border-black/15">
                      <div
                        className="inline-block px-8 py-3 rounded-lg font-bold transition-all duration-300 group-hover:scale-105"
                        style={{
                          fontFamily: "'Sweet Gothic Serif', serif",
                          backgroundColor: 'transparent',
                          border: '2px solid #000000',
                          color: '#000000',
                          letterSpacing: '0.05em',
                        }}
                        onMouseEnter={(e) => {
                          const element = e.currentTarget as HTMLElement;
                          element.style.backgroundColor = '#000000';
                          element.style.color = '#FFFFFF';
                          element.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          const element = e.currentTarget as HTMLElement;
                          element.style.backgroundColor = 'transparent';
                          element.style.color = '#000000';
                          element.style.boxShadow = 'none';
                        }}
                      >
                        Follow Us
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Stats */}
        {/* <div className="mt-16 pt-12 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <h4 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                100K+
              </h4>
              <p className="text-sm text-gray-400" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Community Members
              </p>
            </div>
            <div className="text-center">
              <h4 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                50K+
              </h4>
              <p className="text-sm text-gray-400" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Community Members
              </p>
            </div>
            <div className="text-center">
              <h4 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                24/7
              </h4>
              <p className="text-sm text-gray-400" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Active Support
              </p>
            </div>
            <div className="text-center">
              <h4 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #000000 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                150+
              </h4>
              <p className="text-sm text-gray-400" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Countries
              </p>
            </div>
          </div>
        </div> */}
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
