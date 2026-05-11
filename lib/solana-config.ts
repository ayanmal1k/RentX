export const DYNAMIC_SOLANA_ENVIRONMENT_ID =
  process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || 'b10f6500-1e1b-4076-ad89-de26fd36a79f';

export type SolanaNetwork = 'devnet' | 'mainnet-beta';

const requestedNetwork = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet').toLowerCase();

export const SOLANA_NETWORK: SolanaNetwork = requestedNetwork === 'mainnet'
  ? 'mainnet-beta'
  : requestedNetwork === 'mainnet-beta'
    ? 'mainnet-beta'
    : 'devnet';

export const SOLANA_TOKEN_MINT =
  process.env.NEXT_PUBLIC_SOLANA_TOKEN_MINT || 'Bswn6Dg8Ji5esNCcncsLqb1DmjBUSkmuDcf1xaXL45fc';

export const TREASURY_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS || 'Cf2Cdmwxzewyu5473yHnkCFhopM8ZoB6uFabJUZKLMm3';

export const SOLANA_USDC_MINT = process.env.NEXT_PUBLIC_SOLANA_USDC_MINT || (
  SOLANA_NETWORK === 'mainnet-beta'
    ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    : '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);
