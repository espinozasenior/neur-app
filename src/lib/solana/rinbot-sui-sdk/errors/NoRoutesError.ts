/**
 * Custom error class representing an error when no routes are found.
 * @class
 * @extends Error
 */
export class NoRoutesError extends Error {
  /**
   * Creates an instance of NoRoutesError.
   * @constructor
   * @param {string} msg - The error message.
   */
  constructor(msg: string) {
    super(msg);
  }
}
