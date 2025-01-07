import { version } from '../../package.json';

export const APP_VERSION = version;
export const IS_BETA = true;

export const RPC_URL =
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
  'https://api.mainnet-beta.solana.com';

export const SUI_RPC_URL =
  process.env.NEXT_PUBLIC_SUI_RPC_URL ||
  'https://rpc-mainnet.suiscan.xyz';

export const MAX_TOKEN_MESSAGES = 5;

import { LONG_SUI_COIN_TYPE, SUI_DECIMALS } from '@/lib/solana/rinbot-sui-sdk';

export const SUI_LIQUIDITY_PROVIDERS_CACHE_OPTIONS = {
  updateIntervalInMs: 1000 * 60 * 60,
};

export const RINCEL_COIN_TYPE = '0xd2c7943bdb372a25c2ac7fa6ab86eb9abeeaa17d8d65e7dcff4c24880eac860b::rincel::RINCEL';

export const COIN_WHITELIST_URL = 'https://rinbot-dev.vercel.app/api/coin-whitelist';

export const RINBOT_CHAT_URL = 'https://t.me/rinbot_chat';

export const SELL_DELAY_AFTER_BUY_FOR_CLAIMERS_IN_MS = 4 * 60 * 60 * 1000; // 4 hours

export const SUI_COIN_DATA = { symbol: 'SUI', decimals: SUI_DECIMALS, type: LONG_SUI_COIN_TYPE };

export const KV_PRICE_API_DB_URL = process.env.KV_PRICE_API_DB_URL || '';

export const PRICE_API_URL = 'https://price-api.rinbot.io/api/v1/price';
