'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { Wallet, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function WalletConnect() {
  const { setShowAuthFlow, primaryWallet, handleLogOut } = useDynamicContext()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleConnect = () => {
    setShowAuthFlow(true)
  }

  const handleDisconnect = () => {
    handleLogOut()
    setShowDropdown(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const connectedAddress = primaryWallet?.address

  if (connectedAddress) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-surface-container-high border border-primary/20 hover:border-primary/40 text-on-surface shadow-lg shadow-primary/5 transition-all duration-300"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-sm font-medium">{formatAddress(connectedAddress)}</span>
          <ChevronDown size={16} className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-48 rounded-2xl bg-surface-container-highest border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">Connected Wallet</p>
                <p className="text-xs font-mono text-primary truncate">{connectedAddress}</p>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-3 text-left text-error hover:bg-error/10 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Disconnect</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {showDropdown && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 163, 255, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      onClick={handleConnect}
      className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 transition-all duration-300"
    >
      <Wallet size={18} />
      <span>Connect Wallet</span>
    </motion.button>
  )
}
