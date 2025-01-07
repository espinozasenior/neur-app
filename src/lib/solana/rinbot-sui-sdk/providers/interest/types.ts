import { GetRouteQuotesReturn, SwapRouteArgs } from "@interest-protocol/clamm-sdk";
import { ProviderOptions } from "../types";

export type InterestRouteData = {
  bestRoute: SwapRouteArgs["route"];
  poolsMap: GetRouteQuotesReturn["poolsMap"];
  inputCoinType: string;
  minAmount: bigint;
  formattedInputAmount: string;
};

export type InterestOptions = ProviderOptions & { suiProviderUrl: string };
