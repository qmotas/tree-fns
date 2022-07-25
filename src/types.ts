export type TreeNode<T = Record<never, never>> = T & {
  id: string;
  children: Array<TreeNode<T>>;
};

export type NodeLocation = {
  parentPath: Array<string>;
  index: number;
};

export type NodeWithLocation<T> = [TreeNode<T>, NodeLocation];
