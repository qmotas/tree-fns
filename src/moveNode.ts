import { addNode } from "./addNode.ts";
import { copy } from "./copy.ts";
import { findNodeById } from "./findNode.ts";
import { removeNode } from "./removeNode.ts";
import { TreeNode } from "./types.ts";

export const moveNode = <T>(
  tree: TreeNode<T>,
  id: string,
  dest: {
    parentId: string;
    index?: number;
  },
): TreeNode<T> => {
  const [targetRemoved, targetNode] = removeNode(tree, id);
  if (!targetNode) {
    return copy(tree);
  }

  if (!findNodeById(tree, dest.parentId)) {
    throw new Error(`Destination node (id:${dest.parentId}) does not exist.`);
  }

  if (findNodeById(targetNode, dest.parentId)) {
    throw new Error(
      `Target node (id:${id}) cannot be moved into its descendant node (id:${dest.parentId}).`,
    );
  }

  return addNode(targetRemoved, targetNode, dest);
};
