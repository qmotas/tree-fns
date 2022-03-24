export type TreeNode<T = Record<never, never>> = T & {
  id: string;
  children: Array<TreeNode<T>>;
};

export type NodeLocation = {
  parentPath: Array<string>;
  index: number;
};

export type FindNodeResult<T> = TreeNode<T> & { location: NodeLocation };

export type FlattenedNode<T> = TreeNode<T> & { location: NodeLocation };

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

export const map = <T>(
  node: TreeNode<T>,
  mapNode: (node: TreeNode<T>) => TreeNode<T>,
): TreeNode<T> => {
  const mappedNode = mapNode(node);
  return {
    ...mappedNode,
    children: [
      ...mappedNode.children.map((childNode) => map(childNode, mapNode)),
    ],
  };
};

export const copy = <T>(
  tree: TreeNode<T>,
): TreeNode<T> => {
  return map(tree, (n) => n);
};

export const removeNode = <T>(
  tree: TreeNode<T>,
  id: string,
): [TreeNode<T>, TreeNode<T> | undefined] => {
  let targetNode: TreeNode<T> | undefined;

  const targetRemovedTree = map(tree, (node) => {
    if (targetNode) {
      return { ...node };
    }

    targetNode = node.children.find((childNode) => childNode.id === id);

    return {
      ...node,
      children: [
        ...node.children.filter((childNode) => childNode !== targetNode),
      ],
    };
  });

  return [targetRemovedTree, targetNode];
};

export const addNode = <T>(
  tree: TreeNode<T>,
  nodeToBeAdded: TreeNode<T>,
  dest: {
    parentId: string;
    index?: number;
  },
): TreeNode<T> => {
  const targetAddedTree = map(tree, (srcNode) => {
    if (nodeToBeAdded.id === dest.parentId) {
      throw new Error(
        "The id of node to be added must not be same as destination node's.",
      );
    }

    if (findNodeById(tree, nodeToBeAdded.id)) {
      throw new Error("The id of node to be added must be unique.");
    }

    if (srcNode.id !== dest.parentId) {
      return { ...srcNode };
    }

    const destIndex = dest.index ?? srcNode.children.length;

    return {
      ...srcNode,
      children: [
        ...srcNode.children.slice(0, destIndex),
        nodeToBeAdded,
        ...srcNode.children.slice(destIndex),
      ],
    };
  });

  return targetAddedTree;
};

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

export const flatten = <T>(
  tree: TreeNode<T>,
): Array<FlattenedNode<T>> => {
  const flattened: Array<FlattenedNode<T>> = [];
  walk(tree, (node, location) => {
    flattened.push({ ...node, location });
  });
  return flattened;
};
