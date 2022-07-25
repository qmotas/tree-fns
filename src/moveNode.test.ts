import { assertEquals, assertThrows } from "testing/asserts";
import { moveNode } from "./moveNode.ts";

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

  // moving to last at the same depth (when index not specified)
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
      { parentId: "1" },
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

  // throws error if destination node does not exist
  assertThrows(() => {
    moveNode(
      {
        id: "1",
        children: [
          {
            id: "1-1",
            children: [
              { id: "1-1-1", children: [] },
            ],
          },
          { id: "1-2", children: [] },
        ],
      },
      "1-1",
      {
        parentId: "1-3",
        index: 0,
      },
    );
  });

  // throws error if destination node is a descendant node of the source node
  assertThrows(() => {
    moveNode(
      {
        id: "1",
        children: [
          {
            id: "1-1",
            children: [
              { id: "1-1-1", children: [] },
            ],
          },
          { id: "1-2", children: [] },
        ],
      },
      "1-1",
      {
        parentId: "1-1-1",
        index: 0,
      },
    );
  });
});
