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
import { getActivePresalePriceUsd } from '@/lib/presale-config';
import { SOLANA_NETWORK, SOLANA_TOKEN_MINT, TREASURY_WALLET_ADDRESS } from '@/lib/solana-config';

const SOLANA_TOKEN_DECIMALS = 9;

function getTreasuryKeypair(): Keypair {
  const secretKey = process.env.TREASURY_PRIVATE_KEY;

  if (!secretKey) {
    throw new Error('Treasury private key is not configured.');
  }

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
    const { userAddress, amount, currency, paymentTxHash } = await request.json();

    // Validate inputs
    if (!userAddress || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: userAddress, amount, and currency are required' },
        { status: 400 }
      );
    }

    // Only allow SOL or USDC
    if (currency !== 'USDC' && currency !== 'SOL') {
      return NextResponse.json(
        { error: 'Invalid currency. Please select USDC or SOL' },
        { status: 400 }
      );
    }

    // paymentTxHash is required
    if (!paymentTxHash) {
      return NextResponse.json(
        { error: `Missing ${currency} payment transaction signature` },
        { status: 400 }
      );
    }

    // Validate Solana address
    try {
      new PublicKey(userAddress);
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

    // Parse amount
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Calculate RENTX amount to send
    const usdValue = currency === 'USDC' ? parsedAmount : await getSolPriceUSD(parsedAmount);
    const presalePriceUsd = getActivePresalePriceUsd(new Date());
    const rentxAmount = usdValue / presalePriceUsd;

    const tokenMint = new PublicKey(SOLANA_TOKEN_MINT);
    const recipientPublicKey = new PublicKey(userAddress);
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
    const amountInBaseUnits = BigInt(Math.max(1, Math.round(rentxAmount * 10 ** SOLANA_TOKEN_DECIMALS)));

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

    const payoutTxHash = await sendAndConfirmTransaction(connection, transaction, [treasuryKeypair], {
      commitment: 'confirmed',
    });

    return NextResponse.json({
      success: true,
      rentxAmount: rentxAmount.toFixed(9),
      userAddress,
      currency,
      paymentAmount: parsedAmount,
      paymentTxHash,
      payoutTxHash,
      presalePriceUsd,
      message: `Successfully sent ${rentxAmount.toFixed(9)} RENTX tokens`,
    });
  } catch (error: any) {
    console.error('Swap error:', error);
    return NextResponse.json(
      {
        error: 'Transaction failed. Please try again.',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

async function getSolPriceUSD(amount: number): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    );
    const data = await response.json();
    return (data.solana?.usd || 0) * amount;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return 150 * amount; // fallback price
  }
}
