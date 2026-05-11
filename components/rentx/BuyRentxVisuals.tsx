'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Currency = 'SOL' | 'USDC'

interface BuyRentxVisualsProps {
  currency: Currency
}

export function BuyRentxVisuals({ currency }: BuyRentxVisualsProps) {
  return (
    <div 
      className="relative w-full h-[500px] flex items-center justify-center overflow-visible"
      style={{ perspective: '2000px' }}
    >
      {/* Background Cinematic Glows */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currency}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5 }}
          className={`absolute w-[500px] h-[500px] blur-[150px] rounded-full -z-10 ${
            currency === 'SOL' ? 'bg-purple-600/20' : 'bg-primary/20'
          }`}
        />
      </AnimatePresence>

      {/* Main Visual Container */}
      <div className="relative w-full max-w-lg h-full flex items-center justify-center">
        {/* Right Hand Container */}
        <motion.div
          initial={{ x: 100, opacity: 0, rotateY: -20 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          className="relative z-20"
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, -2, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative"
          >
            <img 
              src="/Buy/hand giving right.png" 
              alt="Giving Hand" 
              className="w-[450px] h-auto object-contain filter drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
            />
            
            {/* RENTX Coin - Main Focus */}
            <motion.div
              animate={{ 
                y: [-120, -160, -120],
                rotateY: [0, 15, 0],
                rotateX: [0, 10, 0],
                filter: [
                  "brightness(1) drop-shadow(0 0 20px rgba(212,175,55,0.4))",
                  "brightness(1.4) drop-shadow(0 0 50px rgba(212,175,55,0.8))",
                  "brightness(1) drop-shadow(0 0 20px rgba(212,175,55,0.4))"
                ]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-10 left-[40%] -translate-x-1/2 w-48 h-48 z-30"
            >
              <img 
                src="/Buy/RENTX Coin.png" 
                alt="RENTX" 
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Payment Token - Secondary */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currency}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="absolute right-0 bottom-20 w-28 h-28 z-20"
              >
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [5, -5, 5]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <img 
                    src={currency === 'SOL' ? '/Buy/Solana Coin.png' : '/Buy/USDC Coin.png'} 
                    alt={currency} 
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Particles / Dust Motes */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-primary/40 rounded-full"
              animate={{
                y: [0, -200],
                x: [0, (i % 2 === 0 ? 50 : -50)],
                opacity: [0, 0.8, 0],
                scale: [1, 2, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${60 + Math.random() * 20}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
