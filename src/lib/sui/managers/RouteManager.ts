import { CoinStruct } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import BigNumber from "bignumber.js";
import { NoRoutesError } from "../errors/NoRoutesError";
import { CetusSingleton } from "../providers/cetus/cetus";
import { SUI_DENOMINATOR, SWAP_GAS_BUDGET } from "../providers/common";
import { isSuiCoinType } from "../providers/utils/isSuiCoinType";
import { CoinManagerSingleton } from "./coin/CoinManager";
import { BestRouteData, IRouteManager, Provider, Providers, ProvidersToRouteDataMap } from "./types";
import { getFiltredProviders, getRouterMaps, tokenFromIsTokenTo } from "./utils";
import { TryCatchWrapperResult } from "../providers/types";
import { FeeManager } from "./FeeManager";

/**
 * @class RouteManager
 * @implements {IRouteManager}
 * @description Manages routes for token swapping.
 */
export class RouteManager implements IRouteManager {
  private static _instance: RouteManager;
  private poolProviders: Providers;
  private coinManager: CoinManagerSingleton;

  /**
   * @public
   * @method getInstance
   * @description Gets the singleton instance of RouteManager.
   * @param {Providers} [providers] - The pool providers.
   * @param {CoinManagerSingleton} [coinManager] - The coin manager instance.
   * @return {RouteManager} The singleton instance of RouteManager.
   * @throws {Error} Throws an error if providers or coinManager are not provided.
   */
  public static getInstance(providers?: Providers, coinManager?: CoinManagerSingleton): RouteManager {
    if (!RouteManager._instance) {
      if (providers === undefined) {
        throw new Error("[RouteManager] Providers are required in arguments to create RouteManager instance.");
      }

      if (coinManager === undefined) {
        throw new Error("[RouteManager] CoinManager is required in arguments to create RouteManager instance.");
      }

      const instance = new RouteManager(providers, coinManager);
      RouteManager._instance = instance;
    }

    return RouteManager._instance;
  }

  /**
   * @constructor
   * @param {Providers} providers - The pool providers.
   * @param {CoinManagerSingleton} coinManager - The coin manager instance.
   */
  private constructor(providers: Providers, coinManager: CoinManagerSingleton) {
    this.poolProviders = providers;
    this.coinManager = coinManager;
  }

