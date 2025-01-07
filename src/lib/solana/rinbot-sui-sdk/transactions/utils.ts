/* eslint-disable require-jsdoc */

import { TransactionArgument, TransactionBlock } from "@mysten/sui.js/transactions";
import { GenericArg, ObjectArg } from "./types";

export function isTransactionArgument(arg: GenericArg): arg is TransactionArgument {
  if (!arg || typeof arg !== "object" || Array.isArray(arg)) {
    return false;
  }

  return "kind" in arg;
}

export function obj(tx: TransactionBlock, arg: ObjectArg) {
  return isTransactionArgument(arg) ? arg : tx.object(arg);
}
