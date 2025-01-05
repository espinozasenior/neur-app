import { CommonPoolData } from "../types";

/* eslint-disable require-jsdoc */
export function hasPath(coinA: string, coinB: string, pathMap: Map<string, CommonPoolData>): boolean {
  const keyAB = `${coinA}-${coinB}`;
  const keyBA = `${coinB}-${coinA}`;
  return pathMap.has(keyAB) || pathMap.has(keyBA);
}
