import { assertEquals } from "testing/asserts";
import { NodeLocation } from "./types.ts";
import { walk } from "./walk.ts";

Deno.test("walk()", () => {
  const trace: Array<[string, NodeLocation]> = [];

  walk(
    {
      id: "1",
      children: [
        { id: "2", children: [{ id: "4", children: [] }] },
        {
          id: "3",
          children: [{ id: "5", children: [{ id: "6", children: [] }] }],
        },
      ],
    },
    (node, location) => {
      trace.push([node.id, location]);
    },
  );

  const expectedTrace: Array<[string, NodeLocation]> = [
    ["1", { parentPath: [], index: 0 }],
    ["2", { parentPath: ["1"], index: 0 }],
    ["4", { parentPath: ["1", "2"], index: 0 }],
    ["3", { parentPath: ["1"], index: 1 }],
    ["5", { parentPath: ["1", "3"], index: 0 }],
    ["6", { parentPath: ["1", "3", "5"], index: 0 }],
  ];

  assertEquals(trace, expectedTrace);
});

Deno.test("walk() traverses tree until visit returns false", () => {
  const trace: Array<[string, NodeLocation]> = [];

  walk(
    {
      id: "1",
      children: [
        { id: "2", children: [{ id: "5", children: [] }] },
        {
          id: "3",
          children: [{ id: "6", children: [{ id: "7", children: [] }] }],
        },
        { id: "4", children: [] },
      ],
    },
    (node, location) => {
      trace.push([node.id, location]);

      // traverse until node "3"
      return node.id !== "3";
    },
  );

  const expectedTrace: Array<[string, NodeLocation]> = [
    ["1", { parentPath: [], index: 0 }],
    ["2", { parentPath: ["1"], index: 0 }],
    ["5", { parentPath: ["1", "2"], index: 0 }],
    ["3", { parentPath: ["1"], index: 1 }],
  ];

  assertEquals(trace, expectedTrace);
});
