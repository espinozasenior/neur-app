import {
  TransactionArgument,
  TransactionBlock,
  TransactionArgument as TransactionObjectArgument,
} from "@mysten/sui.js/transactions";
import { bcs, ObjectArg as SuiObjectArg } from "@mysten/sui.js/bcs";
import { BcsType } from "@mysten/bcs";

export interface FieldsWithTypes {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  fields: Record<string, any>;
  type: string;
}

export type ObjectId = string;

export type ObjectCallArg = { Object: SuiObjectArg };

export type ObjectArg = string | ObjectCallArg | TransactionArgument;

export type PureArg = bigint | string | number | boolean | null | TransactionArgument | Array<PureArg>;
export type GenericArg = ObjectArg | PureArg | Array<ObjectArg> | Array<PureArg> | Array<GenericArg>;

export function parseTypeName(name: string): { typeName: string; typeArgs: string[] } {
  const parsed = bcs.parseTypeName(name);
  return { typeName: parsed.name, typeArgs: parsed.params as string[] };
}

export function isTransactionArgument(arg: GenericArg): arg is TransactionArgument {
  if (!arg || typeof arg !== "object" || Array.isArray(arg)) {
    return false;
  }

  return "kind" in arg;
}

export function isTransactionObjectArgument(arg: GenericArg): arg is TransactionObjectArgument {
  if (!isTransactionArgument(arg)) {
    return false;
  }

  if (arg.kind === "Input" && arg.type === "pure") {
    return false;
  }

  return true;
}

export function obj(txb: TransactionBlock, arg: ObjectArg) {
  return isTransactionArgument(arg) ? arg : txb.object(arg);
}

export function compressSuiAddress(addr: string): string {
  // remove leading zeros
  const stripped = addr.split("0x").join("");
  for (let i = 0; i < stripped.length; i++) {
    if (stripped[i] !== "0") {
      return `0x${stripped.substring(i)}`;
    }
  }
  return "0x0";
}

// Recursively removes leading zeros from a type.
// e.g. `0x00000002::module::Name<0x00001::a::C>` -> `0x2::module::Name<0x1::a::C>`
export function compressSuiType(type: string): string {
  const { typeName, typeArgs } = parseTypeName(type);
  switch (typeName) {
    case "bool":
    case "u8":
    case "u16":
    case "u32":
    case "u64":
    case "u128":
    case "u256":
    case "address":
    case "signer":
      return typeName;
    case "vector":
      return `vector<${compressSuiType(typeArgs[0])}>`;
    default: {
      const tok = typeName.split("::");
      tok[0] = compressSuiAddress(tok[0]);
      const compressedName = tok.join("::");
      if (typeArgs.length > 0) {
        return `${compressedName}<${typeArgs.map((typeArg) => compressSuiType(typeArg)).join(",")}>`;
      } else {
        return compressedName;
      }
    }
  }
}

export function composeSuiType(typeName: string, ...typeArgs: string[]): string {
  if (typeArgs.length > 0) {
    return `${typeName}<${typeArgs.join(", ")}>`;
  } else {
    return typeName;
  }
}
