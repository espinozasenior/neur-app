/* eslint-disable require-jsdoc */

import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { fixedOneN } from "./constants";
import { GetLpCoinDecimalsInput } from "./types";

export function getCreatePoolCapIdAndLpCoinType(createLpCoinTransactionResult: SuiTransactionBlockResponse): {
  createPoolCapId: string;
  lpCoinType: string;
} {
  const requiredObjectTypePart = "CreatePoolCap";
  const objectChanges = createLpCoinTransactionResult.objectChanges;

  if (objectChanges === null || objectChanges === undefined) {
    throw new Error(
      "[getCreatePoolCapIdAndLpCoinType] object changes are null or " +
        `undefined for transaction ${createLpCoinTransactionResult.digest}`,
    );
  }

  const createdObjectChanges = objectChanges.filter((change) => change.type === "created");

  if (createdObjectChanges.length === 0) {
    throw new Error(
      "[getCreatePoolCapIdAndLpCoinType] there is no created object changes " +
        `for transaction ${createLpCoinTransactionResult.digest}`,
    );
  }

  const requiredObjectChange = createdObjectChanges.find(
    (change) => change.type === "created" && change.objectType.includes(requiredObjectTypePart),
  );

  if (requiredObjectChange === undefined) {
    throw new Error(
      `[getCreatePoolCapIdAndLpCoinType] there is no object change with "${requiredObjectTypePart}" ` +
        `for transaction ${createLpCoinTransactionResult.digest}`,
    );
  }

  const matches = requiredObjectChange.type === "created" && requiredObjectChange.objectType.match(/<([^>]*)>/);

  if (matches && matches[1]) {
    const lpCoinType = matches[1];
    const createPoolCapId = requiredObjectChange.objectId;

    return { lpCoinType, createPoolCapId };
  } else {
    throw new Error(
      "[getCreatePoolCapIdAndLpCoinType] could find enough matches to get lpCoinType " +
        `from object changes.\nrequiredObjectChange: ${JSON.stringify(requiredObjectChange)}\n` +
        `matches: ${JSON.stringify(matches)}`,
    );
  }
}

export function getPoolObjectIdFromTransactionResult(createPoolTransactionResult: SuiTransactionBlockResponse) {
  const requiredObjectTypePart = "pool::Pool";
  const objectChanges = createPoolTransactionResult.objectChanges;

  if (objectChanges === null || objectChanges === undefined) {
    throw new Error(
      "[getPoolObjectIdFromTransactionResult] object changes are null or " +
        `undefined for transaction ${createPoolTransactionResult.digest}`,
    );
  }

  const createdObjectChanges = objectChanges.filter((change) => change.type === "created");

  if (createdObjectChanges.length === 0) {
    throw new Error(
      "[getPoolObjectIdFromTransactionResult] there is no created object changes " +
        `for transaction ${createPoolTransactionResult.digest}`,
    );
  }

  const requiredObjectChange = createdObjectChanges.find(
    (change) => change.type === "created" && change.objectType.includes(requiredObjectTypePart),
  );

  if (requiredObjectChange === undefined) {
    throw new Error(
      `[getPoolObjectIdFromTransactionResult] there is no object change with "${requiredObjectTypePart}" ` +
        `for transaction ${createPoolTransactionResult.digest}`,
    );
  }

  // ts check
  if (requiredObjectChange.type === "created") {
    return requiredObjectChange.objectId;
  } else {
    throw new Error("[getPoolObjectIdFromTransactionResult] requiredObjectChange.type is not 'created'.");
  }
}

export function numberToFixedBigInt(number: number) {
  return BigInt(Math.floor(number * fixedOneN));
}

export function getLpCoinDecimals(coinsInfo: GetLpCoinDecimalsInput): number {
  const { decimals: decimalsA, weight: weightA } = coinsInfo.coinA;
  const { decimals: decimalsB, weight: weightB } = coinsInfo.coinB;

  const weightABigInt: bigint = numberToFixedBigInt(weightA);
  const weightBBigInt: bigint = numberToFixedBigInt(weightB);

  const mulResA: bigint = weightABigInt * BigInt(decimalsA);
  const mulResB: bigint = weightBBigInt * BigInt(decimalsB);

  const sumRes: bigint = mulResA + mulResB;
  const divRes: bigint = sumRes / BigInt(fixedOneN);
  const lpCoinDecimals = Number(divRes);

  return lpCoinDecimals;
}
