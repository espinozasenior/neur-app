import BigNumber from "bignumber.js";

/**
 * Convert an amount in raw (float format) to BN string format based on the specified decimal points.
 *
 * @param {string} amount - The amount in raw (float format).
 * @param {number} decimals - The number of decimal points for the currency.
 * @return {number} Returns the amount in BN string format.
 * @throws {Error} Throws an error if the resulting amount is not a BN string or provided decimals is not valid.
 * @example
 * const SUI_DECIMALS = 9;
 * const amountInRaw = '123.456789';
 * const amountInBNFormat = convertToBNFormat(amountInRaw, SUI_DECIMALS);
 * console.log("Amount in BN format:", amountInBNFormat); // 123456789000
 */
export function convertToBNFormat(amount: string, decimals: number): string {
  if (decimals < 0) {
    throw new Error("Decimal points must be a non-negative integer.");
  }

  if (!Number.isInteger(decimals)) {
    throw new Error("Decimal points must be an integer.");
  }

  const bnAmount = new BigNumber(amount).multipliedBy(10 ** decimals);

  if (isNaN(bnAmount.toNumber())) {
    throw new Error(`Invalid decimal conversion: Decimals ${decimals} is not correct for the given token.`);
  }

  return bnAmount.toString();
}
