import { walk } from "./walk.ts";
import { NodeWithLocation, TreeNode } from "./types.ts";

type FindNodeResult<T> = NodeWithLocation<T> | undefined;

export const findNode = <T>(
  tree: TreeNode<T>,
  test: (node: TreeNode<T>) => boolean,
): FindNodeResult<T> | undefined => {
  let foundNode: FindNodeResult<T>;

  walk(tree, (node, location) => {
    if (test(node)) {
      foundNode = [node, location];
      return false;
    }
  });

  return foundNode;
};

export const findNodeById = <T>(
  tree: TreeNode<T>,
  id: string,
): FindNodeResult<T> => {
  return findNode(tree, (node) => node.id === id);
};
