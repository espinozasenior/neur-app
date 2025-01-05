import { LONG_SUI_COIN_TYPE, SHORT_SUI_COIN_TYPE } from "../common";

/**
 * Checks if a given coin type is a SUI coin type.
 *
 * @param {string} coinType - The coin type to check.
 * @return {boolean} Returns true if the coin type is a SUI coin type, otherwise false.
 */
export function isSuiCoinType(coinType: string) {
  return coinType === LONG_SUI_COIN_TYPE || coinType === SHORT_SUI_COIN_TYPE;
}
