// This file is partially copied from https://github.com/interest-protocol/sui-coins.

export interface ICreateTokenForm {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals?: number | undefined;
  imageUrl?: string | undefined;
  description: string;
  fixedSupply: NonNullable<boolean | undefined>;
}
