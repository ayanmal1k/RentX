'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, AlertCircle, CheckCircle2, Loader2, Coins, TrendingUp, Info } from 'lucide-react'
import { getActivePresalePriceUsd, getPhaseForDate } from '@/lib/presale-config'
import { SOLANA_NETWORK, SOLANA_USDC_MINT, TREASURY_WALLET_ADDRESS } from '@/lib/solana-config'
import { WalletConnect } from './WalletConnect'

type Currency = 'SOL' | 'USDC'

interface BuyRentxBoxProps {
  currency: Currency
  onCurrencyChange: (cur: Currency) => void
}

export function BuyRentxBox({ currency, onCurrencyChange }: BuyRentxBoxProps) {
  const { primaryWallet } = useDynamicContext()
  const [amount, setAmount] = useState('')
  const [prices, setPrices] = useState({ USDC: 1, SOL: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [txHash, setTxHash] = useState('')

  const currentPriceUsd = 0.10 // Static price as requested

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await res.json()
        setPrices(p => ({ ...p, SOL: data.solana?.usd || 150 }))
      } catch (err) {
        console.error('Failed to fetch SOL price')
      }
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  const usdValue = useMemo(() => {
    const num = parseFloat(amount)
    return isNaN(num) ? 0 : num * prices[currency]
  }, [amount, currency, prices])

  const rentxAmount = useMemo(() => {
    return usdValue / currentPriceUsd
  }, [usdValue, currentPriceUsd])

  const handleBuy = async () => {
    if (!primaryWallet) return
    if (!amount || parseFloat(amount) <= 0) {
      setStatus('error')
      setMessage('Please enter a valid amount')
      return
    }

    setStatus('pending')
    setMessage('Processing transaction...')

    try {
      const paymentToken = currency === 'USDC' ? {
        address: SOLANA_USDC_MINT,
        decimals: 6
      } : undefined

      const hash = await primaryWallet.sendBalance({
        amount: amount,
        toAddress: TREASURY_WALLET_ADDRESS,
        token: paymentToken
      })

      if (!hash) throw new Error('Transaction failed')

      const res = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: primaryWallet.address,
          amount,
          currency,
          paymentTxHash: hash
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payout failed')

      setTxHash(data.payoutTxHash || hash)
      setStatus('success')
      setMessage(`Successfully purchased ${rentxAmount.toLocaleString()} RENTX!`)
      setAmount('')
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setMessage(err.message || 'Transaction failed. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto relative group/box">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden"
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15),transparent_70%)]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Acquire RENTX</h2>
              <p className="text-on-surface-variant text-sm flex items-center gap-2 font-medium">
                <TrendingUp size={16} className="text-primary animate-pulse" />
                Current Rate: <span className="text-primary font-bold">${currentPriceUsd} USD</span>
              </p>
            </div>

            {/* Currency Selector - Premium Design */}
            <div className="flex items-center gap-1 p-1 bg-black/60 backdrop-blur-3xl rounded-[1.25rem] border border-white/10 shadow-2xl overflow-hidden">
              {(['USDC', 'SOL'] as Currency[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => onCurrencyChange(cur)}
                  className={`relative px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-500 tracking-[0.2em] uppercase ${
                    currency === cur ? 'text-black' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {currency === cur && (
                    <motion.div
                      layoutId="activeCurrencyInternal"
                      className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {cur === 'SOL' ? <img src="/Buy/Solana Coin.png" className="w-3.5 h-3.5" alt="" /> : <img src="/Buy/USDC Coin.png" className="w-3.5 h-3.5" alt="" />}
                    {cur}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Purchase Amount</label>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <TrendingUp size={12} />
                  Live {currency} Rate
                </div>
              </div>
              
              <div className="relative group/input">
                <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="relative w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-6 text-4xl font-black focus:outline-none focus:border-primary/40 transition-all text-white placeholder-white/5 shadow-inner"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <span className="text-xl font-black text-white/20">{currency}</span>
                </div>
              </div>
              <div className="flex justify-between items-center px-1 text-xs text-on-surface-variant">
                <span>Balance: 0.00 {currency}</span>
                {usdValue > 0 && <span className="text-primary">≈ ${usdValue.toFixed(2)} USD</span>}
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-20">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center shadow-lg text-primary">
                <ArrowDown size={20} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-1">Tokens Expected</label>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-8 py-6 flex items-center justify-between group transition-all hover:border-primary/20 hover:bg-white/[0.05]">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {rentxAmount > 0 ? rentxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                  </span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Direct Vault Transfer</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-white">RENTX</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Guaranteed Rate</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                    <img src="/Buy/RENTX Coin.png" alt="RENTX" className="w-10 h-10 object-contain drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
                  status === 'pending' ? 'bg-primary/5 border-primary/20 text-primary' :
                  status === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                  'bg-error/5 border-error/20 text-error'
                }`}>
                  {status === 'pending' ? <Loader2 size={18} className="animate-spin mt-0.5" /> :
                   status === 'success' ? <CheckCircle2 size={18} className="mt-0.5" /> :
                   <AlertCircle size={18} className="mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                    {status === 'success' && txHash && (
                      <a 
                        href={`https://explorer.solana.com/tx/${txHash}?cluster=${SOLANA_NETWORK}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline mt-1 inline-block opacity-70 hover:opacity-100"
                      >
                        View on Explorer
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="mt-8">
            {!primaryWallet ? (
              <div className="flex justify-center">
                <WalletConnect />
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === 'pending' || !amount}
                onClick={handleBuy}
                className="w-full py-5 rounded-2xl bg-primary text-on-primary font-bold text-lg shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
              >
                {status === 'pending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Confirming...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Coins size={20} />
                    Buy RENTX Now
                  </span>
                )}
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </motion.button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5"><Info size={14} /> Min Purchase</span>
              <span className="text-white font-medium">10 USDC / 0.1 SOL</span>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5"><Info size={14} /> Network</span>
              <span className="text-white font-medium capitalize">{SOLANA_NETWORK}</span>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
