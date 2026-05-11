'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Wallet, LogOut } from 'lucide-react';
import { useState } from 'react';

export function WalletConnectButton() {
  const { user, setShowAuthFlow, primaryWallet, handleLogOut } = useDynamicContext();
  const [isHovered, setIsHovered] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const handleConnect = () => {
    setShowAuthFlow(true);
  };

  const handleDisconnect = () => {
    handleLogOut();
    setShowDisconnect(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const connectedAddress = primaryWallet?.address;

  if (connectedAddress) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDisconnect(!showDisconnect)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
          style={{
            fontFamily: "'Sweet Gothic Serif', serif",
            backgroundColor: isHovered ? '#333333' : '#000000',
            color: '#FFFFFF',
            letterSpacing: '0.05em',
            boxShadow: isHovered 
              ? '0 0 30px rgba(0, 0, 0, 0.8)' 
              : '0 0 15px rgba(0, 0, 0, 0.3)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          title="Click to disconnect or change wallet"
        >
          <Wallet size={20} />
          <span className="hidden sm:inline">{formatAddress(connectedAddress)}</span>
        </button>

        {/* Disconnect Menu */}
        {showDisconnect && (
          <div 
            className="absolute top-full right-0 mt-2 w-48 rounded-lg overflow-hidden shadow-2xl z-50"
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #000000',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Change Wallet */}
            

            {/* Disconnect */}
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-600/20 transition-colors flex items-center gap-2 border-t border-black/20"
              style={{
                fontFamily: "'Sweet Gothic Serif', serif",
              }}
            >
              <LogOut size={18} />
              <span>Disconnect</span>
            </button>
          </div>
        )}

        {/* Overlay to close menu when clicking outside */}
        {showDisconnect && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowDisconnect(false)}
          />
        )}
      </div>
    );
  }

  // Not connected - show Connect button
  return (
    <button
      onClick={handleConnect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
      style={{
        fontFamily: "'Sweet Gothic Serif', serif",
        backgroundColor: isHovered ? '#333333' : '#000000',
        color: '#FFFFFF',
        letterSpacing: '0.05em',
        boxShadow: isHovered 
          ? '0 0 30px rgba(0, 0, 0, 0.8)' 
          : '0 0 15px rgba(0, 0, 0, 0.3)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
      title="Click to connect wallet"
    >
      <Wallet size={20} />
      <span className="hidden sm:inline">Connect Wallet</span>
    </button>
  );
}
