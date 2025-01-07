export type AnyFunction = (...args: RouteParams[]) => any;
export type RouteParams = {
  coinTypeFrom: string;
  coinTypeTo: string;
  inputAmount: string;
  slippagePercentage: number;
  publicKey: string;
};

/**
 * Wraps an asynchronous function in a try-catch block, logging any errors.
 *
 * @template T - The type of the wrapped function.
 * @param {T} callback - The asynchronous function to be wrapped.
 * @param {...Parameters<T>} args - The arguments to be passed to the asynchronous function.
 * @return {Promise<ReturnType<T> | null>} - A Promise that resolves to the result of the
 *   asynchronous function if successful, or null if an error occurs.
 */
export async function tryCatchWrapper<T extends AnyFunction>(
  callback: T,
  ...args: Parameters<T>
): Promise<ReturnType<T> | null> {
  try {
    const result = (await callback(...args)) as ReturnType<T>;
    return result;
  } catch (error) {
    // eslint-disable-next-line no-empty
    if (error instanceof Error && error.message.includes("From/To coin is undefined")) {
      // Silently handle the specific error when "From/To coin is undefined,"
      // as it may be expected in cases where CetusSingleton disables fallback
      // due to the client passing 'useOnChainFallback' as false.
      // This is necessary because fixing the broken fallback is not possible
      // due to limitations in the Cetus SDK.
    } else {
      console.error("Error:", error);
    }

    return null;
  }
}
