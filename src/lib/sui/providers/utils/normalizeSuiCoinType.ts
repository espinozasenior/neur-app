import { LONG_SUI_COIN_TYPE } from "../common";

/**
 * Ensures a SUI address is in its canonical form.
 * @param {string} address - The address to normalize.
 * @return {string} The canonical form of the address.
 */
export function normalizeSuiCoinType(address: string): string {
  // If the address is already in its canonical form, just return it. Else return canonical one.
  if (address === LONG_SUI_COIN_TYPE) {
    return address;
  } else {
    return LONG_SUI_COIN_TYPE;
  }
}
