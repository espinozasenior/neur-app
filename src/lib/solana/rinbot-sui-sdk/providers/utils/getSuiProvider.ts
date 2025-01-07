import { SuiClient, SuiClientOptions } from "@mysten/sui.js/client";

export const getSuiProvider = (suiProviderOptions: SuiClientOptions) => {
  const provider = new SuiClient(suiProviderOptions);

  return provider;
};