  /**
   * @public
   * @method getBestRouteData
   * @description Gets the best route data for token swapping.
   * @param {Object} options - The options for getting the best route transaction.
   * @param {string} options.tokenFrom - The token to swap from.
   * @param {string} options.tokenTo - The token to swap to.
   * @param {string} options.amount - The amount to swap.
   * @param {number} options.slippagePercentage - The slippage percentage.
   * @param {string} options.signerAddress - The address of the signer.
   * @param {Providers} options.supportedProviders - List of supported providers
   * which would be used in the finding best route data.
   * @return {Promise<BestRouteData>} A promise that resolves to the best route data for token swapping.
   * @throws {Error} Throws an error if there is no path for the specified tokens.
   */
  public async getBestRouteData({
    tokenFrom,
    tokenTo,
    amount,
    slippagePercentage,
    signerAddress,
    supportedProviders,
    useCetusOnChainFallback = false,
  }: {
    tokenFrom: string;
    tokenTo: string;
    amount: string;
    slippagePercentage: number;
    signerAddress: string;
    supportedProviders?: Providers;
    useCetusOnChainFallback?: boolean;
  }): Promise<BestRouteData> {
    if (tokenFromIsTokenTo(tokenFrom, tokenTo)) {
      throw new Error("[RouteManager] getBestRouteTransaction: tokenFrom is equal to tokenTo.");
    }

    const amountAsNumber = Number(amount);
    if (isNaN(amountAsNumber)) {
      throw new Error(`[RouteManager] getBestRouteTransaction: amount ${amount} is invalid.`);
    }

    // Validate coins existance in provider
    const coinsByProviderMap = this.coinManager.getCoinsByProviderMap();

    const filtredProviders = getFiltredProviders({
      tokenFrom,
      tokenTo,
      coinsByProviderMap,
      poolProviders: this.poolProviders,
      supportedProviders,
    });
    console.log(
      "filtredProviders:",
      filtredProviders.map((provider) => provider.providerName),
    );

    let providersByOutputAmountsResultMap: Map<bigint, string>;
    let routesByProviderResultMap: ProvidersToRouteDataMap;
    let outputAmounts: bigint[];

    const { providersByOutputAmountsMap, routesByProviderMap } = await getRouterMaps({
      filtredProviders,
      tokenFrom,
      tokenTo,
      amount,
      signerAddress,
      slippagePercentage,
    });

    providersByOutputAmountsResultMap = providersByOutputAmountsMap;
    routesByProviderResultMap = routesByProviderMap;
    outputAmounts = Array.from(providersByOutputAmountsResultMap.keys());

    const eachOutputAmountIs0: boolean = outputAmounts.every((amount) => amount === BigInt(0));

    /**
     * Tries to find Cetus route separately through graph traversal when Cetus exists in `filteredProviders`,
     * because Cetus initially uses fetching off-chain API for finding route and route params, which works fast,
     * but not reliable (timeouts).
     * By default, we don't allow graph traversal search, because of it's slowness in implementation of Cetus SDK,
     * but in case there's no other way to find the route, we use it as a fallback option.
     * This feature initially designed to support trading on community created pools on Cetus, since in 90% of cases,
     * Cetus off-chain API timeouts the request.
     */
    if (eachOutputAmountIs0) {
      const cetus = filtredProviders.find((provider) => provider.providerName === "Cetus");

      if (cetus === undefined || !useCetusOnChainFallback) {
        throw new NoRoutesError(
          `[RouteManager] There is no paths for coins "${tokenFrom}" and "${tokenTo}" (all outputAmounts = 0)`,
        );
      }

      const cetusInstance = cetus as CetusSingleton;
      const { cetusOutputAmount, providersByOutputAmountsMap, routesByProviderMap } =
        await cetusInstance.getRouteDataWithGraph({
          inputAmount: amount,
          slippagePercentage,
          coinTypeFrom: tokenFrom,
          coinTypeTo: tokenTo,
          // TODO: We might not need to specify signerAddress here, depends on internal Cetus smart-contract structure
          publicKey: signerAddress,
        });

      providersByOutputAmountsResultMap = providersByOutputAmountsMap;
      routesByProviderResultMap = routesByProviderMap;
      outputAmounts = [cetusOutputAmount];
    }

    const maxOutputAmount: bigint = outputAmounts.reduce((max, currentValue) => {
      return currentValue > max ? currentValue : max;
    });
    const providerWithMaxOutputAmount: string | undefined = providersByOutputAmountsResultMap.get(maxOutputAmount);

    // log info >>>
    let stringResult = "{ ";
    providersByOutputAmountsResultMap.forEach((value, key) => (stringResult += `${key}n => ${value}, `));
    stringResult += "}";
    console.log(
      "providersByOutputAmountsResultMap:",
      stringResult + "; maxOutputAmount:",
      maxOutputAmount + "n; providerWithMaxOutputAmount:",
      providerWithMaxOutputAmount,
    );
    // <<< log info

    if (providerWithMaxOutputAmount === undefined) {
      throw new Error(`[Route] Cannot find provider with output amount "${maxOutputAmount}".`);
    }

    const routeData = routesByProviderResultMap.get(providerWithMaxOutputAmount);

    if (routeData === undefined) {
      throw new Error(`[Route] Cannot find route data for provider "${providerWithMaxOutputAmount}".`);
    }

    const route = routeData.route;

    if (route === null) {
      throw new Error(`[Route] Cannot find route for provider "${providerWithMaxOutputAmount}".`);
    }

    const maxOutputProvider = routeData.provider;

    return { maxOutputProvider, maxOutputAmount, route };
  }

  /**
   * @public
   * @method getBestRouteTransaction
   * @description Gets the best route transaction for token swapping.
   * @param {Object} options - The options for getting the best route transaction.
   * @param {string} options.tokenFrom - The token to swap from.
   * @param {string} options.tokenTo - The token to swap to.
   * @param {string} options.amount - The amount to swap.
   * @param {number} options.slippagePercentage - The slippage percentage.
   * @param {string} options.signerAddress - The address of the signer.
   * @param {object} options.fee - The fee in SUI that would be deducted from user's account
   * @return {Promise<{ tx: TransactionBlock, outputAmount: bigint, providerName: string }>} A promise that resolves
   * to the object with transaction block for the swap, calculated output amount and the name of the provider, making
   * the swap.
   * @throws {Error} Throws an error if there is no path for the specified tokens.
   */
  public async getBestRouteTransaction({
    tokenFrom,
    tokenTo,
    amount,
    slippagePercentage,
    signerAddress,
    fee,
  }: {
    tokenFrom: string;
    tokenTo: string;
    amount: string;
    slippagePercentage: number;
    signerAddress: string;
    fee?: {
      feeAmount: string;
      feeCollectorAddress: string;
      tokenFromCoinObjects?: CoinStruct[];
      tokenFromDecimals?: number;
    };
  }): Promise<{ tx: TransactionBlock; outputAmount: bigint; providerName: string }> {
    // Note: this works only for sui
    const amountInCludingFees =
      fee && isSuiCoinType(tokenFrom)
        ? new BigNumber(amount).minus(new BigNumber(fee.feeAmount).dividedBy(SUI_DENOMINATOR)).toString()
        : amount;

    const { maxOutputProvider, route, maxOutputAmount } = await this.getBestRouteData({
      tokenFrom,
      tokenTo,
      amount: amountInCludingFees,
      slippagePercentage,
      signerAddress,
    });

    const transaction = await maxOutputProvider.getSwapTransaction({
      route,
      publicKey: signerAddress,
      slippagePercentage,
    });

    // This is the limitation because some of the providers
    // doesn't set/calculate gas budger for their transactions properly.
    // We can do the simulation on our side, but it will slowdown the swap
    transaction.setGasBudget(SWAP_GAS_BUDGET);

    // TODO: Remove that into the FeeManager
    if (fee) {
      const { feeAmount, feeCollectorAddress, tokenFromCoinObjects, tokenFromDecimals } = fee;

      if (isSuiCoinType(tokenFrom)) {
        const { tx } = await FeeManager.getFeeInSuiTransaction({
          transaction,
          fee: {
            feeAmountInMIST: feeAmount,
            feeCollectorAddress,
          },
        });
        return { tx, outputAmount: maxOutputAmount, providerName: maxOutputProvider.providerName };
        // This else is not expected to work since it's impossible to split and merge the same coin
      } else if (!isSuiCoinType(tokenFrom) && tokenFromCoinObjects?.length && typeof tokenFromDecimals === "number") {
        const { tx } = await FeeManager.getFeeInCoinTransaction({
          transaction,
          fee: {
            feeAmount: feeAmount,
            feeCollectorAddress,
            allCoinObjectsList: tokenFromCoinObjects,
          },
        });
        return { tx, outputAmount: maxOutputAmount, providerName: maxOutputProvider.providerName };
      } else {
        console.warn(
          "[getBestRouteTransaction] unexpected behaviour: params for fees object is not correctly provided",
        );

        throw new Error("Unexpected params getBestRouteTransaction");
      }
    }

    return { tx: transaction, outputAmount: maxOutputAmount, providerName: maxOutputProvider.providerName };
  }

