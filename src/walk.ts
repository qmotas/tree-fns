import { NodeLocation, TreeNode } from "./types.ts";

const doWalk = <T>(
  node: TreeNode<T>,
  visit: (
    node: TreeNode<T>,
    location: NodeLocation,
  ) => void | boolean,
  location: NodeLocation,
): void | boolean => {
  if (visit(node, location) === false) {
    return false;
  }

  for (const [i, childNode] of node.children.entries()) {
    const shouldStop = doWalk(childNode, visit, {
      parentPath: [...location.parentPath, node.id],
      index: i,
    }) === false;

    if (shouldStop) {
      return false;
    }
  }
};

export const walk = <T>(
  tree: TreeNode<T>,
  visit: (node: TreeNode<T>, location: NodeLocation) => void | boolean,
) => {
  doWalk(tree, visit, {
    parentPath: [],
    index: 0,
  });
};
