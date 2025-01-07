import {
  AftermathSingleton,
  CetusSingleton,
  CoinAssetData,
  CoinManagerSingleton,
  FlowxSingleton,
  InterestProtocolSingleton,
  LONG_SUI_COIN_TYPE,
  RedisStorageSingleton,
  RouteManager,
  SHORT_SUI_COIN_TYPE,
  SUI_DECIMALS,
  TurbosSingleton,
  WalletManagerSingleton,
  clmmMainnet,
  getLpCoinDecimals,
  getSuiProvider,
  isValidSuiAddress,
  isValidTokenAddress,
  isValidTokenAmount,
  transactionFromSerializedTransaction,
} from './rinbot-sui-sdk';
import { getRedisClient } from './redis.config';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { v4 as uuidv4 } from 'uuid';

import { SUI_LIQUIDITY_PROVIDERS_CACHE_OPTIONS, SUI_RPC_URL, RPC_URL } from '@/lib/constants';

export const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

export const randomUuid = process.env.DEBUG_INSTANCE_ID ? uuidv4() : '';

export const createConnection = () => new Connection(RPC_URL);
export const provider = getSuiProvider({ url: SUI_RPC_URL });

export const getFlowx = async () => {
  const { redisClient } = await getRedisClient();
  const storage = RedisStorageSingleton.getInstance(redisClient);

  // console.time(`FlowxSingleton.getInstance.${randomUuid}`)
  const flowx = await FlowxSingleton.getInstance({
    cacheOptions: { ...SUI_LIQUIDITY_PROVIDERS_CACHE_OPTIONS, storage },
    lazyLoading: false,
  });
  // console.timeEnd(`FlowxSingleton.getInstance.${randomUuid}`)

  return flowx;
};

export const getCoinManager = async () => {
  const providers = []; // Simplified for client-side
  return CoinManagerSingleton.getInstance(providers, SUI_RPC_URL);
};

export const getWalletManager = async () => {
  const coinManager = await getCoinManager();
  return WalletManagerSingleton.getInstance(provider, coinManager);
};

export interface TransferWithMemoParams {
  /** Target address */
  to: string;
  /** Transfer amount (in SOL) */
  amount: number;
  /** Attached message */
  memo: string;
}

export class SolanaUtils {
  private static connection = getSuiProvider({ url: SUI_RPC_URL });

  /**
   * Resolve .sui domain name to address
   * @param domain Domain name
   */
  // TODO: Implement .sui domain name resolution
  static async resolveDomainToAddress(domain: string): Promise<string | null> {
    const owner = await this.connection.resolveNameServiceAddress({ name: domain });
    return owner;
  }

  /**
   * Get wallet SUI balance
   * @param address Wallet address or .sui domain
   */
  static async getBalance(address: string): Promise<number> {
    try {
      let publicKeyStr = address;

      // If it's a .sol domain, resolve to address first
      if (address.toLowerCase().endsWith('.sui')) {
        const resolvedAddress = await this.resolveDomainToAddress(address);
        if (!resolvedAddress) {
          throw new Error('Failed to resolve domain name');
        }
        publicKeyStr = resolvedAddress;
      }

      // const balance = await this.connection.getBalance({ owner: publicKeyStr });
      const walletManager = await getWalletManager();
      const balance = await walletManager.getAvailableSuiBalance(publicKeyStr);

      return Number(balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return 0;
    }
  }

  static async getPhantomProvider(): Promise<PhantomProvider | null> {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) {
        if (!provider.publicKey) {
          try {
            await provider.connect();
          } catch (err) {
            console.error('Failed to connect to Phantom wallet:', err);
            return null;
          }
        }
        return provider;
      }
    }

    // Fallback to window.solana
    if (window.solana?.isPhantom) {
      if (!window.solana.publicKey) {
        try {
          await window.solana.connect();
        } catch (err) {
          console.error('Failed to connect to Phantom wallet:', err);
          return null;
        }
      }
      return window.solana;
    }

    return null;
  }

  /**
   * Send SOL transfer transaction with memo
   */
  static async sendTransferWithMemo(
    params: TransferWithMemoParams,
  ): Promise<string | null> {
    return null;
    // const provider = await this.getPhantomProvider();
    // if (!provider) {
    //   throw new Error('Phantom wallet not found or connection rejected');
    // }

    // if (!provider.publicKey) {
    //   throw new Error('Wallet not connected');
    // }

    // const { to, amount, memo } = params;
    // const fromPubkey = provider.publicKey;
    // const toPubkey = new PublicKey(to);

    // // Check balance first
    // const balance = await this.connection.getBalance({ owner: fromPubkey });
    // const requiredAmount = amount * LAMPORTS_PER_SOL;
    // if (balance < requiredAmount) {
    //   throw new Error(
    //     `Insufficient balance. You have ${balance / LAMPORTS_PER_SOL} SOL but need ${amount} SOL`,
    //   );
    // }

    // try {
    //   // Create transaction
    //   const transaction = new Transaction();
    //   transaction.feePayer = fromPubkey;

    //   // Create transfer instruction
    //   const transferInstruction = SystemProgram.transfer({
    //     fromPubkey,
    //     toPubkey,
    //     lamports: requiredAmount,
    //   });

    //   // Create Memo instruction
    //   const memoInstruction = new TransactionInstruction({
    //     keys: [{ pubkey: fromPubkey, isSigner: true, isWritable: true }],
    //     programId: new PublicKey(MEMO_PROGRAM_ID),
    //     data: Buffer.from(memo, 'utf-8'),
    //   });

    //   transaction.add(transferInstruction);
    //   transaction.add(memoInstruction);

    //   // Get latest blockhash
    //   const { blockhash } =
    //     await this.connection. getLatestBlockhash('confirmed');
    //   transaction.recentBlockhash = blockhash;

    //   // Sign transaction
    //   const signedTransaction = await provider.signTransaction(transaction);

    //   // Send transaction and return signature immediately
    //   const signature = await this.connection.sendRawTransaction(
    //     signedTransaction.serialize(),
    //     {
    //       skipPreflight: false,
    //       maxRetries: 5,
    //       preflightCommitment: 'confirmed',
    //     },
    //   );

    //   // Log for debugging
    //   console.log('Transaction sent successfully:', signature);

    //   // Return signature immediately without waiting for confirmation
    //   return signature;
    // } catch (error: unknown) {
    //   console.error('TEST Transaction error:', error);
    //   if (error instanceof Error) {
    //     // Handle insufficient funds error
    //     if (error.toString().includes('insufficient lamports')) {
    //       throw new Error(
    //         `Insufficient balance. Please make sure you have enough SOL to cover the transaction.`,
    //       );
    //     }
    //     // Handle other known errors
    //     if (error.toString().includes('Transaction simulation failed')) {
    //       throw new Error(`Transaction failed. Please try again.`);
    //     }
    //   }
    //   throw error;
    // }
  }
}
