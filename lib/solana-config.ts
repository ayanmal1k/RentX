import { Connection } from '@solana/web3.js';

export const DYNAMIC_SOLANA_ENVIRONMENT_ID =
  process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || 'b10f6500-1e1b-4076-ad89-de26fd36a79f';

export type SolanaNetwork = 'devnet' | 'mainnet-beta';

const requestedNetwork = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta').toLowerCase();

export const SOLANA_NETWORK: SolanaNetwork = requestedNetwork === 'mainnet'
  ? 'mainnet-beta'
  : requestedNetwork === 'mainnet-beta'
    ? 'mainnet-beta'
    : 'mainnet-beta';

const MAINNET_RPC_URLS = [
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  'https://mainnet.helius-rpc.com/?api-key=dbbc3090-2630-4663-8809-04ee40c700cc',
  'https://api.mainnet-beta.solana.com',
].filter((url): url is string => Boolean(url));

const DEVNET_RPC_URLS = ['https://api.devnet.solana.com'];

export const SOLANA_RPC_URLS = SOLANA_NETWORK === 'mainnet-beta' ? MAINNET_RPC_URLS : DEVNET_RPC_URLS;

export const SOLANA_TOKEN_MINT =
  process.env.NEXT_PUBLIC_SOLANA_TOKEN_MINT || 'Bswn6Dg8Ji5esNCcncsLqb1DmjBUSkmuDcf1xaXL45fc';

export const SOLANA_TOKEN_DECIMALS = 9;

export const TREASURY_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS || 'Gwa1snu3SR8Q2JA2jyqWoGe1t8YZmCuFvCHZVzw5cRUG';

export const SOLANA_USDC_MINT = process.env.NEXT_PUBLIC_SOLANA_USDC_MINT || (
  SOLANA_NETWORK === 'mainnet-beta'
    ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    : '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);

export async function createSolanaConnection(commitment: 'confirmed' | 'finalized' = 'confirmed') {
  const errors: string[] = [];

  for (const rpcUrl of SOLANA_RPC_URLS) {
    const connection = new Connection(rpcUrl, commitment);

    try {
      await connection.getLatestBlockhash();
      return connection;
    } catch (error: any) {
      errors.push(`${rpcUrl}: ${error?.message || 'RPC unavailable'}`);
    }
  }

  throw new Error(`Unable to connect to any Solana RPC endpoint. ${errors.join(' | ')}`);
}
