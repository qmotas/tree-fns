import {
  addNode,
  copy,
  findNode,
  findNodeById,
  map,
  moveNode,
  NodeLocation,
  removeNode,
  walk,
} from "./index.ts";
import { assertEquals, assertThrows } from "testing/asserts";

Deno.test("walk()", () => {
  const trace: Array<[string, NodeLocation<string>]> = [];

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

  const expectedTrace: Array<[string, NodeLocation<string>]> = [
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
  const trace: Array<[string, NodeLocation<string>]> = [];

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

  const expectedTrace: Array<[string, NodeLocation<string>]> = [
    ["1", { parentPath: [], index: 0 }],
    ["2", { parentPath: ["1"], index: 0 }],
    ["5", { parentPath: ["1", "2"], index: 0 }],
    ["3", { parentPath: ["1"], index: 1 }],
  ];

  assertEquals(trace, expectedTrace);
});

Deno.test("findNode()", () => {
  // find root node
  assertEquals(
    findNode({
      id: "1",
      children: [
        { id: "2", children: [{ id: "3", children: [] }] },
      ],
    }, (node) => node.id === "1"),
    { id: "1", children: [{ id: "2", children: [{ id: "3", children: [] }] }] },
  );

  // find nested node
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
    }, (node) => node.id === "5"),
    { id: "5", children: [{ id: "6", children: [] }] },
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
    { id: "4", children: [] },
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
    { id: "1", children: [{ id: "2", children: [{ id: "3", children: [] }] }] },
  );

  // find nested node
  assertEquals(
    findNodeById({
      id: "1",
      children: [
        { id: "2", children: [{ id: "4", children: [] }] },
        {
          id: "3",
          children: [{ id: "5", children: [{ id: "6", children: [] }] }],
        },
      ],
    }, "5"),
    { id: "5", children: [{ id: "6", children: [] }] },
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

Deno.test("map()", () => {
  const testData = {
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
});

Deno.test("copy()", () => {
  const testData = {
    id: "1",
    children: [
      { id: "2", children: [{ id: "4", children: [] }] },
      {
        id: "3",
        children: [{ id: "5", children: [{ id: "6", children: [] }] }],
      },
    ],
  };

  const copied = copy(testData);

  // result should be a shallow copy
  assertEquals(testData === copied, false);
  assertEquals(testData, copied);
});

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
  const original = { id: "1", children: [] };
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
  const original = { id: "1", children: [] };
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

Deno.test("moveNode()", () => {
  // moving to first at the same depth
  assertEquals(
    moveNode(
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
      "1-2",
      { parentId: "1", index: 0 },
    ),
    {
      id: "1",
      children: [
        { id: "1-2", children: [] }, // moved
        { id: "1-1", children: [] },
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
  );

  // moving to last at the same depth
  assertEquals(
    moveNode(
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
      "1-2",
      { parentId: "1", index: 2 },
    ),
    {
      id: "1",
      children: [
        { id: "1-1", children: [] },
        {
          id: "1-3",
          children: [
            { id: "1-3-1", children: [] },
            { id: "1-3-2", children: [{ id: "1-3-2-1", children: [] }] },
            { id: "1-3-3", children: [] },
          ],
        },
        { id: "1-2", children: [] }, // moved
      ],
    },
  );

  // moving between the different depths (and destination index is over the node list's length)
  assertEquals(
    moveNode(
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
      "1-2",
      { parentId: "1-3-2-1", index: 1 },
    ),
    {
      id: "1",
      children: [
        { id: "1-1", children: [] },
        {
          id: "1-3",
          children: [
            { id: "1-3-1", children: [] },
            {
              id: "1-3-2",
              children: [
                {
                  id: "1-3-2-1",
                  children: [
                    { id: "1-2", children: [] }, // moved
                  ],
                },
              ],
            },
            { id: "1-3-3", children: [] },
          ],
        },
      ],
    },
  );

  // root node cannot be moved
  assertEquals(
    moveNode(
      {
        id: "1",
        children: [
          { id: "1-1", children: [] },
          { id: "1-2", children: [] },
        ],
      },
      "1",
      { parentId: "1-1", index: 0 },
    ),
    {
      id: "1",
      children: [
        { id: "1-1", children: [] },
        { id: "1-2", children: [] },
      ],
    },
  );
});
