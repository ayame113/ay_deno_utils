import { testing } from "../std_deps.ts";
const { assertEquals } = testing.asserts;

import { range } from "./mod.js";

Deno.test({
  name: "range0",
  fn: () => {
    assertEquals(range(0).excute(), []);
  },
});

Deno.test({
  name: "range1",
  fn: () => {
    assertEquals(range(5).excute(), [0, 1, 2, 3, 4]);
  },
});

Deno.test({
  name: "range2",
  fn: () => {
    assertEquals([...range(5)], [0, 1, 2, 3, 4]);
  },
});

Deno.test({
  name: "range3",
  fn: () => {
    assertEquals([...range(5, 10)], [5, 6, 7, 8, 9]);
  },
});

Deno.test({
  name: "range4",
  fn: () => {
    assertEquals([...range(5, 10, 2)], [5, 7, 9]);
  },
});

Deno.test({
  name: "range5",
  fn: () => {
    assertEquals([...range(5).map((v) => v + 1).filter((n) => n < 4)], [
      1,
      2,
      3,
    ]);
  },
});
