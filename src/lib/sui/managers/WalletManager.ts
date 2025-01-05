import {
  CoinBalance,
  CoinStruct,
  DevInspectResults,
  GasCostSummary,
  PaginatedCoins,
  SuiClient,
} from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { TransactionBlock as UpdatedTransactionBlock } from "@mysten/sui.js-0.51.2/transactions";
import { SUI_DECIMALS } from "@mysten/sui.js/utils";
import BigNumber from "bignumber.js";
import { SUI_DENOMINATOR, SWAP_GAS_BUDGET } from "../providers/common";
import { CoinManagerSingleton } from "./coin/CoinManager";
import { CoinAssetData, IWalletManager } from "./types";
import { getCoinsAssetsFromCoinObjects, normalizeMnemonic } from "./utils";
import { bech32 } from "bech32";
import { determineFormat } from "./WalletManager.utils";
import { TransactionResult } from "../transactions/types";

/**
 * @class WalletManagerSingleton
 * @implements {IWalletManager}
 * @description Manages wallets and transactions related to wallets.
 */
export class WalletManagerSingleton implements IWalletManager {
  private provider: SuiClient;
  private coinManager: CoinManagerSingleton;
  private static _instance: WalletManagerSingleton;

  /**
   * @constructor
   * @param {SuiClient} provider - The SuiClient provider.
   * @param {CoinManagerSingleton} coinManager - The coin manager instance.
   */
  private constructor(provider: SuiClient, coinManager: CoinManagerSingleton) {
    this.provider = provider;
    this.coinManager = coinManager;
  }

  /**
   * @public
   * @method getInstance
   * @description Gets the singleton instance of WalletManager.
   * @param {SuiClient} [provider] - The SuiClient provider.
   * @param {CoinManagerSingleton} [coinManager] - The coin manager instance.
   * @return {WalletManagerSingleton} The singleton instance of WalletManager.
   * @throws {Error} Throws an error if provider or coinManager are not provided.
   */
  public static getInstance(provider?: SuiClient, coinManager?: CoinManagerSingleton): WalletManagerSingleton {
    if (!WalletManagerSingleton._instance) {
      if (provider === undefined) {
        throw new Error("[Wallet] Provider is required in arguments to create WalletManager instance.");
      } else if (coinManager === undefined) {
        throw new Error(
          "[Wallet] CoinManagerSingleton instance is required in arguments to create WalletManager instance.",
        );
      }

      const instance = new WalletManagerSingleton(provider, coinManager);
      WalletManagerSingleton._instance = instance;
    }

    return WalletManagerSingleton._instance;
  }
  /**
   * Generates a new Ed25519 key pair for a wallet, consisting of a public key and a private key.
   * @return {{ publicKey: string, privateKey: string }} An object with the public, private key (in hexadecimal format).
   */
  public static generateWallet() {
    const keypair = Ed25519Keypair.generate();
    const publicKey = keypair.getPublicKey().toSuiAddress();
    const privateKey = WalletManagerSingleton.getPrivateKeyFromKeyPair(keypair);

    return { publicKey, privateKey };
  }

  /**
   * Generates an Ed25519 key pair from a provided private key in hex or Bech32 format.
   * @param {string} privateKey - The private key in hex or Bech32 format.
   * @throws {Error} Throws an error if the provided privateKey is not in hex or Bech32 format.
   * @return {Ed25519Keypair} An Ed25519 key pair.
   */
  public static getKeyPairFromPrivateKey(privateKey: string): Ed25519Keypair {
    const format = determineFormat(privateKey);

    switch (format) {
      case "hex":
        return WalletManagerSingleton.getKeyPairFromPrivateKeyHex(privateKey);
      case "bech32":
        return WalletManagerSingleton.getKeyPairFromPrivateKeyBech32(privateKey);
      default:
        throw new Error("[WalletManagerSingleton] Unsupported keypair format");
    }
  }

  /**
   * Generates an Ed25519 key pair from a provided private key in hexadecimal format.
   * @param {string} privateKeyHex - The private key in hexadecimal format.
   * @return {Ed25519Keypair} An Ed25519 key pair.
   */
  public static getKeyPairFromPrivateKeyHex(privateKeyHex: string): Ed25519Keypair {
    const keypair = Ed25519Keypair.fromSecretKey(Buffer.from(privateKeyHex, "hex"));

    return keypair;
  }

