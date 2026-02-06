import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";

export type FuseSearchable = Record<string, any>;

export function makeFuse<T extends FuseSearchable>(
  items: T[],
  keys: Array<string>,
  opts?: IFuseOptions<T>,
) {
  return new Fuse(items, {
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys,
    ...opts,
  });
}
