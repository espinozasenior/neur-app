import * as meme from "./meme/structs";
import * as surf from "./surf/structs";
import { StructClassLoader } from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) {
  loader.register(meme.MemCoinOwnerCap);
  loader.register(meme.State);
  loader.register(meme.UserState);
  loader.register(surf.SURF);
}
