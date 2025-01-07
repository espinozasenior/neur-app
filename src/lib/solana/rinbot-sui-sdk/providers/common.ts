import { EventId, PaginatedEvents, SuiClient, SuiEvent } from "@mysten/sui.js/client";
import { SUI_DECIMALS } from "@mysten/sui.js/utils";
import { ExitHandlerOptions } from "./types";

export const SUI_DENOMINATOR = 10 ** SUI_DECIMALS;
export const SHORT_SUI_COIN_TYPE = "0x2::sui::SUI";
export const LONG_SUI_COIN_TYPE = "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI";
export const SWAP_GAS_BUDGET = 50_000_000;
export const MAX_BATCH_OBJECTS_PER_GET_OBJECT_REQUEST = 50;
export const MAX_BATCH_EVENTS_PER_QUERY_EVENTS_REQUEST = 50;
export const TOKEN_ADDRESS_BASE_REGEX = /0x[0-9a-fA-F]+::[0-9a-zA-z_-]+::[0-9a-zA-z_-]+/;

export const exitHandler = (options: ExitHandlerOptions) => {
  if (options.cleanup) {
    console.log(`[EXIT HANDLER] ${options.providerName} cache cleanup.`);
    clearInterval(options.intervalId);

    // TODO: Add event listeners removal for window
    // When the application restarts multiple times, event listeners remain active after each restart,
    // accumulating for the same events, leading to overflow and eventual application crash. To prevent this,
    // all event listeners for the process are cleared before each application exit.
    if (typeof process !== "undefined" && typeof process === "object") {
      process.removeAllListeners();
    }
  }
  if (options.exit) process.exit();
};

export const exitHandlerWrapper = (options: ExitHandlerOptions) => {
  if (typeof window !== "undefined" && typeof window === "object") {
    window.addEventListener("beforeunload", exitHandler.bind(null, { cleanup: true, ...options }));
  }
  if (typeof process !== "undefined" && typeof process === "object") {
    process.on("exit", exitHandler.bind(null, { cleanup: true, ...options }));
  }
};

if (typeof process !== "undefined" && typeof process === "object") {
  process.on("SIGINT", () => exitHandler({ exit: true }));
  process.on("SIGUSR1", () => exitHandler({ exit: true }));
  process.on("SIGUSR2", () => exitHandler({ exit: true }));
  process.on("SIGUSR2", () => exitHandler({ exit: true }));
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err.stack);
    exitHandler({ exit: true });
  });
}

/**
 * Retrieves all user events associated with the specified public key.
 *
 * @param {SuiClient} provider - The SuiClient provider.
 * @param {string} publicKey - The public key for which to retrieve user events.
 * @return {Promise<SuiEvent[]>} A promise that resolves to an array of user events.
 */
export async function getAllUserEvents(provider: SuiClient, publicKey: string): Promise<SuiEvent[]> {
  const pageCapacity = MAX_BATCH_EVENTS_PER_QUERY_EVENTS_REQUEST;
  const allEvents: SuiEvent[] = [];
  let nextCursor: EventId | undefined | null = null;
  let events: PaginatedEvents = await provider.queryEvents({
    query: { Sender: publicKey },
    limit: pageCapacity,
    cursor: nextCursor,
  });

  // Fetching and combining part
  while (events.hasNextPage) {
    const userEvents: SuiEvent[] = events.data;
    allEvents.push(...userEvents);

    nextCursor = events.nextCursor;
    events = await provider.queryEvents({
      query: { Sender: publicKey },
      limit: pageCapacity,
      cursor: nextCursor,
    });
  }

  const userEvents: SuiEvent[] = events.data;
  allEvents.push(...userEvents);

  return allEvents;
}
