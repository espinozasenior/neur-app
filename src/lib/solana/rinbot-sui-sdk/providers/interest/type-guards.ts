/* eslint-disable require-jsdoc */
import {
  CoinState,
  InterestPool,
  RebalancingParams,
  StableFees,
  StablePoolState,
  VolatileFees,
  VolatilePoolState,
} from "@interest-protocol/clamm-sdk";

export function isApiResponseValid(pools: unknown): pools is InterestPool[] {
  return pools !== undefined && Array.isArray(pools) && pools.length > 0 && pools.every(isInterestPool);
}

export function isInterestPool(pool: unknown): pool is InterestPool {
  if (
    typeof pool !== "object" ||
    pool === null ||
    !("poolObjectId" in pool && typeof pool.poolObjectId === "string") ||
    !("lpCoinType" in pool && typeof pool.lpCoinType === "string") ||
    !("isStable" in pool && typeof pool.isStable === "boolean") ||
    !("coinTypes" in pool && Array.isArray(pool.coinTypes)) ||
    !("state" in pool && typeof pool.state === "object")
  ) {
    return false;
  }

  if (pool.isStable) {
    if (!isStablePoolState(pool.state)) {
      return false;
    }
  } else {
    if (!isVolatilePoolState(pool.state)) {
      return false;
    }
  }

  return true;
}

export function isStablePoolState(state: unknown): state is StablePoolState {
  return (
    typeof state === "object" &&
    state !== null &&
    "lpCoinSupply" in state &&
    typeof state.lpCoinSupply === "bigint" &&
    "lpCoinDecimals" in state &&
    typeof state.lpCoinDecimals === "number" &&
    "balances" in state &&
    Array.isArray(state.balances) &&
    state.balances.every((balance: unknown) => typeof balance === "bigint") &&
    "initialA" in state &&
    typeof state.initialA === "bigint" &&
    "futureA" in state &&
    typeof state.futureA === "bigint" &&
    "initialATime" in state &&
    typeof state.initialATime === "bigint" &&
    "futureATime" in state &&
    typeof state.futureATime === "bigint" &&
    "nCoins" in state &&
    typeof state.nCoins === "number" &&
    "fees" in state &&
    isStableFees(state.fees)
  );
}

export function isVolatilePoolState(state: unknown): state is VolatilePoolState {
  return (
    typeof state === "object" &&
    state !== null &&
    "a" in state &&
    typeof state.a === "bigint" &&
    "futureA" in state &&
    typeof state.futureA === "bigint" &&
    "gamma" in state &&
    typeof state.gamma === "bigint" &&
    "initialTime" in state &&
    typeof state.initialTime === "bigint" &&
    "futureGamma" in state &&
    typeof state.futureGamma === "bigint" &&
    "futureTime" in state &&
    typeof state.futureTime === "bigint" &&
    "adminBalance" in state &&
    typeof state.adminBalance === "bigint" &&
    "balances" in state &&
    Array.isArray(state.balances) &&
    state.balances.every((balance) => typeof balance === "bigint") &&
    "d" in state &&
    typeof state.d === "bigint" &&
    "fees" in state &&
    isVolatileFees(state.fees) &&
    "lastPriceTimestamp" in state &&
    typeof state.lastPriceTimestamp === "bigint" &&
    "lpCoinSupply" in state &&
    typeof state.lpCoinSupply === "bigint" &&
    "maxA" in state &&
    typeof state.maxA === "bigint" &&
    "minA" in state &&
    typeof state.minA === "bigint" &&
    "nCoins" in state &&
    typeof state.nCoins === "number" &&
    "rebalancingParams" in state &&
    isRebalancingParams(state.rebalancingParams) &&
    "virtualPrice" in state &&
    typeof state.virtualPrice === "bigint" &&
    "xcpProfit" in state &&
    typeof state.xcpProfit === "bigint" &&
    "xcpProfitA" in state &&
    typeof state.xcpProfitA === "bigint" &&
    "notAdjusted" in state &&
    typeof state.notAdjusted === "boolean" &&
    "coinStateMap" in state &&
    isCoinStateMap(state.coinStateMap)
  );
}

function isStableFees(fees: unknown): fees is StableFees {
  return (
    typeof fees === "object" &&
    fees !== null &&
    "feeInPercent" in fees &&
    typeof fees.feeInPercent === "bigint" &&
    "feeOutPercent" in fees &&
    typeof fees.feeOutPercent === "bigint" &&
    "adminFeePercent" in fees &&
    typeof fees.adminFeePercent === "bigint"
  );
}

function isVolatileFees(fees: unknown): fees is VolatileFees {
  return (
    typeof fees === "object" &&
    fees !== null &&
    "adminFee" in fees &&
    typeof fees.adminFee === "bigint" &&
    "gammaFee" in fees &&
    typeof fees.gammaFee === "bigint" &&
    "midFee" in fees &&
    typeof fees.midFee === "bigint" &&
    "outFee" in fees &&
    typeof fees.outFee === "bigint"
  );
}

function isRebalancingParams(params: unknown): params is RebalancingParams {
  return (
    typeof params === "object" &&
    params !== null &&
    "adjustmentStep" in params &&
    typeof params.adjustmentStep === "bigint" &&
    "extraProfit" in params &&
    typeof params.extraProfit === "bigint" &&
    "maHalfTime" in params &&
    typeof params.maHalfTime === "bigint"
  );
}

function isCoinStateMap(map: unknown): map is Record<string, CoinState> {
  return typeof map === "object" && map !== null && Object.values(map).every(isCoinState);
}

function isCoinState(state: unknown): state is CoinState {
  return (
    typeof state === "object" &&
    state !== null &&
    "index" in state &&
    typeof state.index === "number" &&
    "lastPrice" in state &&
    typeof state.lastPrice === "bigint" &&
    "price" in state &&
    typeof state.price === "bigint" &&
    "priceOracle" in state &&
    typeof state.priceOracle === "bigint" &&
    "type" in state &&
    typeof state.type === "string"
  );
}
