import { UpdateCoinsCacheHandler, UpdatedCoinsCache } from "../managers/types";

/**
 * @class EventEmitter
 * @description A simple event emitter implementation.
 */
export class EventEmitter {
  private events: Record<string, UpdateCoinsCacheHandler[]> = {};
  private buffer: { eventName: string; data: UpdatedCoinsCache }[] = [];

  /**
   * @public
   * @method on
   * @description Adds a callback function to an event.
   * @param {string} eventName - The name of the event.
   * @param {UpdateCoinsCacheHandler} callback - The callback function to be executed when the event is emitted.
   */
  on(eventName: string, callback: UpdateCoinsCacheHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  /**
   * @public
   * @method emit
   * @description Emits an event and executes all registered callback functions.
   * @param {string} eventName - The name of the event to be emitted.
   * @param {UpdatedCoinsCache} arg - The data to be passed to the event handlers.
   */
  emit(eventName: string, arg: UpdatedCoinsCache) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(arg));
    }
  }

  /**
   * @public
   * @method bufferEvent
   * @description Buffers an event to be emitted later.
   * @param {string} eventName - The name of the event to be buffered.
   * @param {UpdatedCoinsCache} data - The data associated with the event.
   */
  bufferEvent(eventName: string, data: UpdatedCoinsCache) {
    this.buffer.push({ eventName, data });
  }

  /**
   * @public
   * @method flushBuffer
   * @description Flushes the buffered events and emits them.
   */
  flushBuffer() {
    this.buffer.forEach(({ eventName, data }) => this.emit(eventName, data));
    this.buffer = [];
  }

  /**
   * @public
   * @method getEvents
   * @description Returns the record of events and their corresponding handlers.
   * @return {Record<string, UpdateCoinsCacheHandler[]>} The record of events and handlers.
   */
  public getEvents() {
    return this.events;
  }

  /**
   * @public
   * @method getBuffer
   * @description Returns the buffer containing buffered events.
   * @return {{ eventName: string, data: UpdatedCoinsCache }[]} The buffer containing buffered events.
   */
  public getBuffer() {
    return this.buffer;
  }
}
