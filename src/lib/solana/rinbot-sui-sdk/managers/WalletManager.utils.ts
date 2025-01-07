import { bech32 } from "bech32";
import { createCipheriv, createDecipheriv } from 'crypto';
import { randomBytes } from 'crypto';
/**
 * Validates if the input string conforms to the Bech32 format.
 * Bech32 is a format for encoding Bitcoin addresses.
 * @param {string} input The string to validate.
 * @return {boolean} True if the input string is a valid Bech32 format, otherwise false.
 */
export function isValidBech32(input: string): boolean {
  try {
    // Attempt to decode the Bech32 string
    bech32.decode(input);

    // If decoding is successful, return true
    return true;
  } catch (error) {
    // If decoding fails, return false and log a warning
    if (error instanceof Error) {
      console.warn("Invalid Bech32 format:", error.message);
    } else {
      console.warn("Invalid Bech32 format:", error);
    }
    return false;
  }
}

/**
 * Validates if the input string is a valid hexadecimal string.
 * @param {string} input The string to validate.
 * @return {boolean} True if the input string is a valid hexadecimal string, otherwise false.
 */
export function isValidHex(input: string): boolean {
  // Regular expression for hexadecimal string
  const hexRegex = /^[0-9a-fA-F]+$/;

  // Use match to check if the input matches the hexadecimal format
  const matches = input.match(hexRegex);
  const isValid = matches !== null;

  return isValid;
}

/**
 * Determines the format of the input string (Bech32 or hexadecimal).
 * @param {string} input The string to check.
 * @return {string} The format of the input string ('bech32' or 'hex').
 * @throws {Error} If the input string does not match any format.
 */
export function determineFormat(input: string): "bech32" | "hex" {
  if (isValidBech32(input)) {
    return "bech32";
  } else if (isValidHex(input)) {
    return "hex";
  } else {
    throw new Error("Unrecognized format");
  }
}

/**
 * Wallet encryption tool class
 */
export class WalletEncryption {
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly encryptionKey = Buffer.from(
    process.env.WALLET_ENCRYPTION_KEY!,
    'utf-8',
  ).subarray(0, 32);
  private static readonly ivLength = 16;

  static async encrypt(source: string): Promise<string> {
    try {
      const iv = randomBytes(this.ivLength);
      const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);
      const encrypted = Buffer.concat([
        cipher.update(source, 'utf8'),
        cipher.final(),
      ]);
      const result = Buffer.concat([iv, encrypted]);
      return result.toString('base64');
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt private key');
    }
  }

  static async decrypt(encrypted: string): Promise<string> {
    try {
      if (!encrypted) {
        throw new Error('Missing encrypted private key');
      }

      const encryptedBuffer = Buffer.from(encrypted, 'base64');
      const iv = encryptedBuffer.subarray(0, this.ivLength);
      const encryptedContent = encryptedBuffer.subarray(this.ivLength);

      const decipher = createDecipheriv(this.algorithm, this.encryptionKey, iv);
      const decrypted = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Decryption failed:', error);
      if (error instanceof Error) {
        throw new Error(`Private key decryption failed: ${error.message}`);
      }
      throw new Error('Private key decryption failed');
    }
  }
}