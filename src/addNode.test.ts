import { assertEquals, assertThrows } from "testing/asserts";
import { addNode } from "./addNode.ts";
import { TreeNode } from "./types.ts";

Deno.test("addNode()", () => {
  // adding first child
  assertEquals(
    addNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      { id: "x", children: [{ id: "y", children: [] }] },
      {
        parentId: "1",
        index: 0,
      },
    ),
    {
      id: "1",
      children: [
        { id: "x", children: [{ id: "y", children: [] }] }, // to be added
        { id: "1-1", children: [] },
        { id: "1-2", children: [] },
        { id: "1-3", children: [] },
      ],
    },
  );

  // adding last child
  assertEquals(
    addNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      { id: "x", children: [{ id: "y", children: [] }] },
      {
        parentId: "1",
        index: 3,
      },
    ),
    {
      id: "1",
      children: [
        { id: "1-1", children: [] },
        { id: "1-2", children: [] },
        { id: "1-3", children: [] },
        { id: "x", children: [{ id: "y", children: [] }] }, // to be added
      ],
    },
  );

  // adding last child (index is over node array's length)
  assertEquals(
    addNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      { id: "x", children: [{ id: "y", children: [] }] },
      {
        parentId: "1",
        index: 4,
      },
    ),
    {
      id: "1",
      children: [
        { id: "1-1", children: [] },
        { id: "1-2", children: [] },
        { id: "1-3", children: [] },
        { id: "x", children: [{ id: "y", children: [] }] }, // to be added (specified index is 4 but actual destination is 3)
      ],
    },
  );

  // adding last child (default)
  assertEquals(
    addNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      { id: "x", children: [{ id: "y", children: [] }] },
      {
        parentId: "1",
      },
    ),
    {
      id: "1",
      children: [
        { id: "1-1", children: [] },
        { id: "1-2", children: [] },
        { id: "1-3", children: [] },
        { id: "x", children: [{ id: "y", children: [] }] }, // to be added (index not specified)
      ],
    },
  );

  // adding nested node
  assertEquals(
    addNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          {
            id: "1-3",
            children: [
              { id: "1-3-1", children: [] },
              { id: "1-3-2", children: [{ id: "1-3-2-1", children: [] }] },
              { id: "1-3-3", children: [] },
            ],
          },
        ],
      },
      { id: "x", children: [{ id: "y", children: [] }] },
      {
        parentId: "1-3",
        index: 2,
      },
    ),
    {
      id: "1",
      children: [
        { id: "1-1", children: [] },
        { id: "1-2", children: [] },
        {
          id: "1-3",
          children: [
            { id: "1-3-1", children: [] },
            { id: "1-3-2", children: [{ id: "1-3-2-1", children: [] }] },
            { id: "x", children: [{ id: "y", children: [] }] }, // to be added
            { id: "1-3-3", children: [] },
          ],
        },
      ],
    },
  );

  // adding nothing if parent node does not exist
  assertEquals(
    addNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      { id: "x", children: [{ id: "y", children: [] }] },
      {
        parentId: "z",
        index: 0,
      },
    ),
    {
      id: "1",
      children: [
        { id: "1-1", children: [] },
        { id: "1-2", children: [] },
        { id: "1-3", children: [] },
      ],
    },
  );

  // result tree should be a shallow copy
  const original: TreeNode = { id: "1", children: [] };
  assertEquals(
    addNode(original, { id: "x", children: [] }, {
      parentId: "1",
      index: 0,
    }) === original,
    false,
  );

  // throws error if the id of the node to be added is not unique
  assertThrows(() => {
    addNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          {
            id: "1-3",
            children: [
              { id: "1-3-1", children: [] },
            ],
          },
        ],
      },
      { id: "1-2", children: [] },
      { parentId: "1-3", index: 0 },
    );
  });

  // throws error if the id of the node to be added is same as destination node's id
  // (it may cause an infinite loop)
  assertThrows(() => {
    addNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          {
            id: "1-3",
            children: [
              { id: "1-3-1", children: [] },
            ],
          },
        ],
      },
      { id: "x", children: [] },
      { parentId: "x", index: 0 },
    );
  });
});
