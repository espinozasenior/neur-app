'use server';

import {
    RouteManager,
    clmmMainnet,
    isValidSuiAddress,
    WalletManagerSingleton,
    CoinManagerSingleton,
    RedisStorageSingleton,
    TurbosSingleton,
    FlowxSingleton,
    CetusSingleton,
    AftermathSingleton,
    InterestProtocolSingleton,
    getSuiProvider
  } from 'rinbot-sui-sdk';
import { SUI_RPC_URL, SUI_LIQUIDITY_PROVIDERS_CACHE_OPTIONS } from '../constants';
import { getRedisClient } from '../config/redis.config';
import { v4 as uuidv4 } from 'uuid';

export const randomUuid = process.env.DEBUG_INSTANCE_ID ? uuidv4() : '';
export const provider = getSuiProvider({ url: SUI_RPC_URL });

export enum TransactionResultStatus {
  Success = 'success',
  Failure = 'failure',
}

interface Config {
  suiProviderUrl: string;
  cacheOptions: any;
  lazyLoading: boolean;
}

const DEFAULT_CONFIG: Config = {
  suiProviderUrl: SUI_RPC_URL,
  cacheOptions: SUI_LIQUIDITY_PROVIDERS_CACHE_OPTIONS,
  lazyLoading: false
};

export async function getTurbos() {
  const { redisClient } = await getRedisClient();
  const storage = RedisStorageSingleton.getInstance(redisClient);

  // console.time(`TurbosSingleton.getInstance.${randomUuid}`)
  const turbos = await TurbosSingleton.getInstance({
    suiProviderUrl: DEFAULT_CONFIG.suiProviderUrl,
    cacheOptions: { ...DEFAULT_CONFIG.cacheOptions, storage },
    lazyLoading: DEFAULT_CONFIG.lazyLoading,
  });
  // console.timeEnd(`TurbosSingleton.getInstance.${randomUuid}`)

  return turbos;
};

export async function getFlowx() {
  const { redisClient } = await getRedisClient();
  const storage = RedisStorageSingleton.getInstance(redisClient);

  // console.time(`FlowxSingleton.getInstance.${randomUuid}`)
  const flowx = await FlowxSingleton.getInstance({
    cacheOptions: { ...DEFAULT_CONFIG.cacheOptions, storage },
    lazyLoading: DEFAULT_CONFIG.lazyLoading,
  });
  // console.timeEnd(`FlowxSingleton.getInstance.${randomUuid}`)

  return flowx;
};

export async function getCetus() {
  const { redisClient } = await getRedisClient();
  const storage = RedisStorageSingleton.getInstance(redisClient);

  // console.time(`CetusSingleton.getInstance.${randomUuid}`)
  const cetus = await CetusSingleton.getInstance({
    suiProviderUrl: DEFAULT_CONFIG.suiProviderUrl,
    sdkOptions: clmmMainnet,
    cacheOptions: { ...DEFAULT_CONFIG.cacheOptions, storage },
    lazyLoading: DEFAULT_CONFIG.lazyLoading,
  });
  // console.timeEnd(`CetusSingleton.getInstance.${randomUuid}`)

  return cetus;
};

export async function getAftermath() {
  const { redisClient } = await getRedisClient();
  const storage = RedisStorageSingleton.getInstance(redisClient);

  // console.time(`AftermathSingleton.getInstance.${randomUuid}`)
  const aftermath = await AftermathSingleton.getInstance({
    cacheOptions: { ...DEFAULT_CONFIG.cacheOptions, storage },
    lazyLoading: DEFAULT_CONFIG.lazyLoading,
  });
  // console.timeEnd(`AftermathSingleton.getInstance.${randomUuid}`)

  return aftermath;
};

export async function getInterest() {
  const { redisClient } = await getRedisClient();
  const storage = RedisStorageSingleton.getInstance(redisClient);

  const interest = await InterestProtocolSingleton.getInstance({
    suiProviderUrl: DEFAULT_CONFIG.suiProviderUrl,
    cacheOptions: { storage, ...DEFAULT_CONFIG.cacheOptions },
    lazyLoading: DEFAULT_CONFIG.lazyLoading,
  });

  return interest;
};

export async function getCoinManager() {
  console.time(`CoinManagerSingleton.getInstance ${randomUuid}`);
  const providers = await Promise.all([getAftermath(), getCetus(), getTurbos(), getFlowx(), getInterest()]);

  const coinManager = CoinManagerSingleton.getInstance(providers, DEFAULT_CONFIG.suiProviderUrl);
  console.timeEnd(`CoinManagerSingleton.getInstance ${randomUuid}`);

  return coinManager;
};

export async function getWalletManager() {
  // console.time(`WalletManagerSingleton.getInstance.${randomUuid}`)
  const coinManager = await getCoinManager();

  const walletManager = WalletManagerSingleton.getInstance(provider, coinManager);
  // console.timeEnd(`WalletManagerSingleton.getInstance.${randomUuid}`)

  return walletManager;
};

export async function getRouteManager() {
  // console.time(`RouteManager.getInstance.${randomUuid}`)
  const coinManager = await getCoinManager();
  const providers = await Promise.all([getAftermath(), getCetus(), getTurbos(), getFlowx(), getInterest()]);

  const routerManager = RouteManager.getInstance(providers, coinManager);
  // console.timeEnd(`RouteManager.getInstance.${randomUuid}`)
  return routerManager;
};