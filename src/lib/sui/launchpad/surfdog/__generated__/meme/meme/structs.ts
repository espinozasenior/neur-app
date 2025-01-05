import { Balance } from "../../_dependencies/source/0x2/balance/structs";
import { UID } from "../../_dependencies/source/0x2/object/structs";
import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
} from "../../_framework/reified";
import { FieldsWithTypes, composeSuiType, compressSuiType } from "../../_framework/util";
import { bcs, fromB64 } from "@mysten/bcs";
import { SuiClient, SuiParsedData } from "@mysten/sui.js/client";

/* ============================== MemCoinOwnerCap =============================== */

export function isMemCoinOwnerCap(type: string): boolean {
  type = compressSuiType(type);
  return type === "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::MemCoinOwnerCap";
}

export interface MemCoinOwnerCapFields {
  id: ToField<UID>;
}

export type MemCoinOwnerCapReified = Reified<MemCoinOwnerCap, MemCoinOwnerCapFields>;

export class MemCoinOwnerCap implements StructClass {
  static readonly $typeName =
    "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::MemCoinOwnerCap";
  static readonly $numTypeParams = 0;

  readonly $typeName = MemCoinOwnerCap.$typeName;

  readonly $fullTypeName: "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::MemCoinOwnerCap";

  readonly $typeArgs: [];

  readonly id: ToField<UID>;

  private constructor(typeArgs: [], fields: MemCoinOwnerCapFields) {
    this.$fullTypeName = composeSuiType(
      MemCoinOwnerCap.$typeName,
      ...typeArgs,
    ) as "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::MemCoinOwnerCap";
    this.$typeArgs = typeArgs;

    this.id = fields.id;
  }

