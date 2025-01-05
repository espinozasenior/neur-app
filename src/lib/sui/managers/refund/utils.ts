/**
 * Converts a hexadecimal string to a Uint8Array.
 *
 * @param {string} hexString - The hexadecimal string to convert.
 * @return {Uint8Array} - The resulting byte array.
 */
export function hexStringToByteArray(hexString: string): Uint8Array {
  // Remove the "0x" prefix if present
  const normalizedHexString = hexString.startsWith("0x") ? hexString.substring(2) : hexString;

  const byteArray = new Uint8Array(normalizedHexString.length / 2);
  for (let i = 0; i < normalizedHexString.length; i += 2) {
    byteArray[i / 2] = parseInt(normalizedHexString.substring(i, i + 2), 16);
  }
  return byteArray;
}

export type DecodedAmount = { Some?: string } | { None?: boolean };

export type BoostedClaimCapType = {
  data: {
    objectId: string;
    content: {
      dataType: string;
      type: string;
      hasPublicTransfer: boolean;
      fields: {
        id: { id: string };
        new_address: string;
      };
    };
  };
};

export enum RefundPoolPhase {
  AddressAddition = 1, // Phase for adding addresses
  Funding = 2, // Phase for funding
  Claim = 3, // Phase for claiming refunds
  Reclaim = 4, // Phase for reclaiming refunds
}

// eslint-disable-next-line require-jsdoc
export function isBoostedClaimCap(obj: unknown): obj is BoostedClaimCapType {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  if (!("data" in obj) || !obj.data || typeof obj.data !== "object") {
    return false;
  }

  const objectData = obj.data;

  if (!("objectId" in objectData) || typeof objectData.objectId !== "string") {
    return false;
  }

  if (!("content" in objectData) || objectData.content === null || typeof objectData.content !== "object") {
    return false;
  }

  const content = objectData.content;

  return (
    "dataType" in content &&
    "type" in content &&
    "fields" in content &&
    typeof content.fields === "object" &&
    content.fields !== null &&
    "id" in content.fields &&
    typeof content.dataType === "string" &&
    typeof content.type === "string" &&
    typeof content.fields.id === "object" &&
    content.fields.id !== null &&
    "id" in content.fields.id &&
    typeof content.fields.id.id === "string" &&
    "new_address" in content.fields &&
    typeof content.fields.new_address === "string"
  );
}
