import { PUBLISHED_AT } from "..";
import { ObjectArg, obj } from "../../_framework/util";
import { TransactionArgument, TransactionBlock } from "@mysten/sui.js/transactions";

export interface BuyArgs {
  state: ObjectArg;
  userState: ObjectArg;
  payment: ObjectArg;
  clock: ObjectArg;
}

export function buy(txb: TransactionBlock, typeArg: string, args: BuyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::meme::buy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.state), obj(txb, args.userState), obj(txb, args.payment), obj(txb, args.clock)],
  });
}

export interface CreateStateArgs {
  deposit: ObjectArg;
  start: bigint | TransactionArgument;
  end: bigint | TransactionArgument;
}

export function createState(txb: TransactionBlock, typeArg: string, args: CreateStateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::meme::create_state`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.deposit), txb.pure(args.start, "u64"), txb.pure(args.end, "u64")],
  });
}

export function createUserState(txb: TransactionBlock) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::meme::create_user_state`,
    arguments: [],
  });
}

export function init(txb: TransactionBlock) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::meme::init`,
    arguments: [],
  });
}