  /**
   * Generates an Ed25519 key pair from a provided private key in bech32 format.
   * @param {string} privateKeyBech32 - The private key in bech32 format.
   * @return {Ed25519Keypair} An Ed25519 key pair.
   */
  public static getKeyPairFromPrivateKeyBech32(privateKeyBech32: string): Ed25519Keypair {
    const privateKeyConvertedFromBech32ToHex = WalletManagerSingleton.bech32ToHex(privateKeyBech32);
    const keypair = Ed25519Keypair.fromSecretKey(Buffer.from(privateKeyConvertedFromBech32ToHex, "hex"));

    return keypair;
  }

  /**
   * Converts a Bech32 encoded address to its hexadecimal representation.
   * @param {string} bech32Address - The Bech32 encoded address to convert.
   * @return {string} The hexadecimal representation of the given Bech32 address.
   */
  public static bech32ToHex(bech32Address: string): string {
    try {
      // Decode the Bech32 address to obtain the words (data part)
      const decoded = bech32.decode(bech32Address);

      // Convert the words to a Buffer
      const buffer = Buffer.from(bech32.fromWords(decoded.words));

      // Convert to hexadecimal
      let hex = buffer.toString("hex");

      // Remove the first two '00's from the prefix if present
      if (hex.startsWith("00")) {
        hex = hex.substring(2);
      }

      // Convert the Buffer to a hex string
      return hex;
    } catch (error) {
      console.error("Error converting Bech32 address to hex:", error);
      return "";
    }
  }

  /**
   * Retrieves the private key from the provided key pair.
   *
   * @param {Ed25519Keypair} keypair - The key pair containing the private key.
   * @return {string} The private key in hexadecimal format.
   */
  public static getPrivateKeyFromKeyPair(keypair: Ed25519Keypair): string {
    const privateKeyBase64 = keypair.export();
    const privateKeyHex = Buffer.from(privateKeyBase64.privateKey, "base64").toString("hex");

    return privateKeyHex;
  }

  /**
   * Generates an Ed25519 key pair from a provided mnemonic.
   * @param {string} mnemonic - Seed phrase of the wallet.
   * @return {Ed25519Keypair} An Ed25519 key pair.
   */
  public static getKeyPairFromMnemonic(mnemonic: string): Ed25519Keypair {
    const normalized = normalizeMnemonic(mnemonic);
    const keypair = Ed25519Keypair.deriveKeypair(normalized);

    return keypair;
  }

