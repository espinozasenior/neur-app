import * as package_1 from "../_dependencies/source/0x1/init";
import * as package_2 from "../_dependencies/source/0x2/init";
import * as package_d06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a from "../meme/init";
import { structClassLoaderSource as structClassLoader } from "./loader";

let initialized = false;

export function initLoaderIfNeeded() {
  if (initialized) {
    return;
  }
  initialized = true;

  package_1.registerClasses(structClassLoader);
  package_2.registerClasses(structClassLoader);
  package_d06278ad71b5a4d622f179bd21d163d2efc8aaf14e1750884026f63e3d07ca3a.registerClasses(structClassLoader);
}