  /**
   * @public
   * @method getBestRouteTransactionForDCA
   * @description Gets the best route transaction for token swapping for DCA.
   * @param {Object} options - The options for getting the best route transaction.
   * @param {string} options.tokenFrom - The token to swap from.
   * @param {string} options.tokenTo - The token to swap to.
   * @param {string} options.amount - The amount to swap.
   * @param {number} options.slippagePercentage - The slippage percentage.
   * @param {string} options.signerAddress - The address of the signer.
   * @param {Providers} options.supportedProviders - List of supported providers
   *
   * @return {Promise<TransactionBlock>} A promise that resolves to the transaction block for the swap.
   * @throws {Error} Throws an error if there is no path for the specified tokens.
   */
  public async getBestRouteTransactionForDCA({
    tokenFrom,
    tokenTo,
    amount,
    slippagePercentage,
    signerAddress,
    dcaObjectId,
    dcaTradeGasCost,
    supportedProviders,
  }: {
    tokenFrom: string;
    tokenTo: string;
    amount: string;
    slippagePercentage: number;
    signerAddress: string;
    dcaObjectId: string;
    dcaTradeGasCost: number;
    supportedProviders?: Providers;
  }): Promise<TransactionBlock> {
    const { maxOutputProvider, route } = await this.getBestRouteData({
      tokenFrom,
      tokenTo,
      amount,
      slippagePercentage,
      signerAddress,
      supportedProviders,
    });

    const transaction = await maxOutputProvider.getSwapTransactionDoctored({
      route,
      publicKey: signerAddress,
      slippagePercentage,
    });

    const doctoredForDCATransactionBlock = maxOutputProvider.buildDcaTxBlockAdapter(
      transaction,
      tokenFrom,
      tokenTo,
      dcaObjectId,
      dcaTradeGasCost,
    );

    // TODO IMPORTANT: CHECK THAT ITS OK, COMMENTED FOR NOW (check that we do not need set gas budget for tx)

    // This is the limitation because some of the providers
    // doesn't set/calculate gas budger for their transactions properly.
    // We can do the simulation on our side, but it will slowdown the swap
    // transaction.setGasBudget(SWAP_GAS_BUDGET);

    return doctoredForDCATransactionBlock;
  }

  /**
   * @public
   * @method getBestRouteTransactionForDCAByRouteData
   * @description Gets the best route transaction for token swapping for DCA
   * based on the provided `route` and `maxOutputProvider`.
   */
  public async getBestRouteTransactionForDCAByRouteData({
    tokenFrom,
    tokenTo,
    slippagePercentage,
    signerAddress,
    dcaObjectId,
    dcaTradeGasCost,
    route,
    maxOutputProvider,
  }: {
    tokenFrom: string;
    tokenTo: string;
    slippagePercentage: number;
    signerAddress: string;
    dcaObjectId: string;
    dcaTradeGasCost: number;
    route: TryCatchWrapperResult;
    maxOutputProvider: Provider;
  }): Promise<TransactionBlock> {
    const transaction = await maxOutputProvider.getSwapTransactionDoctored({
      route,
      publicKey: signerAddress,
      slippagePercentage,
    });

    const doctoredForDCATransactionBlock = maxOutputProvider.buildDcaTxBlockAdapter(
      transaction,
      tokenFrom,
      tokenTo,
      dcaObjectId,
      dcaTradeGasCost,
    );

    // TODO: Check that we do not need to set gas budget limit for tx

    return doctoredForDCATransactionBlock;
  }
}
