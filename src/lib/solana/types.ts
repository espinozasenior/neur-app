import { CommonCoinData, getSuiProvider, CoinAssetData } from './rinbot-sui-sdk';
import { getCetus } from './sui.functions';

export type SuiClient = ReturnType<typeof getSuiProvider>;

export type SuiTransactionBlockResponse = Awaited<ReturnType<SuiClient['signAndExecuteTransactionBlock']>>;

export type CoinForPool = CommonCoinData & { balance: string };

export type CetusPool = Exclude<Awaited<ReturnType<Awaited<ReturnType<typeof getCetus>>['getPool']>>, null>;

export type CoinWhitelistItem = {
  symbol: string;
  type: string;
};

// For PNL
export interface Trade {
  buyingPrice: number | null;
  sellingPrice: number | null;
  quantity: bigint;
  fees?: number;
}

export interface AxiosPriceApiResponseGet {
  data: {
    chainId: string;
    tokenAddress: string;
    timestamp: number;
    price: number;
    mcap: number | null;
    totalVolume: number | null;
    priceChange1h: number;
    priceChange24h: number;
    fecthedFrom: string;
  };
}

export interface AxiosPriceApiResponsePost {
  data: {
    chainId: string;
    tokenAddress: string;
    timestamp: number;
    price: number;
    mcap: number | null;
    totalVolume: number | null;
    priceChange1h: number;
    priceChange24h: number;
    fecthedFrom: string;
  }[];
}

export interface PriceApiPayload {
  data: {
    chainId: string;
    tokenAddress: string;
  }[];
}

export interface CoinAssetDataExtended extends CoinAssetData {
  price?: number;
  timestamp?: number;
  mcap?: number;
  priceChange1h?: number;
  priceChange24h?: number;
}