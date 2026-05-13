import { NextRequest, NextResponse } from 'next/server';
import bs58 from 'bs58';
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
import { SOLANA_NETWORK, SOLANA_TOKEN_MINT, TREASURY_WALLET_ADDRESS } from '@/lib/solana-config';

const SOLANA_TOKEN_DECIMALS = 9;

function getTreasuryKeypair(): Keypair {
  const secretKey = process.env.TREASURY_PRIVATE_KEY;
  if (!secretKey) throw new Error('Treasury private key is not configured.');
  try {
    const trimmed = secretKey.trim();
    if (trimmed.startsWith('[')) {
      return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(trimmed)));
    }
    return Keypair.fromSecretKey(bs58.decode(trimmed));
  } catch {
    throw new Error('Treasury private key is invalid.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress } = await request.json();

    if (!amount || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: amount and walletAddress are required' },
        { status: 400 }
      );
    }

    // Validate Solana address
    try {
      new PublicKey(walletAddress);
    } catch {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address.' },
        { status: 400 }
      );
    }

    if (!TREASURY_WALLET_ADDRESS) {
      return NextResponse.json(
        { error: 'Treasury wallet not configured properly' },
        { status: 500 }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Execute Solana Transfer from Treasury to Provider
    const tokenMint = new PublicKey(SOLANA_TOKEN_MINT);
    const recipientPublicKey = new PublicKey(walletAddress);
    const treasuryKeypair = getTreasuryKeypair();
    const treasuryPublicKey = treasuryKeypair.publicKey;

    if (treasuryPublicKey.toBase58() !== TREASURY_WALLET_ADDRESS) {
      return NextResponse.json(
        { error: 'Treasury secret key mismatch.' },
        { status: 500 }
      );
    }

    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');

    const treasuryTokenAccount = await getAssociatedTokenAddress(tokenMint, treasuryPublicKey);
    const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPublicKey);
    const amountInBaseUnits = BigInt(Math.max(1, Math.round(parsedAmount * 10 ** SOLANA_TOKEN_DECIMALS)));

    const transaction = new Transaction().add(
      createAssociatedTokenAccountIdempotentInstruction(
        treasuryPublicKey,
        treasuryTokenAccount,
        treasuryPublicKey,
        tokenMint
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        treasuryPublicKey,
        recipientTokenAccount,
        recipientPublicKey,
        tokenMint
      ),
      createTransferCheckedInstruction(
        treasuryTokenAccount,
        tokenMint,
        recipientTokenAccount,
        treasuryPublicKey,
        amountInBaseUnits,
        SOLANA_TOKEN_DECIMALS
      )
    );

    const txHash = await sendAndConfirmTransaction(connection, transaction, [treasuryKeypair], {
      commitment: 'confirmed',
    });

    return NextResponse.json({
      success: true,
      txHash,
      amount: parsedAmount,
      walletAddress,
      message: `Successfully transferred ${parsedAmount} RENTX to ${walletAddress}`,
    });

  } catch (error: any) {
    console.error('Withdrawal transfer error:', error);
    return NextResponse.json(
      {
        error: 'Transaction failed. Please try again.',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
