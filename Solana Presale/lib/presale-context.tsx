'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTokenData, calculatePercentageSold, TokenData } from '@/lib/firestore-service';

interface PresaleContextType {
  tokenData: TokenData | null;
  soldPercentage: number;
  loading: boolean;
  refreshTokenData: () => Promise<void>;
}

const PresaleContext = createContext<PresaleContextType | undefined>(undefined);

export function PresaleProvider({ children }: { children: ReactNode }) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [soldPercentage, setSoldPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshTokenData = async () => {
    try {
      setLoading(true);
      const data = await getTokenData();
      if (data) {
        setTokenData(data);
        setSoldPercentage(calculatePercentageSold(data));
      }
    } catch (error) {
      console.error('Error fetching presale data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTokenData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(refreshTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PresaleContext.Provider value={{ tokenData, soldPercentage, loading, refreshTokenData }}>
      {children}
    </PresaleContext.Provider>
  );
}

export function usePresale() {
  const context = useContext(PresaleContext);
  if (context === undefined) {
    throw new Error('usePresale must be used within PresaleProvider');
  }
  return context;
}
