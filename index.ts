export type TreeNode<T, U> = U & {
  id: T;
  children: Array<TreeNode<T, U>>;
};

export type NodeLocation<T> = {
  parentPath: Array<T>;
  index: number;
};

const doWalk = <T, U>(
  node: TreeNode<T, U>,
  visit: (
    node: TreeNode<T, U>,
    location: NodeLocation<T>,
  ) => void | boolean,
  location: NodeLocation<T>,
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

export const walk = <T, U>(
  rootNode: TreeNode<T, U>,
  visit: (node: TreeNode<T, U>, location: NodeLocation<T>) => void | boolean,
) => {
  doWalk(rootNode, visit, {
    parentPath: [],
    index: 0,
  });
};

export const findNode = <T, U>(
  rootNode: TreeNode<T, U>,
  test: (node: TreeNode<T, U>) => boolean,
): TreeNode<T, U> | undefined => {
  let foundNode: TreeNode<T, U> | undefined;

  walk(rootNode, (node) => {
    if (test(node)) {
      foundNode = node;
      return false;
    }
  });

  return foundNode;
};

export const findNodeById = <T, U>(
  rootNode: TreeNode<T, U>,
  id: T,
): TreeNode<T, U> | undefined => {
  return findNode(rootNode, (node) => node.id === id);
};

export const map = <T, U>(
  node: TreeNode<T, U>,
  mapNode: (node: TreeNode<T, U>) => TreeNode<T, U>,
): TreeNode<T, U> => {
  const mappedNode = mapNode(node);
  return {
    ...mappedNode,
    children: [
      ...mappedNode.children.map((childNode) => map(childNode, mapNode)),
    ],
  };
};

export const copy = <T, U>(
  node: TreeNode<T, U>,
): TreeNode<T, U> => {
  return map(node, (n) => n);
};

export const removeNode = <T, U>(
  rootNode: TreeNode<T, U>,
  id: T,
): [TreeNode<T, U>, TreeNode<T, U> | undefined] => {
  let targetNode: TreeNode<T, U> | undefined;

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

export const addNode = <T, U>(
  rootNode: TreeNode<T, U>,
  nodeToBeAdded: TreeNode<T, U>,
  dest: {
    parentId: T;
    index?: number;
  },
): TreeNode<T, U> => {
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

export const moveNode = <T, U>(
  rootNode: TreeNode<T, U>,
  id: T,
  dest: {
    parentId: T;
    index: number;
  },
): TreeNode<T, U> => {
  const [targetRemoved, targetNode] = removeNode(rootNode, id);
  if (!targetNode) {
    return copy(rootNode);
  }

  return addNode(targetRemoved, targetNode, dest);
};
