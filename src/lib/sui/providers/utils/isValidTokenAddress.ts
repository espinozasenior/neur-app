import { TOKEN_ADDRESS_BASE_REGEX } from "../common";

const tokenAddressRegex = new RegExp(`^${TOKEN_ADDRESS_BASE_REGEX.source}$`);

export type TokenAddress = `0x${string}::${string}::${string}`;

/**
 * Checks if a string has the format of a valid token address.
 *
 * @param {string} str - The input string to be validated.
 * @return {boolean} Returns true if the input string has the valid token address format.
 * @throws {TypeError} Throws a type error if the input string is not a valid token address.
 * @example
 * const validAddress: TokenAddress = "0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::sui::SUI";
 * if (isValidTokenAddress(validAddress)) {
 *   console.log("Valid token address:", validAddress);
 * } else {
 *   console.log("Invalid token address");
 * }
 */
export function isValidTokenAddress(str: string): str is TokenAddress {
  return tokenAddressRegex.test(str);
}
