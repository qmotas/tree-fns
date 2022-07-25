import { assertEquals } from "testing/asserts";
import { findNode, findNodeById } from "./findNode.ts";

Deno.test("findNode()", () => {
  // find root node
  assertEquals(
    findNode({
      id: "1",
      children: [
        { id: "2", children: [{ id: "3", children: [] }] },
      ],
    }, (node) => node.id === "1"),
    {
      id: "1",
      children: [{ id: "2", children: [{ id: "3", children: [] }] }],
      location: { parentPath: [], index: 0 },
    },
  );

  // find nested node
  assertEquals(
    findNode({
      id: "1",
      children: [
        { id: "2", children: [{ id: "4", children: [] }] },
        {
          id: "3",
          children: [
            { id: "5", children: [{ id: "7", children: [] }] },
            { id: "6", children: [] },
          ],
        },
      ],
    }, (node) => node.id === "6"),
    {
      id: "6",
      children: [],
      location: { parentPath: ["1", "3"], index: 1 },
    },
  );

  // returns undefined if the node does not exist
  assertEquals(
    findNode({
      id: "1",
      children: [
        { id: "2", children: [{ id: "3", children: [] }] },
      ],
    }, (node) => node.id === "4"),
    undefined,
  );

  // stops traversing when the node is found
  const idTrace: Array<string> = [];
  assertEquals(
    findNode({
      id: "1",
      children: [
        { id: "2", children: [{ id: "4", children: [] }] },
        {
          id: "3",
          children: [{ id: "5", children: [{ id: "6", children: [] }] }],
        },
      ],
    }, (node) => {
      idTrace.push(node.id);
      return node.id === "4";
    }),
    { id: "4", children: [], location: { parentPath: ["1", "2"], index: 0 } },
  );
  assertEquals(idTrace, ["1", "2", "4"]);
});

Deno.test("findNodeById()", () => {
  // find root node
  assertEquals(
    findNodeById({
      id: "1",
      children: [
        { id: "2", children: [{ id: "3", children: [] }] },
      ],
    }, "1"),
    {
      id: "1",
      children: [{ id: "2", children: [{ id: "3", children: [] }] }],
      location: { parentPath: [], index: 0 },
    },
  );

  // find nested node
  assertEquals(
    findNodeById({
      id: "1",
      children: [
        { id: "2", children: [{ id: "4", children: [] }] },
        {
          id: "3",
          children: [
            { id: "5", children: [{ id: "7", children: [] }] },
            { id: "6", children: [] },
          ],
        },
      ],
    }, "6"),
    { id: "6", children: [], location: { parentPath: ["1", "3"], index: 1 } },
  );

  // returns undefined if node not exist
  assertEquals(
    findNodeById({
      id: "1",
      children: [
        { id: "2", children: [{ id: "3", children: [] }] },
      ],
    }, "4"),
    undefined,
  );
});
