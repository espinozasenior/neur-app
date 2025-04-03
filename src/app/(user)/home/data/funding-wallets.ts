import { ConnectedSolanaWallet } from '@privy-io/react-auth';

import { EmbeddedWallet } from '@/types/db';
import { FungibleToken } from '@/types/helius/fungibleToken';
import { NonFungibleToken } from '@/types/helius/nonFungibleToken';

export interface FundingWallet {
  id: string;
  name: string;
  publicKey: string;
  walletPortfolio?: WalletPortfolio;
}
export interface WalletPortfolio {
  fungibleTokens: FungibleToken[];
  nonFungibleTokens: NonFungibleToken[];
}
export class EmbeddedFundingWallet implements FundingWallet {
  public readonly id: string;
  public readonly name: string;
  public readonly publicKey: string;
  public walletPortfolio?: WalletPortfolio;

  constructor(embeddedWallet: EmbeddedWallet) {
    this.id = embeddedWallet.id;
    this.name = embeddedWallet.name;
    this.publicKey = embeddedWallet.publicKey;
  }

}

export class SolanaConnectedFundingWallet implements FundingWallet {
  public readonly id: string;
  public readonly name: string;
  public readonly publicKey: string;

  constructor(solanaConnectedWallet: ConnectedSolanaWallet) {
    this.id = solanaConnectedWallet.address;
    this.name = solanaConnectedWallet.meta.name;
    this.publicKey = solanaConnectedWallet.address;
  }
}
