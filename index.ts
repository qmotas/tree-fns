export type TreeNode<T> = T & {
  id: string;
  children: Array<TreeNode<T>>;
};

export type NodeLocation = {
  parentPath: Array<string>;
  index: number;
};

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
  rootNode: TreeNode<T>,
  visit: (node: TreeNode<T>, location: NodeLocation) => void | boolean,
) => {
  doWalk(rootNode, visit, {
    parentPath: [],
    index: 0,
  });
};

export const findNode = <T>(
  rootNode: TreeNode<T>,
  test: (node: TreeNode<T>) => boolean,
): TreeNode<T> | undefined => {
  let foundNode: TreeNode<T> | undefined;

  walk(rootNode, (node) => {
    if (test(node)) {
      foundNode = node;
      return false;
    }
  });

  return foundNode;
};

export const findNodeById = <T>(
  rootNode: TreeNode<T>,
  id: string,
): TreeNode<T> | undefined => {
  return findNode(rootNode, (node) => node.id === id);
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
  node: TreeNode<T>,
): TreeNode<T> => {
  return map(node, (n) => n);
};

export const removeNode = <T>(
  rootNode: TreeNode<T>,
  id: string,
): [TreeNode<T>, TreeNode<T> | undefined] => {
  let targetNode: TreeNode<T> | undefined;

  const targetRemovedRootNode = map(rootNode, (node) => {
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

  return [targetRemovedRootNode, targetNode];
};

export const addNode = <T>(
  rootNode: TreeNode<T>,
  nodeToBeAdded: TreeNode<T>,
  dest: {
    parentId: string;
    index?: number;
  },
): TreeNode<T> => {
  const targetAddedRootNode = map(rootNode, (srcNode) => {
    if (nodeToBeAdded.id === dest.parentId) {
      throw new Error(
        "The id of node to be added must not be same as destination node's.",
      );
    }

    if (findNodeById(rootNode, nodeToBeAdded.id)) {
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

  return targetAddedRootNode;
};

export const moveNode = <T>(
  rootNode: TreeNode<T>,
  id: string,
  dest: {
    parentId: string;
    index: number;
  },
): TreeNode<T> => {
  const [targetRemoved, targetNode] = removeNode(rootNode, id);
  if (!targetNode) {
    return copy(rootNode);
  }

  return addNode(targetRemoved, targetNode, dest);
};
