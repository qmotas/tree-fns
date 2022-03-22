[![codecov](https://codecov.io/gh/qmotas/tree-fns/branch/main/graph/badge.svg?token=26G67Q20ZF)](https://codecov.io/gh/qmotas/tree-fns)

# tree-fns

**tree-fns** provides simple utility functions for tree structure.

Each transformation function is non-destructive, making it suitable for working
with immutable tree structures, for example, when using Recoil.

## Development

### Prerequisite

- deno >= 1.20

### Setup

If you're using Velociraptor, run

```sh
vr
```

and pre-commit hook will be installed.

## Model

```ts
const tree: TreeNode = {
  id: 'root',
  children: [
    {
      id: '1',
      children: [],
    },
    {
      id: '2',
      children: [],
    },
  ],
};
```

```ts
const tree: TreeNode<{ data: string }> = {
  id: 'root',
  data: 'yay',
  children: [],
};
```

## Functions

### `walk(tree, visit)`

Only pre-order traversing is supported.

```ts
walk(
  {
    id: 'root',
    children: [
      {
        id: '1',
        children: [{ id: '1-1', children: [] }],
      },
      {
        id: '2',
        children: [{ id: '2-1', children: [] }],
      },
    ],
  },
  (node, location) => {
    console.log(node.id); // "root" -> "1" -> "1-1" -> "2" -> "2-1"
    if (node.id === '1') {
      console.log(location); // { parentPath: ["root"], index: 0 }
    }
  }
);
```

### `findNode(tree, test)` | `findNodeById(tree, id)`

```ts
const tree: TreeNode = {
  id: 'root',
  children: [
    {
      id: '1',
      children: [{ id: '1-1', children: [] }],
    },
    {
      id: '2',
      children: [{ id: '2-1', children: [] }],
    },
  ],
};

const node = findNode(tree, (node) => node.id === '1');
// {
//   id: '1',
//   children: [{ id: '1-1', children: [] }],
//   location: {
//     parentPath: ['root'],
//     index: 0,
//   },
// }

findNode(tree, (node) => node.id === 'x'); // undefined
```

or

```ts
const node = findNodeById(tree, '1');
```

### `map(tree, mapNode)`

```ts
const tree: TreeNode<{ data: string }> = {
  id: '1',
  data: 'foo',
  children: [
    {
      id: '2',
      data: 'bar',
      children: [],
    },
  ],
};

const mapped = map<{ data: string }>(tree, (node) => ({
  ...node,
  data: `#${node.data}`,
}));
// {
//   id: '1',
//   data: '#foo',
//   children: [
//     {
//       id: '2',
//       data: '#bar',
//       children: [],
//     },
//   ],
// }
```

### `copy(tree)`

```ts
const tree = {
  id: '1',
  children: [{ id: '2', children: [] }],
};

const copied = copy(tree);
// {
//   id: '1',
//   children: [{ id: '2', children: [] }],
// }

console.log(tree === copied); // false
```

### `addNode(tree, nodeToBeAdded, dest)`

```ts
const srcTree = {
  id: '1',
  children: [{ id: '2', children: [] }],
};

const nodeToBeAdded = { id: '3', children: [] };

const destTree = addNode(srcTree, nodeToBeAdded, { parentId: '1', index: 0 });
// {
//   id: '1',
//   children: [
//     { id: '3', children: [] },
//     { id: '2', children: [] },
//   ],
// }
```

### `removeNode(tree, id)`

```ts
const srcTree = {
  id: '1',
  children: [
    { id: '2', children: [] },
    { id: '3', children: [] },
  ],
};
const [destTree, removedNode] = removeNode(srcTree, '3');

console.log(removedNode); // { id: '3', children: [] }
console.log(destTree);
// {
//   id: '1',
//   children: [
//     { id: '2', children: [] },
//   ],
// }

removeNode(srcTree, 'x'); // undefined
```

### `moveNode(tree, id, dest)`

```ts
const srcTree = {
  id: '1',
  children: [
    { id: '2', children: [] },
    { id: '3', children: [] },
  ],
};

const destTree = moveNode(srcTree, '2', { parentId: '3', index: 0 });
// {
//   id: '1',
//   children: [
//     { id: '3', children: [
//       { id: '2', children: [] }
//     ] }
//   ],
// }
```

### `flatten(tree)`

```ts
const tree = {
  id: '1',
  children: [
    { id: '2', children: [] },
    { id: '3', children: [] },
  ],
};

const flattened = flatten(tree);
// [
//   {
//     id: '1',
//     children: [
//       { id: '2', children: [] },
//       { id: '3', children: [] },
//     ],
//     location: { parentPath: [], index: 0 },
//   },
//   { id: '2', children: [], location: { parentPath: ['1'], index: 0 } },
//   { id: '3', children: [], location: { parentPath: ['1'], index: 1 } },
// ]
```
