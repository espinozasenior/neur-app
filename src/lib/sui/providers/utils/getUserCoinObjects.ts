import { SuiClient as UpdatedSuiClient } from "@mysten/sui.js-0.51.2/client";
import { CoinStruct, PaginatedCoins, SuiClient } from "@mysten/sui.js/client";

/**
 * @description Retrieves all coin objects associated with a wallet with `publicKey` and specified `coinType`.
 *
 * @param {Object} params - Parameters object.
 * @param {string} params.publicKey - The public key of the wallet.
 * @param {string} params.coinType - The coin type of specified coin.
 * @param {string} params.provider - The Sui Client to fetch coin objects data.
 * @return {Promise<CoinStruct[]>} A promise that resolves to an array of coin objects data.
 */
export async function getUserCoinObjects({
  coinType,
  publicKey,
  provider,
}: {
  coinType: string;
  publicKey: string;
  provider: SuiClient | UpdatedSuiClient;
}): Promise<CoinStruct[]> {
  const pageCapacity = 50;
  const allObjects: CoinStruct[] = [];
  let nextCursor: string | null | undefined = null;
  let assets: PaginatedCoins = await provider.getCoins({
    owner: publicKey,
    coinType,
    limit: pageCapacity,
    cursor: nextCursor,
  });

  // Fetching and combining part
  while (assets.hasNextPage) {
    const coinObjects: CoinStruct[] = assets.data;
    allObjects.push(...coinObjects);

    nextCursor = assets.nextCursor;
    assets = await provider.getCoins({
      owner: publicKey,
      coinType,
      limit: pageCapacity,
      cursor: nextCursor,
    });
  }

  // In case user has less tokens than `pageCapacity` (1 page only), we should put them into `allObjects`
  const coinObjects: CoinStruct[] = assets.data;
  allObjects.push(...coinObjects);

  return allObjects;
}
