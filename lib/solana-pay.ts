import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createTransferCheckedInstruction,
  getMint
} from '@solana/spl-token';
import { SOLANA_NETWORK, SOLANA_TOKEN_MINT, TREASURY_WALLET_ADDRESS } from './solana-config';

const RPC_URL = SOLANA_NETWORK === 'mainnet-beta' 
  ? 'https://api.mainnet-beta.solana.com' 
  : 'https://api.devnet.solana.com';

export const connection = new Connection(RPC_URL, 'confirmed');

export async function createRentxTransferTransaction(
  senderPublicKey: PublicKey,
  amount: number
): Promise<Transaction> {
  const mintPublicKey = new PublicKey(SOLANA_TOKEN_MINT);
  const treasuryPublicKey = new PublicKey(TREASURY_WALLET_ADDRESS);

  // Get mint info to find decimals
  const mintInfo = await getMint(connection, mintPublicKey);
  const decimals = mintInfo.decimals;
  const adjustedAmount = BigInt(Math.floor(amount * Math.pow(10, decimals)));

  // Get associated token accounts
  const fromTokenAccount = await getAssociatedTokenAddress(mintPublicKey, senderPublicKey);
  const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, treasuryPublicKey);

  const transaction = new Transaction();

  // Add transfer instruction
  transaction.add(
    createTransferCheckedInstruction(
      fromTokenAccount,
      mintPublicKey,
      toTokenAccount,
      senderPublicKey,
      adjustedAmount,
      decimals
    )
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPublicKey;

  return transaction;
}

export async function createSolTransferTransaction(
  senderPublicKey: PublicKey,
  amount: number
): Promise<Transaction> {
  const treasuryPublicKey = new PublicKey(TREASURY_WALLET_ADDRESS);
  const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: treasuryPublicKey,
      lamports,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPublicKey;

  return transaction;
}
