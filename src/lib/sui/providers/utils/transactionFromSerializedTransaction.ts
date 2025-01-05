import { TransactionBlock } from "@mysten/sui.js/transactions";

export const transactionFromSerializedTransaction = (serializedTransaction: string) => {
  const txBlock = new TransactionBlock(TransactionBlock.from(serializedTransaction));

  return txBlock;
};
