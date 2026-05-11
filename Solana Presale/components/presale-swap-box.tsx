'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import { getActivePresalePriceUsd, getPhaseForDate } from '@/lib/presale-config';
import { SOLANA_NETWORK, SOLANA_TOKEN_MINT, SOLANA_USDC_MINT, TREASURY_WALLET_ADDRESS } from '@/lib/solana-config';

type PayCurrency = 'USDC' | 'SOL';

function isValidSolanaPublicKey(value: string | undefined | null): boolean {
  if (!value) {
    return false;
  }

  try {
    new PublicKey(value.trim());
    return true;
  } catch {
    return false;
  }
}

export function PresaleSwapBox() {
  const { primaryWallet } = useDynamicContext();

  const [inputAmount, setInputAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<PayCurrency>('USDC');
  const [prices, setPrices] = useState({ USDC: 1, SOL: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'pending' | 'success'>('idle');
  const [txHash, setTxHash] = useState('');

  const connectedAddress = primaryWallet?.address;
  const currentPriceUsd = useMemo(() => getActivePresalePriceUsd(new Date()), []);
  const currentPhase = useMemo(() => getPhaseForDate(new Date()), []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch SOL price');
        }

        const data = await response.json();
        setPrices({
          USDC: 1,
          SOL: data.solana?.usd || 0,
        });
      } catch (fetchError) {
        console.error('Price fetch failed:', fetchError);
        setPrices({ USDC: 1, SOL: 150 });
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const usdValue = inputAmount && !Number.isNaN(parseFloat(inputAmount))
    ? parseFloat(inputAmount) * prices[selectedCurrency]
    : 0;

  const tokenAmount = usdValue > 0 ? usdValue / currentPriceUsd : 0;

  const handleReserve = async () => {
    if (!connectedAddress) {
      setError('Connect your Solana wallet to continue.');
      return;
    }

    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setError('Enter a valid amount.');
      return;
    }

    if (!isValidSolanaPublicKey(connectedAddress)) {
      setError('Invalid wallet address. Please reconnect your wallet.');
      return;
    }

    if (!isValidSolanaPublicKey(TREASURY_WALLET_ADDRESS)) {
      setError('Treasury wallet address is not configured.');
      return;
    }

    if (selectedCurrency === 'USDC' && !isValidSolanaPublicKey(SOLANA_USDC_MINT)) {
      setError('USDC mint address is not configured.');
      return;
    }

    setSubmitStatus('pending');
    setError('');
    setTxHash('');

    try {
      const isUsdc = selectedCurrency === 'USDC';
      const paymentToken = isUsdc
        ? {
            address: SOLANA_USDC_MINT,
            decimals: 6,
          }
        : undefined;

      const hash = await primaryWallet?.sendBalance({
        amount: parseFloat(inputAmount).toString(),
        toAddress: TREASURY_WALLET_ADDRESS,
        token: paymentToken,
      });

      if (!hash) {
        throw new Error('Transaction failed or was not returned by wallet.');
      }

      const payoutResponse = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: connectedAddress,
          amount: inputAmount,
          currency: selectedCurrency,
          paymentTxHash: hash,
        }),
      });

      const payoutData = await payoutResponse.json();

      if (!payoutResponse.ok) {
        throw new Error(payoutData?.error || 'Token payout failed.');
      }

      setTxHash(payoutData.payoutTxHash || hash);
      setSubmitStatus('success');
    } catch (txError: any) {
      if (txError?.message?.toLowerCase().includes('rejected')) {
        setError('Transaction was rejected in wallet.');
      } else {
        setError(txError?.message || 'Transaction failed. Please try again.');
      }
      setSubmitStatus('idle');
    }
  };

  if (!connectedAddress) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-sm sm:max-w-md">
          <div
            className="relative bg-gradient-to-br from-gray-900 to-black border border-black rounded-lg p-6 sm:p-8 overflow-hidden text-center"
            style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.3)' }}
          >
            <div className="relative z-10">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#FFF3A0]"
                style={{
                  fontFamily: "'Sweet Gothic Serif', serif",
                  textShadow: '0 0 12px rgba(255, 214, 0, 0.35)',
                }}
              >
                Join Solana Presale
              </h2>
              <p className="text-sm sm:text-base text-white opacity-75 mb-4 sm:mb-6" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Connect your wallet to estimate GTTWRLD tokens by the active phase price.
              </p>
              <p className="text-xs sm:text-sm text-white/80 mb-2" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Active phase: {currentPhase.label} at ${currentPriceUsd} per token
              </p>
              <p className="text-xs text-white/60" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Network: {SOLANA_NETWORK} | Mint: {SOLANA_TOKEN_MINT.slice(0, 8)}...{SOLANA_TOKEN_MINT.slice(-6)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-sm sm:max-w-md">
        <div
          className="relative bg-gradient-to-br from-gray-900 to-black border border-black rounded-lg p-6 sm:p-8 overflow-hidden"
          style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.3)' }}
        >
          <div className="relative z-10">
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-[#FFF3A0]"
              style={{
                fontFamily: "'Sweet Gothic Serif', serif",
                textShadow: '0 0 12px rgba(255, 214, 0, 0.35)',
              }}
            >
              Solana Presale Quote
            </h2>

            {error && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 border border-red-600 rounded text-red-700 text-xs sm:text-sm flex items-start sm:items-center gap-2 shadow-lg">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 sm:mt-0 text-red-700" />
                <span>{error}</span>
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-900/30 border border-green-600 rounded text-green-400 text-xs sm:text-sm flex items-start sm:items-center gap-2">
                <CheckCircle size={16} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  Transaction submitted successfully.
                  {txHash && (
                    <a
                      href={`https://explorer.solana.com/tx/${txHash}${SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline ml-1"
                    >
                      View
                    </a>
                  )}
                </span>
              </div>
            )}

            <div className="mb-5 sm:mb-6">
              <label className="block text-white text-xs sm:text-sm mb-2" style={{ fontFamily: "'Sweet Gothic Serif', serif" }}>
                You Pay
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="number"
                  placeholder="0"
                  value={inputAmount}
                  onChange={(event) => setInputAmount(event.target.value)}
                  className="flex-1 bg-white border border-black/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-black text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-black"
                  style={{ fontFamily: "'Georgia', 'Garamond', serif" }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCurrency('USDC')}
                    className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      backgroundColor: selectedCurrency === 'USDC' ? '#FFFFFF' : '#F3F4F6',
                      color: selectedCurrency === 'USDC' ? '#000000' : '#333333',
                      border: `1px solid ${selectedCurrency === 'USDC' ? '#000000' : 'rgba(0,0,0,0.30)'}`,
                    }}
                  >
                    USDC
                  </button>
                  <button
                    onClick={() => setSelectedCurrency('SOL')}
                    className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none"
                    style={{
                      fontFamily: "'Sweet Gothic Serif', serif",
                      backgroundColor: selectedCurrency === 'SOL' ? '#FFFFFF' : '#F3F4F6',
                      color: selectedCurrency === 'SOL' ? '#000000' : '#333333',
                      border: `1px solid ${selectedCurrency === 'SOL' ? '#000000' : 'rgba(0,0,0,0.30)'}`,
                    }}
                  >
                    SOL
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs mt-2" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>Presale quote</span>
                {inputAmount && usdValue > 0 && (
                  <span style={{ color: '#FFF3A0' }}>approx ${usdValue.toFixed(2)} USD</span>
                )}
              </div>

              <div className="text-xs text-gray-400 text-right mt-1" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                {loading ? (
                  <span className="flex items-center justify-end gap-1">
                    <Loader size={12} className="animate-spin" />
                    Fetching price...
                  </span>
                ) : (
                  <span>1 {selectedCurrency} = ${prices[selectedCurrency].toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="flex justify-center mb-5 sm:mb-6">
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.10)',
                  border: '1px solid rgba(0,0,0,0.30)',
                }}
              >
                <ArrowDownUp size={18} color="#000000" />
              </div>
            </div>

            <div className="mb-5 sm:mb-6">
              <label className="block text-white text-xs sm:text-sm mb-2" style={{ fontFamily: "'Sweet Gothic Serif', serif" }}>
                You Receive
              </label>
              <div className="bg-white border border-black/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                  <span className="text-black text-base sm:text-lg font-bold" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                    {tokenAmount.toFixed(2)}
                  </span>
                  <span className="text-black font-bold text-xs sm:text-sm" style={{ fontFamily: "'Sweet Gothic Serif', serif" }}>
                    GTTWRLD
                  </span>
                </div>
              <div className="text-xs text-gray-400 mt-2 text-right" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Active phase {currentPhase.phase} price: ${currentPriceUsd}
              </div>
            </div>

            <button
              onClick={handleReserve}
              disabled={!inputAmount || parseFloat(inputAmount) <= 0 || submitStatus === 'pending'}
              className="w-full py-2 sm:py-3 px-4 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 disabled:opacity-50"
              style={{
                fontFamily: "'Sweet Gothic Serif', serif",
                backgroundColor: '#FFD600',
                color: '#000000',
                letterSpacing: '0.05em',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
              }}
            >
              {submitStatus === 'pending' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-xs sm:text-sm">Waiting For Wallet Approval...</span>
                </span>
              ) : (
                <span className="text-xs sm:text-sm">Pay {inputAmount || '0'} {selectedCurrency}</span>
              )}
            </button>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Connected: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
              </p>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>
                Solana network: {SOLANA_NETWORK} | Token mint: {SOLANA_TOKEN_MINT.slice(0, 8)}...{SOLANA_TOKEN_MINT.slice(-6)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
