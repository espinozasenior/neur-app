/* eslint-disable require-jsdoc */

import { PathLink } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { CetusSingleton } from "../../providers/cetus/cetus";
import { CetusPathForStorage } from "../../providers/cetus/types";
import { Storage, StorageProperty } from "../types";

export async function storeCetusPathsCache({
  provider,
  storage,
  pathsCache,
}: {
  provider: string;
  storage: Storage;
  pathsCache: ReturnType<CetusSingleton["getPaths"]>;
}): Promise<void> {
  try {
    const paths: PathLink[] = Array.from(pathsCache.values());

    const pathsForStorage: CetusPathForStorage[] = paths.map((pathLink) => ({
      base: pathLink.base,
      quote: pathLink.quote,
      addressMap: Array.from(pathLink.addressMap.entries()),
    }));

    await storage.setCache({
      provider,
      property: StorageProperty.CetusPaths,
      value: { value: pathsForStorage, timestamp: Date.now().toString() },
    });
  } catch (error) {
    console.error(`[storeCetusPathsCache] error for params: provider ${provider} `, error);

    throw error;
  }
}
