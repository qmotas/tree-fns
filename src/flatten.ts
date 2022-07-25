import { FlattenedNode, TreeNode } from "./types.ts";
import { walk } from "./walk.ts";

export const flatten = <T>(
  tree: TreeNode<T>,
): Array<FlattenedNode<T>> => {
  const flattened: Array<FlattenedNode<T>> = [];
  walk(tree, (node, location) => {
    flattened.push({ ...node, location });
  });
  return flattened;
};
