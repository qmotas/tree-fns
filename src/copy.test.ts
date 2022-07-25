import { assertEquals } from "testing/asserts";
import { copy } from "./copy.ts";

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
