import { TreeNode } from "./types.ts";

export const removeNode = <T>(
  tree: TreeNode<T>,
  id: string,
): [TreeNode<T>, TreeNode<T> | undefined] => {
  const targetNode: TreeNode<T> | undefined = tree.children.find((node) =>
    node.id === id
  );

  if (targetNode) {
    return [
      {
        ...tree,
        children: tree.children.filter((node) => node !== targetNode),
      },
      targetNode,
    ];
  }

  const removeResults = tree.children.map((node) => removeNode(node, id));
  return [{
    ...tree,
    children: removeResults.map(([node]) => node),
  }, removeResults.find(([, removed]) => removed != null)?.[1]];
};
