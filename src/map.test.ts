import { assertEquals } from "testing/asserts";
import { map } from "./map.ts";
import { TreeNode } from "./types.ts";

Deno.test("map()", () => {
  const testData: TreeNode = {
    id: "1",
    children: [
      { id: "2", children: [{ id: "4", children: [] }] },
      {
        id: "3",
        children: [{ id: "5", children: [{ id: "6", children: [] }] }],
      },
    ],
  };

  const mapped = map(testData, (node) => ({
    id: `#${node.id}`,
    children: node.children,
  }));

  // result should be a shallow copy
  assertEquals(testData === mapped, false);
  assertEquals(mapped, {
    id: "#1",
    children: [
      { id: "#2", children: [{ id: "#4", children: [] }] },
      {
        id: "#3",
        children: [{ id: "#5", children: [{ id: "#6", children: [] }] }],
      },
    ],
  });

  // map to another type of node
  assertEquals(
    map(
      testData,
      ({ id }) => ({ id, data: `#${id}` }),
    ),
    {
      id: "1",
      data: "#1",
      children: [
        {
          id: "2",
          data: "#2",
          children: [{ id: "4", data: "#4", children: [] }],
        },
        {
          id: "3",
          data: "#3",
          children: [{
            id: "5",
            data: "#5",
            children: [{ id: "6", data: "#6", children: [] }],
          }],
        },
      ],
    },
  );
});
