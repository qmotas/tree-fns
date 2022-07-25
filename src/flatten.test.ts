import { assertEquals } from "testing/asserts";
import { flatten } from "./flatten.ts";

Deno.test("flatten()", () => {
  assertEquals(
    flatten(
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
              { id: "1-3-2", children: [{ id: "1-3-2-1", children: [] }] },
              { id: "1-3-3", children: [] },
            ],
          },
        ],
        location: {
          parentPath: [],
          index: 0,
        },
      },
      {
        id: "1-1",
        children: [],
        location: {
          parentPath: ["1"],
          index: 0,
        },
      },
      {
        id: "1-2",
        children: [],
        location: {
          parentPath: ["1"],
          index: 1,
        },
      },
      {
        id: "1-3",
        children: [
          { id: "1-3-1", children: [] },
          { id: "1-3-2", children: [{ id: "1-3-2-1", children: [] }] },
          { id: "1-3-3", children: [] },
        ],
        location: {
          parentPath: ["1"],
          index: 2,
        },
      },
      {
        id: "1-3-1",
        children: [],
        location: {
          parentPath: ["1", "1-3"],
          index: 0,
        },
      },
      {
        id: "1-3-2",
        children: [{ id: "1-3-2-1", children: [] }],
        location: {
          parentPath: ["1", "1-3"],
          index: 1,
        },
      },
      {
        id: "1-3-2-1",
        children: [],
        location: {
          parentPath: ["1", "1-3", "1-3-2"],
          index: 0,
        },
      },
      {
        id: "1-3-3",
        children: [],
        location: {
          parentPath: ["1", "1-3"],
          index: 2,
        },
      },
    ],
  );
});
