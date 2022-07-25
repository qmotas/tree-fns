import { walk } from "./walk.ts";
import { FindNodeResult, TreeNode } from "./types.ts";

export const findNode = <T>(
  tree: TreeNode<T>,
  test: (node: TreeNode<T>) => boolean,
): FindNodeResult<T> | undefined => {
  let foundNode: FindNodeResult<T> | undefined;

  walk(tree, (node, location) => {
    if (test(node)) {
      foundNode = { ...node, location };
      return false;
    }
  });

  return foundNode;
};

export const findNodeById = <T>(
  tree: TreeNode<T>,
  id: string,
): FindNodeResult<T> | undefined => {
  return findNode(tree, (node) => node.id === id);
};
