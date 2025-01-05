/**
 * Convert slippage from percentage to absolute value.
 *
 * @param {number} slippagePercentage - The slippage percentage to be converted.
 * @return {number} Returns the absolute slippage value as a decimal between 0 and 1.
 * @throws {Error} Throws an error if the slippage is not correct or if it's not a number.

 * @example
 * const slippagePercentage = 50;
 * const absoluteSlippage = convertSlippage(slippagePercentage);
 * console.log("Absolute slippage:", absoluteSlippage); // 0.5
 */
export function convertSlippage(slippagePercentage: number): number {
  if (typeof slippagePercentage !== "number" || isNaN(slippagePercentage)) {
    throw new Error("Slippage percentage must be a valid number.");
  }

  if (slippagePercentage < 0 || slippagePercentage >= 100) {
    throw new Error("Slippage percentage must be between 0 (inclusive) and 100 (exclusive).");
  }

  const absoluteSlippage = slippagePercentage / 100;
  return absoluteSlippage;
}
