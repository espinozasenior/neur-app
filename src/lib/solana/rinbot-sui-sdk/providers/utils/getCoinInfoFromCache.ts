/* eslint-disable require-jsdoc */
import { CommonCoinData } from "../../managers/types";
import { LONG_SUI_COIN_TYPE, SHORT_SUI_COIN_TYPE } from "../common";
import { CoinsCache } from "../types";

export function getCoinInfoFromCache(coinType: string, coinsCache: CoinsCache): CommonCoinData | undefined {
  const coinIsSui: boolean = coinType === SHORT_SUI_COIN_TYPE || coinType === LONG_SUI_COIN_TYPE;
  const coinTypeInfo = coinIsSui
    ? coinsCache.get(LONG_SUI_COIN_TYPE) || coinsCache.get(SHORT_SUI_COIN_TYPE)
    : coinsCache.get(coinType);

  return coinTypeInfo;
}
