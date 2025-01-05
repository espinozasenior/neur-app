/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetCacheParams, IStorage, SetCacheParams, StorageValue } from "./types";

/**
 * Default in-memory storage implementation.
 * You may extend this class or provide your own storage implementation as needed.
 *
 * Disclaimer: While the methods in this class are marked as public,
 * it is strongly discouraged to use them directly unless you are certain
 * about their behavior. For typical SDK usage, consider interacting with
 * the SDK's public API instead of directly using the methods of this class.
 * External usage may lead to unintended behavior and issues.
 */
export class InMemoryStorageSingleton implements IStorage {
  private static _instance: InMemoryStorageSingleton;

  /**
   * Private constructor for the singleton pattern.
   */
  private constructor() {
    // Additional initialization if needed.
  }

  /**
   * Gets the instance of the InMemoryStorageSingleton.
   * @return {InMemoryStorageSingleton} - The singleton instance.
   */
  public static getInstance(): InMemoryStorageSingleton {
    if (!InMemoryStorageSingleton._instance) {
      console.warn(`
      Warning: InMemoryStorageSingleton is being used as a placeholder. While it's safe to use for basic scenarios,
      note that no prefilling data from cache storage will occur. Consider providing your own storage implementation
      for more advanced use cases.
    `);
      const instance = new InMemoryStorageSingleton();
      InMemoryStorageSingleton._instance = instance;
    }

    return InMemoryStorageSingleton._instance;
  }

  /**
   * Placeholder for setCache method. Implement your custom logic if needed.
   * @param {SetCacheParams} params - SetCacheParams object containing key and value.
   * @return {Promise<void>} - A promise that resolves once the cache is set.
   */
  public async setCache(params: SetCacheParams): Promise<void> {
    // Placeholder. Implement your custom logic if needed.
  }

  /**
   * Placeholder for getCache method. Implement your custom logic if needed.
   * @param {GetCacheParams} params - GetCacheParams object containing the key.
   * @return {Promise<StorageValue>} - A promise that resolves to the retrieved StorageValue.
   */
  public async getCache(params: GetCacheParams): Promise<StorageValue> {
    // Placeholder. Implement your custom logic if needed.
    return null;
  }
}
