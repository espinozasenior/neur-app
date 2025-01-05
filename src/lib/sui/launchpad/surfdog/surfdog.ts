/* eslint-disable require-jsdoc */
import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_DECIMALS, fromB64 } from "@mysten/sui.js/utils";
import BigNumber from "bignumber.js";
import {
  buy as createBuyTicketTransaction,
  createUserState as createUserStateTransaction,
} from "./__generated__/meme/meme/functions";
import { State, UserState } from "./__generated__/meme/meme/structs";
import { SURF } from "./__generated__/meme/surf/structs";
import { SurfDogConfig } from "./types";

export class SurfdogLaunchpadSingleton {
  private static _instance: SurfdogLaunchpadSingleton;
  private provider: SuiClient;
  private config: SurfDogConfig;
  public static GAS_BUDGET_FOR_BUYING_TICKET = 10_000_000;

  /**
   * Constructs a new instance of the SuiProvider class with the provided SUI provider URL.
   *
   * @private
   * @constructor
   * @param {string} suiProviderUrl - The URL of the SUI provider.
   * @param {SurfDogConfig} [config] - Config for SurfDog
   */
  private constructor(suiProviderUrl: string, config: SurfDogConfig) {
    this.provider = new SuiClient({ url: suiProviderUrl });
    this.config = config;
  }

  /**
   * @public
   * @method getInstance
   * @description Gets the singleton instance of SurfdogLaunchpadSingleton.
   * @param {string} [suiProviderUrl] - Url of SUI provider.
   * @param {SurfDogConfig} [config] - Config for SurfDog
   * @return {SurfdogLaunchpadSingleton} The singleton instance of SurfdogLaunchpadSingleton.
   */
  public static getInstance(suiProviderUrl?: string, config?: SurfDogConfig): SurfdogLaunchpadSingleton {
    if (!SurfdogLaunchpadSingleton._instance) {
      if (suiProviderUrl === undefined) {
        throw new Error(
          "[SurfdogLaunchpadSingleton] SUI provider url is required in arguments to create SurfdogLaunchpad instance.",
        );
      }

      if (config === undefined) {
        throw new Error(
          "[SurfdogLaunchpadSingleton] config is required in arguments to create SurfdogLaunchpad instance.",
        );
      }

      const instance = new SurfdogLaunchpadSingleton(suiProviderUrl, config);
      SurfdogLaunchpadSingleton._instance = instance;
    }

    return SurfdogLaunchpadSingleton._instance;
  }

  public async getUserState(publicKey: string) {
    // TODO: Might be dangeours in case user has more than 50 user states
    const object = await this.provider.getOwnedObjects({
      filter: { StructType: UserState.$typeName },
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
        showStorageRebate: true,
        showBcs: true,
      },
      owner: publicKey,
    });

    if (!(Array.isArray(object.data) && object.data[0] && object.data[0].data && object.data[0].data.bcs)) {
      console.warn(`User ${publicKey} does not have state objects`);

      return null;
    }

    const userStateBcs = object.data[0].data.bcs;

    const isBcsBytesInStateBcs = "bcsBytes" in userStateBcs;
    if (!isBcsBytesInStateBcs) {
      console.error("[SurfdogLaunchpadSingleton.getUserState] bcsBytes does not exist stateBcs", userStateBcs);
      throw new Error("bcsBytes does not exist stateBcs");
    }

    const userState = UserState.fromBcs(fromB64(userStateBcs.bcsBytes));
    const userGameState = {
      allTickets: userState.allTickets,
      id: userState.id,
      wonTickets: userState.wonTickets,
    };

    return userGameState;
  }

  public async getGameState() {
    const object = await this.provider.getObject({
      id: this.config.GAME_ADDRESS,
      options: {
        showBcs: true,
        showContent: true,
      },
    });

    if (!object.data) {
      console.error("[SurfdogLaunchpadSingleton.getGameState] object.data", object.data);
      throw new Error("Failed to fetch game state: object.data is empty");
    }

    const stateBcs = object.data.bcs;
    if (!stateBcs) {
      console.error("[SurfdogLaunchpadSingleton.getGameState] State does not exist bsc", stateBcs);
      throw new Error("State does not exist bsc");
    }

    const isBcsBytesInStateBcs = "bcsBytes" in stateBcs;
    if (!isBcsBytesInStateBcs) {
      console.error("[SurfdogLaunchpadSingleton.getGameState] bcsBytes does not exist stateBcs", stateBcs);
      throw new Error("bcsBytes does not exist stateBcs");
    }

    const globalState = State.fromBcs(State.phantom(SURF.phantom()), fromB64(stateBcs.bcsBytes));
    const globalStateParsed = {
      allTickets: globalState.allTickets,
      startTimestamp: globalState.start,
      ticketPrice: globalState.ticketPrice,
      tokensPerTicket: globalState.tokensPerTicket,
      winningTickets: globalState.wonTickets,
      balanceLeft: globalState.balance.value,
    };

    return globalStateParsed;
  }

  public async createUserState() {
    const tx = new TransactionBlock();

    const userStateTxRes = createUserStateTransaction(tx);

    return { tx, txRes: userStateTxRes };
  }

  public async buyTicket({ ticketPrice, userStateId }: { ticketPrice: string; userStateId: string }) {
    const tx = new TransactionBlock();

    const [coin] = tx.splitCoins(tx.gas, [tx.pure(ticketPrice)]);

    const buyUserTicketTxRes = createBuyTicketTransaction(tx, SURF.$typeName, {
      clock: this.config.CLOCK_ADDRESS,
      state: this.config.GAME_ADDRESS,
      userState: userStateId,
      payment: coin,
    });

    tx.setGasBudget(SurfdogLaunchpadSingleton.GAS_BUDGET_FOR_BUYING_TICKET);

    return { tx, txRes: buyUserTicketTxRes };
  }

  public checkSpinStatusByTx({ tx }: { tx: SuiTransactionBlockResponse }) {
    if (!tx.balanceChanges) {
      console.error("[SurfdogLaunchpadSingleton.checkSpinStatusByTx]", tx);

      throw new Error("No balanceChanges present in spin transaction");
    }

    const surfMoved = tx.balanceChanges.find((a) => a.coinType === SURF.$typeName);
    if (surfMoved) {
      // user has won
      // console.debug("[SurfdogLaunchpadSingleton.checkSpinStatusByTx] user won");
      return true;
    } else {
      // user has lost
      // console.debug("[SurfdogLaunchpadSingleton.checkSpinStatusByTx] user lost");
      return false;
    }
  }

  public getMaxTicketsCount(suiBalance: string, ticketPrice: string) {
    const suiBalanceBN = new BigNumber(suiBalance);
    const ticketPriceBN = new BigNumber(ticketPrice);
    const gasBudgetBN = new BigNumber(SurfdogLaunchpadSingleton.GAS_BUDGET_FOR_BUYING_TICKET).dividedBy(
      10 ** SUI_DECIMALS,
    );

    let ticketsCount = 0;
    let availableSuiBalanceBN = suiBalanceBN;

    while (availableSuiBalanceBN.gte(ticketPriceBN.plus(gasBudgetBN))) {
      ticketsCount = ticketsCount + 1;
      availableSuiBalanceBN = availableSuiBalanceBN.minus(ticketPriceBN.plus(gasBudgetBN));
    }

    return ticketsCount;
  }
}
