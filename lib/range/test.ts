import { range } from "./mod.js";
Deno.test({
  name: "range1",
  fn: async () => {
    const {
      assertEquals,
    } = await import("https://deno.land/std@0.97.0/testing/asserts.ts");
    assertEquals(range(5).excute(), [0, 1, 2, 3, 4]);
  },
});
Deno.test({
  name: "range2",
  fn: async () => {
    const {
      assertEquals,
    } = await import("https://deno.land/std@0.97.0/testing/asserts.ts");
    assertEquals([...range(5)], [0, 1, 2, 3, 4]);
  },
});