  /**
   * Retrieves a withdrawal transaction for SUI tokens.
   *
   * @return {Promise<TransactionBlock>} A Promise that resolves to a TransactionBlock.
   */
  public static async getWithdrawSuiTransaction({
    address,
    amount,
  }: {
    address: string;
    amount: string;
  }): Promise<TransactionBlock> {
    const tx = new TransactionBlock();

    const amountBigNumber = new BigNumber(amount);
    const amountInMists: string = amountBigNumber.multipliedBy(SUI_DENOMINATOR).toString();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMists)]);
    tx.transferObjects([coin], tx.pure(address));

    return tx;
  }

  /**
   * @public
   * @method getAvailableWithdrawSuiAmount
   * @description Retrieves the available amount for withdrawing SUI tokens.
   * @param {string} publicKey - The public key of the wallet.
   * @return {Promise<{ availableAmount: string, totalGasFee: string }>} A promise that resolves to
   * the available amount and total gas fee.
   */
  public async getAvailableWithdrawSuiAmount(
    publicKey: string,
  ): Promise<{ availableAmount: string; totalGasFee: string }> {
    const tx = new TransactionBlock();
    const AMOUNT_IN_SUI_MIST_TO_SIMULATE_WITHDRAW = 100;

    const [coin] = tx.splitCoins(tx.gas, [tx.pure(AMOUNT_IN_SUI_MIST_TO_SIMULATE_WITHDRAW)]);
    tx.transferObjects([coin], tx.pure(publicKey));

    const simulationResult: DevInspectResults = await this.provider.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: publicKey,
    });
    const { computationCost, storageCost, storageRebate }: GasCostSummary = simulationResult.effects.gasUsed;
    const totalGasFee: string = new BigNumber(computationCost).plus(storageCost).minus(storageRebate).toString();
    const suiBalance: string = await this.getSuiBalance(publicKey);
    const availableAmount = new BigNumber(suiBalance)
      .multipliedBy(SUI_DENOMINATOR)
      .minus(totalGasFee)
      .dividedBy(SUI_DENOMINATOR)
      .toString();

    return {
      availableAmount,
      totalGasFee,
    };
  }

  /**
   * @public
   * @method getSuiBalance
   * @description Retrieves the balance of SUI tokens for a wallet.
   * @param {string} publicKey - The public key of the wallet.
   * @return {Promise<string>} A promise that resolves to the balance of SUI tokens.
   */
  public async getSuiBalance(publicKey: string): Promise<string> {
    const balance: CoinBalance = await this.provider.getBalance({ owner: publicKey });
    const totalBalance = new BigNumber(balance.totalBalance);

    return totalBalance.dividedBy(10 ** SUI_DECIMALS).toString();
  }

  /**
   * @public
   * @method getAvailableSuiBalance
   * @description Retrieves the available balance of SUI tokens for a wallet.
   * @param {string} publicKey - The public key of the wallet.
   * @return {Promise<string>} A promise that resolves to the available balance of SUI tokens.
   */
  public async getAvailableSuiBalance(publicKey: string): Promise<string> {
    const currentSuiBalance: string = await this.getSuiBalance(publicKey);
    const suiBalanceWithDecimals = new BigNumber(currentSuiBalance).multipliedBy(10 ** SUI_DECIMALS);
    const availableSuiBalance = suiBalanceWithDecimals.minus(SWAP_GAS_BUDGET);

    if (availableSuiBalance.isLessThanOrEqualTo(0)) {
      return "0";
    }

    return availableSuiBalance.dividedBy(10 ** SUI_DECIMALS).toString();
  }

  /**
   * @public
   * @method getAllCoinAssets
   * @description Retrieves all coin assets associated with a wallet.
   * @param {string} publicKey - The public key of the wallet.
   * @return {Promise<CoinAssetData[]>} A promise that resolves to an array of coin asset data.
   */
  public async getAllCoinAssets(publicKey: string): Promise<CoinAssetData[]> {
    // TODO: Move that to util method to avoid code duplication
    // in `getAllCoinAssets` & `getCoinObjects`, e.g. something like getPaginatedObjects
    const pageCapacity = 50;
    const allObjects: CoinStruct[] = [];
    let nextCursor: string | null | undefined = null;
    let assets: PaginatedCoins = await this.provider.getAllCoins({
      owner: publicKey,
      limit: pageCapacity,
      cursor: nextCursor,
    });

    // fetching and combining part
    while (assets.hasNextPage) {
      const coinObjects: CoinStruct[] = assets.data;
      allObjects.push(...coinObjects);

      nextCursor = assets.nextCursor;
      assets = await this.provider.getAllCoins({
        owner: publicKey,
        limit: pageCapacity,
        cursor: nextCursor,
      });
    }

    // In case user has less tokens than `pageCapacity` (1 page only), we should put them into `allObjects`
    const coinObjects: CoinStruct[] = assets.data;
    allObjects.push(...coinObjects);

    // reducing part
    const coinAssets: CoinAssetData[] = await getCoinsAssetsFromCoinObjects(allObjects, this.coinManager);

    // Converting balances with decimals
    for (const asset of coinAssets) {
      const decimals: number | null = asset.decimals;

      // We don't need to convert balance if it hasn't decimals
      if (decimals === null) {
        continue;
      }

      const bigNumberBalance = new BigNumber(asset.balance);
      asset.balance = bigNumberBalance.dividedBy(10 ** decimals).toString();
    }

    return coinAssets;
  }

  /**
   * Note: this method is using an `UpdatedTransactionBlock`, that is a `TransactionBlock` from
   * the @mysten/sui.js v0.51.2 package.
   *
   * @description Merges all the passed `coinObjects` into one object.
   * @return {object} A transaction block, that contains the coins merge; a destination coin object id, into which all
   * the other coin objects are merged; a transaction result, that is the result of the coins merge.
   */
  public static mergeAllCoinObjects({
    coinObjects,
    txb,
  }: {
    coinObjects: CoinStruct[];
    txb?: UpdatedTransactionBlock;
  }): {
    tx: UpdatedTransactionBlock;
    destinationObjectId: string;
    txRes?: TransactionResult;
  } {
    if (coinObjects.length === 0) {
      throw new Error("[mergeAllCoinObjects] Passed `coinObjects` are empty.");
    }

    const tx = txb ?? new UpdatedTransactionBlock();

    const objectIds = coinObjects.map((obj) => obj.coinObjectId);
    const [destinationObjectId, ...sourceObjectIds] = objectIds;

    if (sourceObjectIds.length === 0) {
      return { tx, destinationObjectId };
    }

    const txRes = tx.mergeCoins(
      tx.object(destinationObjectId),
      sourceObjectIds.map((objId) => tx.object(objId)),
    );

    return { tx, txRes, destinationObjectId };
  }
}
