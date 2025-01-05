import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { PoolCreationLpCoinMetadata, RouterCompleteTradeRoute } from "aftermath-ts-sdk";
import { ProviderOptions } from "../types";

export type SmartOutputAmountData = {
  outputAmount: bigint;
  route: RouterCompleteTradeRoute;
};

export type AftermathOptions = ProviderOptions;

export type CreateLpCoinInput = {
  publicKey: string;
  lpCoinDecimals: number;
};

export type CreatePoolCoinInfo = {
  coinType: string;
  weight: number;
  decimals: number;
  tradeFeeIn: number;
  initialDeposit: bigint;
};

export type CreatePoolInput = {
  publicKey: string;
  createLpCoinTransactionResult: SuiTransactionBlockResponse;
  lpCoinMetadata: PoolCreationLpCoinMetadata;
  coinsInfo: { coinA: CreatePoolCoinInfo; coinB: CreatePoolCoinInfo };
  poolName: string;
};

export type GetWeightsCoinInfo = { type: string; amount: string };

export type GetWeightsInput = { coinA: GetWeightsCoinInfo; coinB: GetWeightsCoinInfo };

export type GetLpCoinDecimalsCoinInfo = { decimals: number; weight: number };

export type GetLpCoinDecimalsInput = { coinA: GetLpCoinDecimalsCoinInfo; coinB: GetLpCoinDecimalsCoinInfo };

export type OwnedPoolCoinInfo = { symbol?: string | undefined; type: string; balance: string };

export type OwnedPoolInfo = {
  name: string;
  volume: string;
  tvl: string;
  fees: string;
  apr: string;
  poolObjectId: string;
  coins: OwnedPoolCoinInfo[];
};
