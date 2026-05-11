'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PRESALE_PHASES,
  PRESALE_START,
  PRESALE_END,
  LAUNCH_DATE,
  getPhaseForDate,
  getPresaleStatus,
  getUpcomingPhase,
} from '@/lib/presale-config';

export function PresaleSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [presaleStatus, setPresaleStatus] = useState<'notStarted' | 'active' | 'ended'>('notStarted');
  const [currentPhase, setCurrentPhase] = useState(PRESALE_PHASES[0]);
  const [upcomingPhase, setUpcomingPhase] = useState<typeof PRESALE_PHASES[0] | null>(PRESALE_PHASES[1]);

  // Countdown timer code
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      const status = getPresaleStatus(now);
      setPresaleStatus(status);

      if (status === 'notStarted') {
        setCurrentPhase(PRESALE_PHASES[0]);
        const difference = PRESALE_START.getTime() - now.getTime();
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else if (status === 'active') {
        const activePhase = getPhaseForDate(now);
        setCurrentPhase(activePhase);
        const nextPhase = getUpcomingPhase(activePhase);
        setUpcomingPhase(nextPhase);
        const difference = activePhase.endDate.getTime() - now.getTime();
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setCurrentPhase(PRESALE_PHASES[PRESALE_PHASES.length - 1]);
        setUpcomingPhase(null);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Section Container */}
      <div className="max-w-5xl mx-auto">
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
            Presale
          </h2>
          <p 
            className="text-base sm:text-lg text-black opacity-75 mt-4"
            style={{
              fontFamily: "'Georgia', 'Garamond', serif",
            }}
          >
            {presaleStatus === 'ended'
              ? 'The GTTWRLD presale has officially ended. Thank you to all participants.'
              : presaleStatus === 'notStarted'
              ? 'The presale opens on April 25, 2026. Get ready to secure your GTTWRLD tokens!'
              : `Limited time offer - Phase ${currentPhase.phase}: ${currentPhase.label}`}
          </p>
        </div>

        {/* Main Presale Card */}
        <div
          className="relative group bg-gradient-to-br from-white to-gray-100 border border-black rounded-xl p-8 sm:p-12 overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
          style={{
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 0, 0, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Shine overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
            }}
          ></div>

          <div className="relative z-10 space-y-8">
            {/* Countdown Timer */}
            <div className="bg-white/50 rounded-lg p-6 sm:p-8 border border-black/30">
              <p 
                className="text-center text-sm sm:text-base text-black uppercase tracking-widest mb-6"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                }}
              >
                {presaleStatus === 'notStarted' ? 'Presale Starts In' : presaleStatus === 'ended' ? 'Presale Has Ended' : `Phase ${currentPhase.phase} Ends In`}
              </p>

              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {/* Days */}
                <div className="text-center">
                  <div
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      color: '#000000',
                    }}
                  >
                    {timeLeft.days.toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs sm:text-sm text-black/70 uppercase tracking-wider">Days</p>
                </div>

                {/* Hours */}
                <div className="text-center">
                  <div
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      color: '#000000',
                    }}
                  >
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs sm:text-sm text-black/70 uppercase tracking-wider">Hours</p>
                </div>

                {/* Minutes */}
                <div className="text-center">
                  <div
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      color: '#000000',
                    }}
                  >
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs sm:text-sm text-black/70 uppercase tracking-wider">Minutes</p>
                </div>

                {/* Seconds */}
                <div className="text-center">
                  <div
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      color: '#000000',
                    }}
                  >
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs sm:text-sm text-black/70 uppercase tracking-wider">Seconds</p>
                </div>
              </div>
            </div>

            {/* Price and Supply Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="bg-white/50 rounded-lg p-6 border border-black/30">
                <p 
                  className="text-xs sm:text-sm text-black uppercase tracking-widest mb-2"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                  }}
                >
                  Current Phase Price
                </p>
                <h3 
                  className="text-2xl sm:text-3xl font-bold"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                    color: '#000000',
                  }}
                >
                  ${currentPhase.priceUsd} / 1 GTTWRLD
                </h3>
                <p className="text-xs text-black/60 mt-1">{currentPhase.label}</p>
              </div>

              {/* Current / Upcoming */}
              <div className="bg-white/50 rounded-lg p-6 border border-black/30">
                <p 
                  className="text-xs sm:text-sm text-black uppercase tracking-widest mb-2"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                  }}
                >
                  Upcoming Phase
                </p>
                <h3 className="text-1xl sm:text-2xl font-bold"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                    color: '#000000',
                  }}
                >
                  {upcomingPhase ? `Phase ${upcomingPhase.phase} - $${upcomingPhase.priceUsd}` : 'No Upcoming Phase'}
                </h3>
                <p className="text-xs text-black/60 mt-1">
                  {upcomingPhase ? `${upcomingPhase.startDate.toLocaleDateString()} to ${upcomingPhase.endDate.toLocaleDateString()}` : 'Final phase completed'}
                </p>
              </div>
            </div>

            {/* Phase Pricing Schedule */}
            <div className="bg-white/50 rounded-lg p-6 border border-black/30">
              <p
                className="text-sm text-black uppercase tracking-widest mb-4"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                }}
              >
                Presale Phase Pricing
              </p>
              <div className="space-y-3 text-sm sm:text-base text-black/80" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                {PRESALE_PHASES.map((phase, index) => (
                  <div
                    key={phase.phase}
                    className={`flex items-center justify-between ${index !== PRESALE_PHASES.length - 1 ? 'border-b border-black/10 pb-2' : ''}`}
                  >
                    <span>
                      Phase {phase.phase}: {phase.startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} to {phase.endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-bold" style={{ fontFamily: "'Sweet Gothic Serif', serif" }}>${phase.priceUsd}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Date Info */}
            <div className="bg-gradient-to-r from-black/5 to-black/10 rounded-lg p-6 border border-black/20 text-center">
              <p
                className="text-xs sm:text-sm text-black uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                }}
              >
                Token Launch Date
              </p>
              <h3 
                className="text-2xl sm:text-3xl font-bold text-black"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                }}
              >
                {LAUNCH_DATE.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <p className="text-xs sm:text-sm text-black/60 mt-2">Exchange listing and trading begins</p>
            </div>

            {/* Call to Action Button */}
            {presaleStatus === 'active' && (
              <Link href="/presale" className="block">
                <button
                  className="w-full px-8 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    fontFamily: "'Sweet Gothic Serif', serif",
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    letterSpacing: '0.05em',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    const element = e.currentTarget as HTMLElement;
                    element.style.backgroundColor = '#333333';
                    element.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    const element = e.currentTarget as HTMLElement;
                    element.style.backgroundColor = '#000000';
                    element.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  Buy Presale Phase {currentPhase.phase}
                </button>
              </Link>
            )}
            {presaleStatus === 'notStarted' && (
              <div
                className="w-full px-8 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-lg text-center"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  background: 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.15)',
                  color: 'rgba(0,0,0,0.6)',
                  letterSpacing: '0.05em',
                }}
              >
                Presale 1 Opens April 25, 2026
              </div>
            )}
            {presaleStatus === 'ended' && (
              <div
                className="w-full px-8 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-lg text-center"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  background: 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.15)',
                  color: 'rgba(0,0,0,0.6)',
                  letterSpacing: '0.05em',
                }}
              >
                Presale Has Ended
              </div>
            )}
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
