import { GetRouteQuotesReturn, InterestPool } from "@interest-protocol/clamm-sdk";
import BigNumber from "bignumber.js";
import { CommonPoolData } from "../types";
import { ROUTES_QUOTES_AMOUNT_OBJECT_INDEX } from "./config";

export const getPathMapAndCoinTypesSet = (
  pools: InterestPool[],
): {
  pathMap: Map<string, CommonPoolData>;
  coinTypesSet: Set<string>;
} => {
  const pathMap: Map<string, CommonPoolData> = new Map();
  const coinTypesSet: Set<string> = new Set();

  pools.forEach((pool: InterestPool) => {
    const coinTypes = pool.coinTypes;
    const base: string = coinTypes[0];
    const quote: string = coinTypes[1];

    // Fill pathMap
    const commonPoolData: CommonPoolData = {
      base,
      quote,
    };
    const poolKey = `${base}-${quote}`;
    pathMap.set(poolKey, commonPoolData);

    // Fill coinTypeSet
    coinTypesSet.add(base);
    coinTypesSet.add(quote);
  });

  return { pathMap, coinTypesSet };
};

export const getBestInterestRoute = (routes: GetRouteQuotesReturn["routes"]): GetRouteQuotesReturn["routes"][0] => {
  const bestRoute = routes.reduce((bestRoute, currentRoute) => {
    const bestAmount = bestRoute[ROUTES_QUOTES_AMOUNT_OBJECT_INDEX].amount;
    const currentAmount = currentRoute[ROUTES_QUOTES_AMOUNT_OBJECT_INDEX].amount;

    return bestAmount > currentAmount ? bestRoute : currentRoute;
  });

  return bestRoute;
};

export const getAmountWithSlippage = (amount: string, slippagePercentage: number): string => {
  const slippageAmount = new BigNumber(amount).multipliedBy(slippagePercentage).div(100);

  return new BigNumber(amount).minus(slippageAmount).toFixed(0);
};
