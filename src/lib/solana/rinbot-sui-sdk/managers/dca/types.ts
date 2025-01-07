import { CoinStruct, SuiEvent, SuiObjectData, SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { ObjectArg, TransactionResult } from "../../transactions/types";

export enum DCATimescale {
  Seconds = 0,
  Minutes = 1,
  Hours = 2,
  Days = 3,
  Weeks = 4,
  Months = 5,
}

export type GetDCAInitTransactionArgs = {
  baseCoinType: string;
  quoteCoinType: string;

  timeScale: DCATimescale;
  every: number;
  baseCoinAccount: ObjectArg;
  totalOrders: number;

  gasCoinAccount: ObjectArg;

  transaction?: TransactionBlock;
};

export type GetDCAInitWithPriceParamsTransactionArgs = {
  minPrice: string;
  maxPrice: string;
} & GetDCAInitTransactionArgs;

export type CreateDCAInitTransactionArgs = Omit<
  Omit<GetDCAInitTransactionArgs, "baseCoinAccount">,
  "gasCoinAccount"
> & {
  publicKey: string;
  baseCoinAmountToDepositIntoDCA: string;
  allCoinObjectsList: CoinStruct[];
  minPrice?: string;
  maxPrice?: string;
};

export interface GetDCADepositBaseTransactionArgs {
  dca: ObjectArg;
  baseCoinType: string;
  quoteCoinType: string;
  baseCoinAccount: ObjectArg;
  addOrdersCount: number;

  gasCoinAccount: ObjectArg;

  transaction?: TransactionBlock;
}

export type CreateDCADepositBaseTransactionArgs = Omit<
  Omit<GetDCADepositBaseTransactionArgs, "baseCoinAccount">,
  "gasCoinAccount"
> & {
  publicKey: string;
  baseCoinAmountToDepositIntoDCA: string;
  allCoinObjectsList: CoinStruct[];
};

export interface GetDCAWithdrawBaseTransactionArgs {
  dca: ObjectArg;

  baseCoinType: string;
  quoteCoinType: string;

  baseCoinAmountToWithdrawFromDCA: string;
  removeOrdersCount?: number;

  transaction?: TransactionBlock;
}

export interface GetDCAInitTradeTransactionArgs {
  dca: ObjectArg;
  baseCoinType: string;
  quoteCoinType: string;

  transaction?: TransactionBlock;
}

export interface GetDCAResolveTradeTransactionArgs {
  dca: ObjectArg;

  baseCoinType: string;
  quoteCoinType: string;

  transaction?: TransactionBlock;

  quoteAmount: string;
  initTradePromise: TransactionResult;
}

export interface GetDCAIncreaseOrdersRemainingTransactionArgs {
  publicKey: string;
  dca: ObjectArg;

  baseCoinType: string;
  quoteCoinType: string;

  transaction?: TransactionBlock;
  addOrdersCount: number;
}

export interface GetDCASetInactiveTransactionArgs {
  dca: ObjectArg;

  baseCoinType: string;
  quoteCoinType: string;

  transaction?: TransactionBlock;
}

export type GetDCASetReactivateAsOwnerTransactionArgs = GetDCASetInactiveTransactionArgs;
export type GetDCARedeemFundsAndCloseTransactionArgs = GetDCASetInactiveTransactionArgs;

export type GetDCAAddGasBudgetTransactionArgs = { gasCoinAccount: ObjectArg } & GetDCASetInactiveTransactionArgs;
export type CreateDCAAddGasBudgetTransaction = {
  gasAmountToAdd: string;
} & Omit<GetDCAAddGasBudgetTransactionArgs, "gasCoinAccount">;

export type DCACreateEventParsedJson = {
  delegatee: string;
  id: string;
  owner: string;
};

// Extend SuiEvent to include your specific parsedJson type
export interface SuiEventDCACreate extends SuiEvent {
  parsedJson: DCACreateEventParsedJson;
}

export interface DCAContent {
  dataType: "moveObject";
  type: string;
  hasPublicTransfer: boolean;
  fields: DCAContentFields;
}

export type DCAContentFields = {
  active: boolean;
  input_balance: string;
  delegatee: string;
  every: string;
  gas_budget: string;
  id: { id: string };
  last_time_ms: string;
  owner: string;
  remaining_orders: string;
  split_allocation: string;
  start_time_ms: string;
  time_scale: number;
  trade_params: {
    type: string;
    fields: {
      max_price: string | null;
      min_price: string | null;
    };
  };
};

export interface DCAObject extends DCAContent {
  fields: DCAContentFields & {
    base_coin_type: string;
    quote_coin_type: string;
  };
}

export interface DCAResponseData extends SuiObjectData {
  content: DCAContent;
}

export interface DCAResponse extends SuiObjectResponse {
  data: DCAResponseData;
}
