import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from "../../_framework/reified";
import { FieldsWithTypes, composeSuiType, compressSuiType } from "../../_framework/util";
import { bcs, fromB64 } from "@mysten/bcs";
import { SuiClient, SuiParsedData } from "@mysten/sui.js/client";

/* ============================== SURF =============================== */

export function isSURF(type: string): boolean {
  type = compressSuiType(type);
  return type === "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::surf::SURF";
}

export interface SURFFields {
  dummyField: ToField<"bool">;
}

export type SURFReified = Reified<SURF, SURFFields>;

export class SURF implements StructClass {
  static readonly $typeName = "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::surf::SURF";
  static readonly $numTypeParams = 0;

  readonly $typeName = SURF.$typeName;

  readonly $fullTypeName: "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::surf::SURF";

  readonly $typeArgs: [];

  readonly dummyField: ToField<"bool">;

  private constructor(typeArgs: [], fields: SURFFields) {
    this.$fullTypeName = composeSuiType(
      SURF.$typeName,
      ...typeArgs,
    ) as "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::surf::SURF";
    this.$typeArgs = typeArgs;

    this.dummyField = fields.dummyField;
  }

  static reified(): SURFReified {
    return {
      typeName: SURF.$typeName,
      fullTypeName: composeSuiType(
        SURF.$typeName,
        ...[],
      ) as "0xd06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a::surf::SURF",
      typeArgs: [] as [],
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => SURF.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SURF.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => SURF.fromBcs(data),
      bcs: SURF.bcs,
      fromJSONField: (field: any) => SURF.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => SURF.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => SURF.fromSuiParsedData(content),
      fetch: async (client: SuiClient, id: string) => SURF.fetch(client, id),
      new: (fields: SURFFields) => {
        return new SURF([], fields);
      },
      kind: "StructClassReified",
    };
  }

  static get r() {
    return SURF.reified();
  }

  static phantom(): PhantomReified<ToTypeStr<SURF>> {
    return phantom(SURF.reified());
  }

  static get p() {
    return SURF.phantom();
  }

  static get bcs() {
    return bcs.struct("SURF", {
      dummy_field: bcs.bool(),
    });
  }

  static fromFields(fields: Record<string, any>): SURF {
    return SURF.reified().new({ dummyField: decodeFromFields("bool", fields.dummy_field) });
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): SURF {
    if (!isSURF(item.type)) {
      throw new Error("not a SURF type");
    }

    return SURF.reified().new({ dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) });
  }

  static fromBcs(data: Uint8Array): SURF {
    return SURF.fromFields(SURF.bcs.parse(data));
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    };
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      ...this.toJSONField(),
    };
  }

  static fromJSONField(field: any): SURF {
    return SURF.reified().new({ dummyField: decodeFromJSONField("bool", field.dummyField) });
  }

  static fromJSON(json: Record<string, any>): SURF {
    if (json.$typeName !== SURF.$typeName) {
      throw new Error("not a WithTwoGenerics json object");
    }

    return SURF.fromJSONField(json);
  }

  static fromSuiParsedData(content: SuiParsedData): SURF {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isSURF(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a SURF object`);
    }
    return SURF.fromFieldsWithTypes(content);
  }

  static async fetch(client: SuiClient, id: string): Promise<SURF> {
    const res = await client.getObject({
      id,
      options: {
        showBcs: true,
      },
    });
    if (res.error) {
      throw new Error(`error fetching SURF object at id ${id}: ${res.error.code}`);
    }
    if (res.data?.bcs?.dataType !== "moveObject" || !isSURF(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a SURF object`);
    }

    return SURF.fromBcs(fromB64(res.data.bcs.bcsBytes));
  }
}