  static reified(): MemCoinOwnerCapReified {
    return {
      typeName: MemCoinOwnerCap.$typeName,
      fullTypeName: composeSuiType(
        MemCoinOwnerCap.$typeName,
        ...[],
      ) as "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::MemCoinOwnerCap",
      typeArgs: [] as [],
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => MemCoinOwnerCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => MemCoinOwnerCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => MemCoinOwnerCap.fromBcs(data),
      bcs: MemCoinOwnerCap.bcs,
      fromJSONField: (field: any) => MemCoinOwnerCap.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => MemCoinOwnerCap.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => MemCoinOwnerCap.fromSuiParsedData(content),
      fetch: async (client: SuiClient, id: string) => MemCoinOwnerCap.fetch(client, id),
      new: (fields: MemCoinOwnerCapFields) => {
        return new MemCoinOwnerCap([], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return MemCoinOwnerCap.reified();
  }

  static phantom(): PhantomReified<ToTypeStr<MemCoinOwnerCap>> {
    return phantom(MemCoinOwnerCap.reified());
  }

  static get p() {
    return MemCoinOwnerCap.phantom();
  }

  static get bcs() {
    return bcs.struct("MemCoinOwnerCap", {
      id: UID.bcs,
    });
  }

  static fromFields(fields: Record<string, any>): MemCoinOwnerCap {
    return MemCoinOwnerCap.reified().new({ id: decodeFromFields(UID.reified(), fields.id) });
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): MemCoinOwnerCap {
    if (!isMemCoinOwnerCap(item.type)) {
      throw new Error("not a MemCoinOwnerCap type");
    }

    return MemCoinOwnerCap.reified().new({ id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id) });
  }

  static fromBcs(data: Uint8Array): MemCoinOwnerCap {
    return MemCoinOwnerCap.fromFields(MemCoinOwnerCap.bcs.parse(data));
  }

  toJSONField() {
    return {
      id: this.id,
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField(field: any): MemCoinOwnerCap {
    return MemCoinOwnerCap.reified().new({ id: decodeFromJSONField(UID.reified(), field.id) });
  }

  static fromJSON(json: Record<string, any>): MemCoinOwnerCap {
    if (json.$typeName !== MemCoinOwnerCap.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }

    return MemCoinOwnerCap.fromJSONField(json);
  }

  static fromSuiParsedData(content: SuiParsedData): MemCoinOwnerCap {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isMemCoinOwnerCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a MemCoinOwnerCap object`);
    }
    return MemCoinOwnerCap.fromFieldsWithTypes(content);
  }

  static async fetch(client: SuiClient, id: string): Promise<MemCoinOwnerCap> {
    const res = await client.getObject({
      id,
      options: {
        showBcs: true,
      },
    });
    if (res.error) {
      throw new Error(`error fetching MemCoinOwnerCap object at id ${id}: ${res.error.code}`);
    }
    if (res.data?.bcs?.dataType !== "moveObject" || !isMemCoinOwnerCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a MemCoinOwnerCap object`);
    }

    return MemCoinOwnerCap.fromBcs(fromB64(res.data.bcs.bcsBytes));
  }
}

/* ============================== State =============================== */

export function isState(type: string): boolean {
  type = compressSuiType(type);
  return type.startsWith("0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::State<");
}

export interface StateFields<T extends PhantomTypeArgument> {
  id: ToField<UID>;
  start: ToField<"u64">;
  end: ToField<"u64">;
  nextTick: ToField<"u64">;
  allTickets: ToField<"u64">;
  wonTickets: ToField<"u64">;
  ticketPrice: ToField<"u64">;
  tokensPerTicket: ToField<"u64">;
  balance: ToField<Balance<T>>;
}

export type StateReified<T extends PhantomTypeArgument> = Reified<State<T>, StateFields<T>>;

export class State<T extends PhantomTypeArgument> implements StructClass {
  static readonly $typeName = "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::State";
  static readonly $numTypeParams = 1;

  readonly $typeName = State.$typeName;

  readonly $fullTypeName: `0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::State<${PhantomToTypeStr<T>}>`;

  readonly $typeArgs: [PhantomToTypeStr<T>];

  readonly id: ToField<UID>;
  readonly start: ToField<"u64">;
  readonly end: ToField<"u64">;
  readonly nextTick: ToField<"u64">;
  readonly allTickets: ToField<"u64">;
  readonly wonTickets: ToField<"u64">;
  readonly ticketPrice: ToField<"u64">;
  readonly tokensPerTicket: ToField<"u64">;
  readonly balance: ToField<Balance<T>>;

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: StateFields<T>) {
    this.$fullTypeName = composeSuiType(
      State.$typeName,
      ...typeArgs,
    ) as `0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::State<${PhantomToTypeStr<T>}>`;
    this.$typeArgs = typeArgs;

    this.id = fields.id;
    this.start = fields.start;
    this.end = fields.end;
    this.nextTick = fields.nextTick;
    this.allTickets = fields.allTickets;
    this.wonTickets = fields.wonTickets;
    this.ticketPrice = fields.ticketPrice;
    this.tokensPerTicket = fields.tokensPerTicket;
    this.balance = fields.balance;
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(T: T): StateReified<ToPhantomTypeArgument<T>> {
    return {
      typeName: State.$typeName,
      fullTypeName: composeSuiType(
        State.$typeName,
        ...[extractType(T)],
      ) as `0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::State<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => State.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => State.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => State.fromBcs(T, data),
      bcs: State.bcs,
      fromJSONField: (field: any) => State.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => State.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => State.fromSuiParsedData(T, content),
      fetch: async (client: SuiClient, id: string) => State.fetch(client, T, id),
      new: (fields: StateFields<ToPhantomTypeArgument<T>>) => {
        return new State([extractType(T)], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return State.reified;
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<State<ToPhantomTypeArgument<T>>>> {
    return phantom(State.reified(T));
  }

  static get p() {
    return State.phantom;
  }

  static get bcs() {
    return bcs.struct("State", {
      id: UID.bcs,
      start: bcs.u64(),
      end: bcs.u64(),
      next_tick: bcs.u64(),
      all_tickets: bcs.u64(),
      won_tickets: bcs.u64(),
      ticket_price: bcs.u64(),
      tokens_per_ticket: bcs.u64(),
      balance: Balance.bcs,
    });
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): State<ToPhantomTypeArgument<T>> {
    return State.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      start: decodeFromFields("u64", fields.start),
      end: decodeFromFields("u64", fields.end),
      nextTick: decodeFromFields("u64", fields.next_tick),
      allTickets: decodeFromFields("u64", fields.all_tickets),
      wonTickets: decodeFromFields("u64", fields.won_tickets),
      ticketPrice: decodeFromFields("u64", fields.ticket_price),
      tokensPerTicket: decodeFromFields("u64", fields.tokens_per_ticket),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    });
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): State<ToPhantomTypeArgument<T>> {
    if (!isState(item.type)) {
      throw new Error("not a State type");
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg]);

    return State.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      start: decodeFromFieldsWithTypes("u64", item.fields.start),
      end: decodeFromFieldsWithTypes("u64", item.fields.end),
      nextTick: decodeFromFieldsWithTypes("u64", item.fields.next_tick),
      allTickets: decodeFromFieldsWithTypes("u64", item.fields.all_tickets),
      wonTickets: decodeFromFieldsWithTypes("u64", item.fields.won_tickets),
      ticketPrice: decodeFromFieldsWithTypes("u64", item.fields.ticket_price),
      tokensPerTicket: decodeFromFieldsWithTypes("u64", item.fields.tokens_per_ticket),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    });
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): State<ToPhantomTypeArgument<T>> {
    return State.fromFields(typeArg, State.bcs.parse(data));
  }

  toJSONField() {
    return {
      id: this.id,
      start: this.start.toString(),
      end: this.end.toString(),
      nextTick: this.nextTick.toString(),
      allTickets: this.allTickets.toString(),
      wonTickets: this.wonTickets.toString(),
      ticketPrice: this.ticketPrice.toString(),
      tokensPerTicket: this.tokensPerTicket.toString(),
      balance: this.balance.toJSONField(),
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): State<ToPhantomTypeArgument<T>> {
    return State.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      start: decodeFromJSONField("u64", field.start),
      end: decodeFromJSONField("u64", field.end),
      nextTick: decodeFromJSONField("u64", field.nextTick),
      allTickets: decodeFromJSONField("u64", field.allTickets),
      wonTickets: decodeFromJSONField("u64", field.wonTickets),
      ticketPrice: decodeFromJSONField("u64", field.ticketPrice),
      tokensPerTicket: decodeFromJSONField("u64", field.tokensPerTicket),
      balance: decodeFromJSONField(Balance.reified(typeArg), field.balance),
    });
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): State<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== State.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }
    assertReifiedTypeArgsMatch(composeSuiType(State.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg]);

    return State.fromJSONField(typeArg, json);
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): State<ToPhantomTypeArgument<T>> {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isState(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a State object`);
    }
    return State.fromFieldsWithTypes(typeArg, content);
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T,
    id: string,
  ): Promise<State<ToPhantomTypeArgument<T>>> {
    const res = await client.getObject({
      id,
      options: {
        showBcs: true,
      },
    });
    if (res.error) {
      throw new Error(`error fetching State object at id ${id}: ${res.error.code}`);
    }
    if (res.data?.bcs?.dataType !== "moveObject" || !isState(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a State object`);
    }

    return State.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes));
  }
}

/* ============================== UserState =============================== */

export function isUserState(type: string): boolean {
  type = compressSuiType(type);
  return type === "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::UserState";
}

export interface UserStateFields {
  id: ToField<UID>;
  wonTickets: ToField<"u64">;
  allTickets: ToField<"u64">;
}

export type UserStateReified = Reified<UserState, UserStateFields>;

export class UserState implements StructClass {
  static readonly $typeName = "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::UserState";
  static readonly $numTypeParams = 0;

  readonly $typeName = UserState.$typeName;

  readonly $fullTypeName: "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::UserState";

  readonly $typeArgs: [];

  readonly id: ToField<UID>;
  readonly wonTickets: ToField<"u64">;
  readonly allTickets: ToField<"u64">;

  private constructor(typeArgs: [], fields: UserStateFields) {
    this.$fullTypeName = composeSuiType(
      UserState.$typeName,
      ...typeArgs,
    ) as "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::UserState";
    this.$typeArgs = typeArgs;

    this.id = fields.id;
    this.wonTickets = fields.wonTickets;
    this.allTickets = fields.allTickets;
  }

  static reified(): UserStateReified {
    return {
      typeName: UserState.$typeName,
      fullTypeName: composeSuiType(
        UserState.$typeName,
        ...[],
      ) as "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::meme::UserState",
      typeArgs: [] as [],
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UserState.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UserState.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UserState.fromBcs(data),
      bcs: UserState.bcs,
      fromJSONField: (field: any) => UserState.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UserState.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UserState.fromSuiParsedData(content),
      fetch: async (client: SuiClient, id: string) => UserState.fetch(client, id),
      new: (fields: UserStateFields) => {
        return new UserState([], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return UserState.reified();
  }

  static phantom(): PhantomReified<ToTypeStr<UserState>> {
    return phantom(UserState.reified());
  }

  static get p() {
    return UserState.phantom();
  }

  static get bcs() {
    return bcs.struct("UserState", {
      id: UID.bcs,
      won_tickets: bcs.u64(),
      all_tickets: bcs.u64(),
    });
  }

  static fromFields(fields: Record<string, any>): UserState {
    return UserState.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      wonTickets: decodeFromFields("u64", fields.won_tickets),
      allTickets: decodeFromFields("u64", fields.all_tickets),
    });
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UserState {
    if (!isUserState(item.type)) {
      throw new Error("not a UserState type");
    }

    return UserState.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      wonTickets: decodeFromFieldsWithTypes("u64", item.fields.won_tickets),
      allTickets: decodeFromFieldsWithTypes("u64", item.fields.all_tickets),
    });
  }

  static fromBcs(data: Uint8Array): UserState {
    return UserState.fromFields(UserState.bcs.parse(data));
  }

  toJSONField() {
    return {
      id: this.id,
      wonTickets: this.wonTickets.toString(),
      allTickets: this.allTickets.toString(),
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField(field: any): UserState {
    return UserState.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      wonTickets: decodeFromJSONField("u64", field.wonTickets),
      allTickets: decodeFromJSONField("u64", field.allTickets),
    });
  }

  static fromJSON(json: Record<string, any>): UserState {
    if (json.$typeName !== UserState.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }

    return UserState.fromJSONField(json);
  }

  static fromSuiParsedData(content: SuiParsedData): UserState {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isUserState(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UserState object`);
    }
    return UserState.fromFieldsWithTypes(content);
  }

  static async fetch(client: SuiClient, id: string): Promise<UserState> {
    const res = await client.getObject({
      id,
      options: {
        showBcs: true,
      },
    });
    if (res.error) {
      throw new Error(`error fetching UserState object at id ${id}: ${res.error.code}`);
    }
    if (res.data?.bcs?.dataType !== "moveObject" || !isUserState(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a UserState object`);
    }

    return UserState.fromBcs(fromB64(res.data.bcs.bcsBytes));
  }
}
