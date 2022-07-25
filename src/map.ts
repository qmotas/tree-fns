import { TreeNode } from "./types.ts";

export const map = <T, U>(
  node: TreeNode<T>,
  mapNodeAttributes: (node: TreeNode<T>) => { id: string } & U,
  mapChildren?: (node: TreeNode<T>) => Array<TreeNode<T>>,
): TreeNode<U> => {
  const mappedNode = mapNodeAttributes(node);
  return {
    ...mappedNode,
    children: [
      ...(mapChildren?.(node) ?? node.children)
        .map((childNode) => map(childNode, mapNodeAttributes, mapChildren)),
    ],
  };
};
