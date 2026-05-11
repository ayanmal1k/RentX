'use client';

import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { ReactNode } from "react";
import { DYNAMIC_SOLANA_ENVIRONMENT_ID, SOLANA_NETWORK } from "@/lib/solana-config";

const SOLANA_DEVNET_NETWORK = {
  blockExplorerUrls: ['https://explorer.solana.com/?cluster=devnet'],
  chainId: '103',
  cluster: 'devnet',
  genesisHash: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
  iconUrls: ['https://app.dynamic.xyz/assets/networks/solana.svg'],
  isTestnet: true,
  key: 'solana',
  name: 'Solana Devnet',
  nativeCurrency: {
    decimals: 9,
    iconUrl: 'https://app.dynamic.xyz/assets/networks/solana.svg',
    name: 'Solana',
    pricingProviderTokenId: 'solana',
    symbol: 'SOL',
  },
  networkId: '103',
  rpcUrls: ['https://api.devnet.solana.com'],
};

const SOLANA_MAINNET_NETWORK = {
  blockExplorerUrls: ['https://explorer.solana.com'],
  chainId: '101',
  cluster: 'mainnet',
  genesisHash: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  iconUrls: ['https://app.dynamic.xyz/assets/networks/solana.svg'],
  isTestnet: false,
  key: 'solana',
  name: 'Solana Mainnet',
  nativeCurrency: {
    decimals: 9,
    iconUrl: 'https://app.dynamic.xyz/assets/networks/solana.svg',
    name: 'Solana',
    pricingProviderTokenId: 'solana',
    symbol: 'SOL',
  },
  networkId: '101',
  rpcUrls: ['https://api.mainnet-beta.solana.com'],
};

export function DynamicProvider({ children }: { children: ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_SOLANA_ENVIRONMENT_ID,
        walletConnectors: [SolanaWalletConnectors],
        enableConnectOnlyFallback: true,
        overrides: {
          solNetworks: SOLANA_NETWORK === 'mainnet-beta' ? [SOLANA_MAINNET_NETWORK] : [SOLANA_DEVNET_NETWORK],
        },

        initialAuthenticationMode: 'connect-only',
          mobileExperience: 'redirect',
          deepLinkPreference: 'universal',
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
