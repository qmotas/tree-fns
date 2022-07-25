import { assertEquals } from "testing/asserts";
import { removeNode } from "./removeNode.ts";
import { TreeNode } from "./types.ts";

Deno.test("removeNode()", () => {
  // produces unchanged tree and undefined when target node does not exist
  assertEquals(
    removeNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      "x",
    ),
    [
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      undefined,
    ],
  );

  // result tree should be a shallow copy
  const original: TreeNode = { id: "1", children: [] };
  assertEquals(removeNode(original, "x")[0] === original, false);

  // root node cannot be removed
  assertEquals(
    removeNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      "1",
    ),
    [
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      undefined,
    ],
  );

  // remove first child
  assertEquals(
    removeNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      "1-1",
    ),
    [
      {
        id: "1",
        children: [
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      { id: "1-1", children: [] },
    ],
  );

  // remove last child
  assertEquals(
    removeNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          { id: "1-3", children: [] },
        ],
      },
      "1-3",
    ),
    [
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
        ],
      },
      { id: "1-3", children: [] },
    ],
  );

  // remove nested node
  assertEquals(
    removeNode(
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
      "1-3-2",
    ),
    [
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
          {
            id: "1-3",
            children: [
              { id: "1-3-1", children: [] },
              { id: "1-3-3", children: [] },
            ],
          },
        ],
      },
      { id: "1-3-2", children: [{ id: "1-3-2-1", children: [] }] },
    ],
  );
});
