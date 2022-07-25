import { findNodeById } from "./findNode.ts";
import { map } from "./map.ts";
import { TreeNode } from "./types.ts";

export const addNode = <T>(
  tree: TreeNode<T>,
  nodeToBeAdded: TreeNode<T>,
  dest: {
    parentId: string;
    index?: number;
  },
): TreeNode<T> => {
  if (nodeToBeAdded.id === dest.parentId) {
    throw new Error(
      "The id of node to be added must not be same as destination node's.",
    );
  }

  if (findNodeById(tree, nodeToBeAdded.id)) {
    throw new Error("The id of node to be added must be unique.");
  }

  const targetAddedTree = map(tree, (node) => node, (node) => {
    if (node.id !== dest.parentId) {
      return node.children;
    }

    const destIndex = dest.index ?? node.children.length;

    return [
      ...node.children.slice(0, destIndex),
      nodeToBeAdded,
      ...node.children.slice(destIndex),
    ];
  });

  return targetAddedTree;
};
