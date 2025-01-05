import { CommonCoinData } from "../../managers/types";
import { CommonPoolData } from "../../providers/types";
import { Storage } from "../types";
import { getCoinsCache } from "./getCoinsCache";
import { getPathsCache } from "./getPathsCache";

/**
 * Returns coins and paths caches from storage. If cache is not up to date, empty map is returned.
 */
export const getCoinsAndPathsCaches = async ({
  storage,
  provider,
  updateCacheInterval,
}: {
  storage: Storage;
  provider: string;
  updateCacheInterval: number;
}): Promise<{
  coinsCache: Map<string, CommonCoinData>;
  pathsCache: Map<string, CommonPoolData>;
}> => {
  const coinsCache = await getCoinsCache({ storage, provider, updateCacheInterval });
  const pathsCache = await getPathsCache({ storage, provider, updateCacheInterval });

  return { coinsCache, pathsCache };
};
