import config from '../../package.json';

export const APP_VERSION = config.version;
export const IS_BETA = true;

export const RPC_URL =
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
  'https://api.mainnet-beta.solana.com';

export const MAX_TOKEN_MESSAGES = 10;

export const NO_CONFIRMATION_MESSAGE = ' (Does not require confirmation)';
export const SUI_RPC_URL =
  process.env.NEXT_PUBLIC_SUI_RPC_URL ||
  'https://rpc-mainnet.suiscan.xyz';


export const REDIS_URL = process.env.REDIS_URL;

export const SUI_LIQUIDITY_PROVIDERS_CACHE_OPTIONS = {
  updateIntervalInMs: 1000 * 60 * 60,
};

export const SELL_DELAY_AFTER_BUY_FOR_CLAIMERS_IN_MS = 4 * 60 * 60 * 1000; // 4 hours

