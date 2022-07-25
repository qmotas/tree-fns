import { map } from "./map.ts";
import { TreeNode } from "./types.ts";

export const copy = <T>(
  tree: TreeNode<T>,
): TreeNode<T> => {
  return map(tree, (n) => n);
};
